import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

export interface CapiEventPayload {
  eventName: string;
  eventId: string;
  eventTime: number;
  sourceUrl: string;
  userData: {
    email?: string;
    phone?: string;
    clientIp?: string;
    userAgent?: string;
    fbp?: string;
    fbc?: string;
  };
  customData?: {
    currency?: string;
    value?: number;
    orderId?: string;
    productTitle?: string;
  };
}

@Injectable()
export class CapiService {
  private readonly logger = new Logger(CapiService.name);

  private hashData(value?: string): string | undefined {
    if (!value) return undefined;
    return crypto
      .createHash('sha256')
      .update(value.trim().toLowerCase())
      .digest('hex');
  }

  async sendEvent(pixelId: string, accessToken: string, payload: CapiEventPayload): Promise<boolean> {
    try {
      const endpoint = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;

      const metaEvent = {
        event_name: payload.eventName,
        event_time: payload.eventTime || Math.floor(Date.now() / 1000),
        event_id: payload.eventId,
        event_source_url: payload.sourceUrl,
        action_source: 'website',
        user_data: {
          em: payload.userData.email ? [this.hashData(payload.userData.email)] : undefined,
          ph: payload.userData.phone ? [this.hashData(payload.userData.phone)] : undefined,
          client_ip_address: payload.userData.clientIp,
          client_user_agent: payload.userData.userAgent,
          fbp: payload.userData.fbp,
          fbc: payload.userData.fbc,
        },
        custom_data: payload.customData
          ? {
              currency: payload.customData.currency || 'IDR',
              value: payload.customData.value,
              content_name: payload.customData.productTitle,
              order_id: payload.customData.orderId,
            }
          : undefined,
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [metaEvent] }),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        this.logger.warn(`Meta CAPI response error: ${JSON.stringify(errorJson)}`);
        return false;
      }

      this.logger.log(`Meta CAPI event [${payload.eventName}] dispatched successfully with event_id: ${payload.eventId}`);
      return true;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error sending Meta CAPI event: ${msg}`);
      return false;
    }
  }
}
