export interface CreateInvoiceInput {
  externalId: string;
  amount: number;
  payerEmail?: string;
  description: string;
  customer: {
    givenNames: string;
    mobileNumber: string;
    email?: string;
    address?: string;
  };
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
}

export interface InvoiceResult {
  invoiceId: string;
  externalId: string;
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
  invoiceUrl: string;
  expiryDate: string;
  amount: number;
}

export interface PaymentGatewayAdapter {
  createInvoice(apiKey: string, input: CreateInvoiceInput): Promise<InvoiceResult>;
  verifyWebhook(expectedToken: string, incomingToken: string): boolean;
}
