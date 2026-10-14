var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';
let VaultService = class VaultService {
    algorithm = 'aes-256-gcm';
    masterKey;
    constructor() {
        const secret = process.env.ENCRYPTION_KEY || 'default-super-secret-key-32-chars-min!';
        this.masterKey = crypto.createHash('sha256').update(secret).digest();
    }
    encrypt(plaintext) {
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
        }
        catch (error) {
            throw new InternalServerErrorException('Failed to encrypt secret payload');
        }
    }
    decrypt(ciphertext, ivHex, authTagHex) {
        try {
            const iv = Buffer.from(ivHex, 'hex');
            const authTag = Buffer.from(authTagHex, 'hex');
            const decipher = crypto.createDecipheriv(this.algorithm, this.masterKey, iv);
            decipher.setAuthTag(authTag);
            let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        }
        catch (error) {
            throw new InternalServerErrorException('Failed to decrypt secret payload: Invalid authentication tag');
        }
    }
};
VaultService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], VaultService);
export { VaultService };
//# sourceMappingURL=vault.service.js.map