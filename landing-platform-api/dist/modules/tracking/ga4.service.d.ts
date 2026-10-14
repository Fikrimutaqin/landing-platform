export interface Ga4PurchasePayload {
    clientId: string;
    transactionId: string;
    value: number;
    currency?: string;
    itemName: string;
    quantity?: number;
}
export declare class Ga4Service {
    private readonly logger;
    sendPurchase(measurementId: string, apiSecret: string, payload: Ga4PurchasePayload): Promise<boolean>;
}
