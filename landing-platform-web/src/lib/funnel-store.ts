import { FunnelPipeline, FunnelPipelineStep } from '../../../shared/types';
import { LocalPersistence } from './local-persistence';

const STORAGE_KEY = 'lp_funnel_pipeline';

export const DEFAULT_ECOMMERCE_PIPELINE: FunnelPipeline = {
  id: 'funnel_ecommerce_main',
  organizationId: 'org_orderonline',
  name: 'Main E-Commerce Funnel (4-Step)',
  description: 'Alur lengkap e-commerce: Katalog -> Checkout -> Instruksi Pembayaran QRIS/VA -> Halaman Sukses.',
  isDefault: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  steps: [
    {
      id: 'step_1_sales',
      stepNumber: 1,
      name: '1. Katalog & Sales Page',
      slug: 'sales-page',
      pageId: 'page_sales_page',
      type: 'SALES_PAGE',
      description: 'Halaman etalase produk pilihan dengan filter kategori, ulasan pelanggan, dan tombol Beli Langsung / Tambah Keranjang.',
      nextStepSlug: 'checkout-page',
      nextStepUrl: '/p/checkout-page',
      status: 'ACTIVE',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'step_2_checkout',
      stepNumber: 2,
      name: '2. Formulir Checkout',
      slug: 'checkout-page',
      pageId: 'page_checkout_page',
      type: 'CHECKOUT',
      description: 'Halaman khusus data diri penerima, pilihan kurir pengiriman fisik, kupon promo, dan pemilihan metode bayar (QRIS/VA).',
      nextStepSlug: 'payment-instruction',
      nextStepUrl: '/p/payment-instruction',
      status: 'ACTIVE',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'step_3_payment',
      stepNumber: 3,
      name: '3. Instruksi Pembayaran Tagihan',
      slug: 'payment-instruction',
      pageId: 'page_payment_instruction',
      type: 'PAYMENT_INSTRUCTION',
      description: 'Halaman khusus kode bayar QRIS dinamis & nomor Virtual Account bank dengan timer countdown 24 jam dan tombol simulasi.',
      nextStepSlug: 'thank-you-page',
      nextStepUrl: '/p/thank-you-page',
      status: 'ACTIVE',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'step_4_thankyou',
      stepNumber: 4,
      name: '4. Konfirmasi Pembayaran & Sukses',
      slug: 'thank-you-page',
      pageId: 'page_thank_you_page',
      type: 'THANK_YOU',
      description: 'Halaman tanda terima lunas resmi, nomor resi pengiriman fisik atau link unduh modul produk digital.',
      nextStepSlug: 'sales-page',
      nextStepUrl: '/p/sales-page',
      status: 'ACTIVE',
      updatedAt: new Date().toISOString(),
    },
  ],
};

type FunnelListener = (pipeline: FunnelPipeline) => void;

export class FunnelStore {
  private static listeners: Set<FunnelListener> = new Set();

  public static getPipeline(): FunnelPipeline {
    if (typeof window === 'undefined') return DEFAULT_ECOMMERCE_PIPELINE;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_ECOMMERCE_PIPELINE;
  }

  public static savePipeline(pipeline: FunnelPipeline): void {
    if (typeof window === 'undefined') return;
    try {
      pipeline.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pipeline));
      this.notify(pipeline);
    } catch {
      // Ignore write errors
    }
  }

  public static updateStepConnection(stepId: string, nextStepSlug: string): FunnelPipeline {
    const pipeline = this.getPipeline();
    const cleanSlug = (nextStepSlug || '').replace(/^\/+/, '').replace(/^p\//, '').trim();
    const nextStepUrl = cleanSlug.startsWith('http') ? cleanSlug : `/p/${cleanSlug}`;

    pipeline.steps = pipeline.steps.map((s: FunnelPipelineStep) => {
      if (s.id === stepId) {
        return {
          ...s,
          nextStepSlug: cleanSlug,
          nextStepUrl,
          updatedAt: new Date().toISOString(),
        };
      }
      return s;
    });

    // Automatically synchronize page draft blocks if present in LocalPersistence
    const modifiedStep = pipeline.steps.find((s: FunnelPipelineStep) => s.id === stepId);
    if (modifiedStep && modifiedStep.pageId) {
      this.syncStepToPageBlocks(modifiedStep.pageId, cleanSlug, nextStepUrl);
    }

    this.savePipeline(pipeline);
    return pipeline;
  }

  public static addStep(step: Omit<FunnelPipelineStep, 'id' | 'stepNumber'>): FunnelPipeline {
    const pipeline = this.getPipeline();
    const newStep: FunnelPipelineStep = {
      ...step,
      id: `step_${Date.now()}_${step.slug}`,
      stepNumber: pipeline.steps.length + 1,
      nextStepUrl: step.nextStepSlug ? (step.nextStepSlug.startsWith('http') ? step.nextStepSlug : `/p/${step.nextStepSlug}`) : undefined,
    };
    pipeline.steps.push(newStep);
    this.savePipeline(pipeline);
    return pipeline;
  }

  public static removeStep(stepId: string): FunnelPipeline {
    const pipeline = this.getPipeline();
    pipeline.steps = pipeline.steps
      .filter((s: FunnelPipelineStep) => s.id !== stepId)
      .map((s: FunnelPipelineStep, idx: number) => ({ ...s, stepNumber: idx + 1 }));
    this.savePipeline(pipeline);
    return pipeline;
  }

  public static reorderSteps(reorderedSteps: FunnelPipelineStep[]): FunnelPipeline {
    const pipeline = this.getPipeline();
    pipeline.steps = reorderedSteps.map((s: FunnelPipelineStep, idx: number) => ({ ...s, stepNumber: idx + 1 }));
    this.savePipeline(pipeline);
    return pipeline;
  }

  public static resetToDefault(): FunnelPipeline {
    this.savePipeline(DEFAULT_ECOMMERCE_PIPELINE);
    return DEFAULT_ECOMMERCE_PIPELINE;
  }

  public static subscribe(listener: FunnelListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private static notify(pipeline: FunnelPipeline): void {
    this.listeners.forEach((listener) => {
      try {
        listener(pipeline);
      } catch {
        // Ignore subscriber failures
      }
    });
  }

  /**
   * Helper to update the relevant block props inside the page draft
   */
  private static syncStepToPageBlocks(pageId: string, targetSlug: string, targetUrl: string): void {
    try {
      const draft = LocalPersistence.loadDraft(pageId);
      if (!draft || !draft.blocks || !Array.isArray(draft.blocks)) return;

      let changed = false;
      const updatedBlocks = draft.blocks.map((block: any) => {
        // If PRODUCT_CATALOG block, update checkoutPageUrl
        if (block.type === 'PRODUCT_CATALOG') {
          changed = true;
          return {
            ...block,
            content: {
              ...(block.content || {}),
              checkoutPageUrl: targetUrl,
            },
          };
        }
        // If CHECKOUT_FORM block, update paymentPageUrl
        if (block.type === 'CHECKOUT_FORM') {
          changed = true;
          return {
            ...block,
            content: {
              ...(block.content || {}),
              paymentPageUrl: targetUrl,
            },
          };
        }
        // If PAYMENT_INSTRUCTION block, update successPageUrl
        if (block.type === 'PAYMENT_INSTRUCTION') {
          changed = true;
          return {
            ...block,
            content: {
              ...(block.content || {}),
              successPageUrl: targetUrl,
            },
          };
        }
        // If SUCCESS_PAGE block, update storePageUrl
        if (block.type === 'SUCCESS_PAGE') {
          changed = true;
          return {
            ...block,
            content: {
              ...(block.content || {}),
              storePageUrl: targetUrl,
            },
          };
        }
        return block;
      });

      if (changed) {
        LocalPersistence.saveDraft(pageId, {
          ...draft,
          blocks: updatedBlocks,
        });
      }
    } catch {
      // Ignore
    }
  }
}
