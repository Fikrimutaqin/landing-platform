import { Injectable, Logger } from '@nestjs/common';

export interface Ga4PurchasePayload {
  clientId: string;
  transactionId: string;
  value: number;
  currency?: string;
  itemName: string;
  quantity?: number;
}

@Injectable()
export class Ga4Service {
  private readonly logger = new Logger(Ga4Service.name);

  async sendPurchase(
    measurementId: string,
    apiSecret: string,
    payload: Ga4PurchasePayload,
  ): Promise<boolean> {
    try {
      const endpoint = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;

      const body = {
        client_id: payload.clientId || 'anonymous-client',
        events: [
          {
            name: 'purchase',
            params: {
              transaction_id: payload.transactionId,
              value: payload.value,
              currency: payload.currency || 'IDR',
              items: [
                {
                  item_name: payload.itemName,
                  quantity: payload.quantity || 1,
                  price: payload.value,
                },
              ],
            },
          },
        ],
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        this.logger.warn(`GA4 Measurement Protocol error status: ${res.status}`);
        return false;
      }

      this.logger.log(`GA4 purchase event sent for transaction: ${payload.transactionId}`);
      return true;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error sending GA4 event: ${msg}`);
      return false;
    }
  }
}
