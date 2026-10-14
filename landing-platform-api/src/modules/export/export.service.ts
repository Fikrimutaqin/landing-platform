import { Injectable } from '@nestjs/common';

export interface ExportPageInput {
  title: string;
  pageId: string;
  organizationId: string;
  theme: {
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
  };
  blocks: any[];
  tracking?: {
    fbPixelId?: string;
    ga4MeasurementId?: string;
  };
}

@Injectable()
export class ExportService {
  /**
   * Compiles JSON block tree into a standalone HTML/CSS/JS boilerplate
   */
  generateStaticBundle(input: ExportPageInput): { html: string; css: string; js: string } {
    const css = this.generateCss(input.theme);
    const js = this.generateJs(input);
    const html = this.generateHtml(input, css, js);

    return { html, css, js };
  }

  private generateCss(theme: { primaryColor: string; accentColor: string; fontFamily: string }): string {
    return `
      :root {
        --primary: ${theme.primaryColor || '#4f46e5'};
        --accent: ${theme.accentColor || '#06b6d4'};
        --font: ${theme.fontFamily || 'Inter, system-ui, sans-serif'};
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: var(--font); color: #1e293b; background: #0f172a; line-height: 1.6; }
      .container { max-width: 960px; margin: 0 auto; padding: 2rem 1rem; }
      .hero { text-align: center; padding: 4rem 1rem; background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); border-radius: 1.5rem; margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.1); }
      .hero h1 { font-size: 2.75rem; font-weight: 800; color: #f8fafc; margin-bottom: 1rem; line-height: 1.2; }
      .hero p { font-size: 1.25rem; color: #94a3b8; max-width: 650px; margin: 0 auto 2rem; }
      .btn-cta { display: inline-block; background: var(--primary); color: white; padding: 1rem 2.5rem; font-size: 1.125rem; font-weight: 700; border-radius: 9999px; text-decoration: none; border: none; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 10px 25px rgba(79, 70, 229, 0.4); }
      .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(79, 70, 229, 0.6); }
      .card { background: #1e293b; border-radius: 1.25rem; padding: 2rem; margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.08); color: #f8fafc; }
      .form-group { margin-bottom: 1.25rem; }
      .form-group label { display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; color: #cbd5e1; }
      .form-input { width: 100%; padding: 0.875rem 1rem; border-radius: 0.75rem; border: 1px solid #334155; background: #0f172a; color: white; font-size: 1rem; outline: none; }
      .form-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.25); }
      .price-tag { font-size: 2rem; font-weight: 800; color: #38bdf8; margin: 1rem 0; }
      .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; background: rgba(56, 189, 248, 0.15); color: #38bdf8; font-size: 0.875rem; font-weight: 600; margin-bottom: 1rem; }
    `;
  }

  private generateJs(input: ExportPageInput): string {
    return `
      function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

      var currentEventId = uuidv4();

      // Trigger InitiateCheckout on form interaction
      var form = document.getElementById('checkout-form');
      if (form) {
        form.addEventListener('focusin', function() {
          if (window.fbq) { window.fbq('track', 'InitiateCheckout', {}, { eventID: currentEventId }); }
        }, { once: true });

        form.addEventListener('submit', async function(e) {
          e.preventDefault();
          var btn = document.getElementById('submit-btn');
          btn.disabled = true;
          btn.innerText = 'Processing Payment...';

          var payload = {
            pageId: '${input.pageId}',
            productId: form.dataset.productId || 'default',
            quantity: 1,
            customer: {
              name: document.getElementById('cust-name').value,
              phone: document.getElementById('cust-phone').value,
              email: document.getElementById('cust-email')?.value,
              address: { street: document.getElementById('cust-address')?.value || '' }
            },
            trackingContext: { eventId: currentEventId }
          };

          try {
            var res = await fetch('/api/v1/public/checkout/${input.pageId}', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            var data = await res.json();
            if (data.paymentUrl) {
              window.location.href = data.paymentUrl;
            } else {
              alert('Order placed successfully! Order ID: ' + data.orderId);
            }
          } catch (err) {
            alert('Failed to place order. Please try again.');
            btn.disabled = false;
            btn.innerText = 'Complete Order';
          }
        });
      }
    `;
  }

  private generateHtml(input: ExportPageInput, css: string, js: string): string {
    const fbPixelSnippet = input.tracking?.fbPixelId
      ? `
      <script>
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${input.tracking.fbPixelId}');
        fbq('track', 'PageView');
      </script>
      `
      : '';

    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${input.title}</title>
  <style>${css}</style>
  ${fbPixelSnippet}
</head>
<body>
  <div class="container">
    <div class="hero">
      <span class="badge">🔥 Penawaran Eksklusif Terbatas</span>
      <h1>${input.title}</h1>
      <p>Tingkatkan penjualan bisnis Anda dengan solusi landing page otomatis dan pembayaran instan Xendit.</p>
      <a href="#checkout-section" class="btn-cta">Pesan Sekarang</a>
    </div>

    <div class="card" id="checkout-section">
      <h2>Formulir Pemesanan Cepat</h2>
      <p style="color: #94a3b8; margin-bottom: 1.5rem;">Isi formulir berikut dan Anda akan diarahkan ke instruksi pembayaran resmi.</p>
      <form id="checkout-form">
        <div class="form-group">
          <label for="cust-name">Nama Lengkap</label>
          <input type="text" id="cust-name" class="form-input" required placeholder="Contoh: Budi Santoso" />
        </div>
        <div class="form-group">
          <label for="cust-phone">Nomor WhatsApp / HP</label>
          <input type="tel" id="cust-phone" class="form-input" required placeholder="Contoh: 081234567890" />
        </div>
        <div class="form-group">
          <label for="cust-email">Alamat Email (Opsional)</label>
          <input type="email" id="cust-email" class="form-input" placeholder="budi@example.com" />
        </div>
        <div class="form-group">
          <label for="cust-address">Alamat Pengiriman</label>
          <input type="text" id="cust-address" class="form-input" required placeholder="Jl. Sudirman No. 123, Jakarta" />
        </div>
        <button type="submit" id="submit-btn" class="btn-cta" style="width: 100%; border-radius: 0.75rem;">Selesaikan Pembayaran</button>
      </form>
    </div>
  </div>
  <script>${js}</script>
</body>
</html>`;
  }
}
