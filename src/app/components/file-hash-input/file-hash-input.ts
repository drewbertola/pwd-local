/**
 * Use Key File is a component that asks whether to use a key file.
 *
 * If yes, it displays a file picker input.  When a file is chosen, it
 * outputs a hash of that file (depending on the crypto hash utilized),
 *
 * If no, it outputs an empty string as the hash.
 */
import { Component, inject, output } from '@angular/core';
import { CryptoService } from '../../services/crypto-service';

@Component({
    selector: 'app-file-hash-input',
    imports: [],
    templateUrl: './file-hash-input.html',
})
export class FileHashInput {
    crypto = inject(CryptoService);

    useKeyFile: boolean = false;
    fileHash: string = '';

    keyFileData = output<any>();

    emitKeyFileData(): void {
        if (this.useKeyFile) {
            this.keyFileData.emit({
                useKeyFile: this.useKeyFile,
                fileHash: this.fileHash,
            });
        } else {
            this.keyFileData.emit({
                useKeyFile: this.useKeyFile,
                fileHash: '',
            });
        }
    }

    useKeyFileChange(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        this.useKeyFile = checkbox.checked;
        this.emitKeyFileData();
    };

    fileChange(event: Event): void {
        const fileElement = event.target as HTMLInputElement;
        const file = fileElement.files?.[0];

        if (file) {
            this.crypto.generateHash(file)
                .then((fileHash) => {
                    this.fileHash = fileHash;
                    this.emitKeyFileData();
                })
                .catch((error) => {
                    console.error('Failed to calculate checksum.');
                });
        } else {
            this.fileHash = '';
            this.emitKeyFileData();
        }
    }
}
