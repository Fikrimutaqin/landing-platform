var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var XenditAdapter_1;
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
let XenditAdapter = XenditAdapter_1 = class XenditAdapter {
    logger = new Logger(XenditAdapter_1.name);
    baseUrl = 'https://api.xendit.co/v2/invoices';
    async createInvoice(apiKey, input) {
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
                invoice_duration: 86400,
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
                const errorBody = (await response.json().catch(() => ({})));
                this.logger.error(`Xendit API error: ${JSON.stringify(errorBody)}`);
                throw new BadRequestException(errorBody.message || 'Xendit invoice creation failed');
            }
            const data = (await response.json());
            return {
                invoiceId: data.id,
                externalId: data.external_id,
                status: data.status === 'SETTLED' || data.status === 'PAID' ? 'PAID' : 'PENDING',
                invoiceUrl: data.invoice_url,
                expiryDate: data.expiry_date,
                amount: data.amount,
            };
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to create Xendit invoice: ${msg}`);
            throw error;
        }
    }
    verifyWebhook(expectedToken, incomingToken) {
        if (!expectedToken || !incomingToken)
            return false;
        return expectedToken === incomingToken;
    }
};
XenditAdapter = XenditAdapter_1 = __decorate([
    Injectable()
], XenditAdapter);
export { XenditAdapter };
//# sourceMappingURL=xendit.adapter.js.map