import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PwdDb } from '../../models/PwdDb.data';
import { CryptoService } from '../../services/crypto-service';
import { LocalDbService } from '../../services/local-db-service';

interface KeyFileData {
    useKeyFile: boolean,
    fileHash: string,
}

@Component({
    selector: 'app-restore-page',
    imports: [],
    templateUrl: './restore-page.html'
})
export class RestorePage {
    crypto = inject(CryptoService);
    db = inject(LocalDbService);
    router = inject(Router);

    pwdDbs: PwdDb[] = [];

    error: string = '';
    password: string = 'password';
    fileHash: string = '';
    jsonContent: any = '';
    useKeyFile: boolean = false;
    isLoading: boolean = false;

    // update fileHash data from child component
    updateKeyFileData(keyFileData: KeyFileData): void {
        this.useKeyFile = keyFileData.useKeyFile;
        this.fileHash = keyFileData.fileHash;
    };

    toggleVisibility(): void {
        this.password = this.password === 'password' ? 'text' : 'password';
    }

    backupFileChange(event: Event): void {
        const fileElement = event.target as HTMLInputElement;

        const file = fileElement.files?.[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const content = e.target?.result as string;
                this.jsonContent = JSON.parse(content) as PwdDb;
            }

            reader.onerror = (e) => {
                console.error('Error reading file:', e.target?.error);
            };

            reader.readAsText(file);
        }
    }

    async keyFileChange(event: Event): Promise<boolean> {
        const fileElement = event.target as HTMLInputElement;

        const file = fileElement.files?.[0];

        if (file) {
            try {
                this.fileHash = await this.crypto.generateHash(file);
                return true;
            } catch (error) {
                console.error('Failed to calculate checksum.');
                return false;
            }
        } else {
            console.error('Failed to calculate checksum. No file.');
            return false;
        }
    }

    handleSubmit(): void {
        this.isLoading = true;
        this.error = '';

        // do some validation
        if (this.jsonContent.length < 100) {
            this.error = 'You must select a backup file to restore.';
            this.isLoading = false;
            return;
        }

        this.db.insert(this.jsonContent).then((response) => {
            if (response) {
                this.isLoading = false;
                this.router.navigate(['/open'])
            }
        });
    }
}
