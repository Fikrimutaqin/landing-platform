var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Ga4Service_1;
import { Injectable, Logger } from '@nestjs/common';
let Ga4Service = Ga4Service_1 = class Ga4Service {
    logger = new Logger(Ga4Service_1.name);
    async sendPurchase(measurementId, apiSecret, payload) {
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
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            this.logger.error(`Error sending GA4 event: ${msg}`);
            return false;
        }
    }
};
Ga4Service = Ga4Service_1 = __decorate([
    Injectable()
], Ga4Service);
export { Ga4Service };
//# sourceMappingURL=ga4.service.js.map