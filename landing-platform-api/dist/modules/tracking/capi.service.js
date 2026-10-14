var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CapiService_1;
import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
let CapiService = CapiService_1 = class CapiService {
    logger = new Logger(CapiService_1.name);
    hashData(value) {
        if (!value)
            return undefined;
        return crypto
            .createHash('sha256')
            .update(value.trim().toLowerCase())
            .digest('hex');
    }
    async sendEvent(pixelId, accessToken, payload) {
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
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            this.logger.error(`Error sending Meta CAPI event: ${msg}`);
            return false;
        }
    }
};
CapiService = CapiService_1 = __decorate([
    Injectable()
], CapiService);
export { CapiService };
//# sourceMappingURL=capi.service.js.map