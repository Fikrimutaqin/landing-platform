export interface EncryptedPayload {
    ciphertext: string;
    iv: string;
    authTag: string;
}
export declare class VaultService {
    private readonly algorithm;
    private readonly masterKey;
    constructor();
    encrypt(plaintext: string): EncryptedPayload;
    decrypt(ciphertext: string, ivHex: string, authTagHex: string): string;
}
