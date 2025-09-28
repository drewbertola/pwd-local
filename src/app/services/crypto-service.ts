import { Injectable } from "@angular/core";

type Base64String = string;

interface EncryptionResult {
    cipherText: string,
    salt: string,
    iv: string,
}

@Injectable({
    providedIn: "root"
})
export class CryptoService {
    constructor() { }

    uint8ArrayToBase64(bytes: Uint8Array): Base64String {
        return btoa(String.fromCharCode(...bytes));
    }

    base64ToUint8Array(base64: Base64String): Uint8Array {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);

        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }

        return bytes;
    }

    generateRandomKey(length: number): Uint8Array {
        // This will return a secure random Uint8Array of `length` bytes
        return crypto.getRandomValues(new Uint8Array(length));
    }

    generateSalt(): Uint8Array {
        return this.generateRandomKey(16);
    }

    generateIv(): Uint8Array {
        return this.generateRandomKey(12);
    }

    async generateHash(file: File): Promise<string> {
        if (!(file instanceof File)) {
            throw new Error('Input must be a File object.');
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hexHash;
        } catch (error) {
            console.error('Error calculating checksum:', error);
            throw error;
        }
    }

    async decryptText(
        password: string,
        cipherText: string,
        salt: string,
        iv: string
    ): Promise<string> {
        // 1. Derive the key from the password (using a KDF like PBKDF2)
        const aesKey = await crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: new TextEncoder().encode(salt) as BufferSource, // Use the same salt as during encryption
                iterations: 100000, // Use the same iterations as during encryption
                hash: "SHA-256",
            },
            await crypto.subtle.importKey(
                "raw",
                new TextEncoder().encode(password),
                { name: "PBKDF2" },
                false,
                ["deriveBits", "deriveKey"]
            ),
            { name: "AES-GCM", length: 256 },
            true,
            ["decrypt"]
        );

        // 2. Decrypt the ciphertext
        try {
            const decryptedContentBuffer = await crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    // Use the same IV as during encryption
                    iv: this.base64ToUint8Array(iv) as BufferSource,
                },
                aesKey,
                // The encrypted data as an ArrayBuffer
                this.base64ToUint8Array(cipherText) as BufferSource
            );

            // 3. Convert to string
            const decryptedText = new TextDecoder().decode(decryptedContentBuffer);
            return decryptedText;
        } catch (error) {
            console.error("Decryption failed:", error);
            throw new Error(
                "Failed to decrypt database.  Please check your secret key and " +
                "optional key file."
            );
        }
    }

    async encryptText(plainText: string, password: string): Promise<EncryptionResult> {
        const salt = this.uint8ArrayToBase64(this.generateSalt());
        const iv = crypto.getRandomValues(new Uint8Array(12));

        // 1. Derive a key from the password
        const derivedKey = await crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: new TextEncoder().encode(salt),
                iterations: 100000,
                hash: "SHA-256",
            },
            await crypto.subtle.importKey(
                "raw",
                new TextEncoder().encode(password),
                { name: "PBKDF2" },
                false,
                ["deriveKey"]
            ),
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );

        // 2. Prepare plaintext
        const encodedPlainText = new TextEncoder().encode(plainText);

        // 3. Encrypt
        const cipherText = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv,
            },
            derivedKey,
            encodedPlainText
        );

        return {
            cipherText: btoa(String.fromCharCode(...new Uint8Array(cipherText))),
            iv: btoa(String.fromCharCode(...iv)),
            salt: salt,
        };
    }
}