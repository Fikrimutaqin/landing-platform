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
export declare class CapiService {
    private readonly logger;
    private hashData;
    sendEvent(pixelId: string, accessToken: string, payload: CapiEventPayload): Promise<boolean>;
}
