import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PaymentGatewayAdapter, CreateInvoiceInput, InvoiceResult } from './payment-gateway.interface.js';

@Injectable()
export class XenditAdapter implements PaymentGatewayAdapter {
  private readonly logger = new Logger(XenditAdapter.name);
  private readonly baseUrl = 'https://api.xendit.co/v2/invoices';

  /**
   * Creates an invoice using merchant's own decrypted Xendit Secret Key
   */
  async createInvoice(apiKey: string, input: CreateInvoiceInput): Promise<InvoiceResult> {
    try {
      const basicAuth = Buffer.from(`${apiKey}:`).toString('base64');

      const payload = {
        external_id: input.externalId,
        amount: input.amount,
        payer_email: input.customer.email || 'customer@store.com',
        description: input.description,
        customer: {
          given_names: input.customer.givenNames,
          mobile_number: input.customer.mobileNumber,
          email: input.customer.email,
        },
        success_redirect_url: input.successRedirectUrl,
        failure_redirect_url: input.failureRedirectUrl,
        currency: 'IDR',
        invoice_duration: 86400, // 24 hours
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => ({}))) as any;
        this.logger.error(`Xendit API error: ${JSON.stringify(errorBody)}`);
        throw new BadRequestException(errorBody.message || 'Xendit invoice creation failed');
      }

      const data = (await response.json()) as any;

      return {
        invoiceId: data.id,
        externalId: data.external_id,
        status: data.status === 'SETTLED' || data.status === 'PAID' ? 'PAID' : 'PENDING',
        invoiceUrl: data.invoice_url,
        expiryDate: data.expiry_date,
        amount: data.amount,
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to create Xendit invoice: ${msg}`);
      throw error;
    }
  }

  /**
   * Verifies incoming callback token from Xendit webhook against merchant's configured webhook token
   */
  verifyWebhook(expectedToken: string, incomingToken: string): boolean {
    if (!expectedToken || !incomingToken) return false;
    return expectedToken === incomingToken;
  }
}
