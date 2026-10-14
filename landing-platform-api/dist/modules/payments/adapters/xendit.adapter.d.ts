import { PaymentGatewayAdapter, CreateInvoiceInput, InvoiceResult } from './payment-gateway.interface.js';
export declare class XenditAdapter implements PaymentGatewayAdapter {
    private readonly logger;
    private readonly baseUrl;
    createInvoice(apiKey: string, input: CreateInvoiceInput): Promise<InvoiceResult>;
    verifyWebhook(expectedToken: string, incomingToken: string): boolean;
}
