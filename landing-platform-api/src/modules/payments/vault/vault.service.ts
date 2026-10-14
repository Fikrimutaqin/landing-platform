import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  authTag: string;
}

@Injectable()
export class VaultService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly masterKey: Buffer;

  constructor() {
    const secret = process.env.ENCRYPTION_KEY || 'default-super-secret-key-32-chars-min!';
    // Derive a strict 32-byte key using sha256
    this.masterKey = crypto.createHash('sha256').update(secret).digest();
  }

  /**
   * Encrypts plaintext using AES-256-GCM authenticated encryption
   */
  encrypt(plaintext: string): EncryptedPayload {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, this.masterKey, iv);

      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      return {
        ciphertext: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to encrypt secret payload');
    }
  }

  /**
   * Decrypts ciphertext and verifies GCM authentication tag
   */
  decrypt(ciphertext: string, ivHex: string, authTagHex: string): string {
    try {
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      const decipher = crypto.createDecipheriv(this.algorithm, this.masterKey, iv);

      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new InternalServerErrorException('Failed to decrypt secret payload: Invalid authentication tag');
    }
  }
}
