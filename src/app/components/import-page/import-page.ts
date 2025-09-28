import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PwdDb } from '../../models/PwdDb.data';
import { CryptoService } from '../../services/crypto-service';
import { LocalDbService } from '../../services/local-db-service';
import { SvgShow } from '../svgs/svg-show/svg-show';
import { SvgHide } from '../svgs/svg-hide/svg-hide';
import { FileHashInput } from '../file-hash-input/file-hash-input';

interface KeyFileData {
    useKeyFile: boolean,
    fileHash: string,
}

@Component({
    selector: 'app-import-page',
    imports: [SvgShow, SvgHide, FileHashInput, ReactiveFormsModule],
    templateUrl: './import-page.html'
})
export class ImportPage {
    crypto = inject(CryptoService);
    db = inject(LocalDbService);
    router = inject(Router);

    pwdDbs: PwdDb[] = [];

    importDbForm: FormGroup = new FormGroup({
        secretKey: new FormControl(''),
        pwdDbCalled: new FormControl(''),
    });

    error: string = '';
    password: string = 'password';
    fileHash: string = '';
    jsonContent: string = '';
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

    jsonFileChange(event: Event): void {
        const fileElement = event.target as HTMLInputElement;

        const file = fileElement.files?.[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const content = e.target?.result as string;
                this.jsonContent = JSON.parse(content);
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
        if (JSON.stringify(this.jsonContent).length < 100) {
            this.error = 'You must select a JSON File to import.';
            this.isLoading = false;
            return;
        }

        if (this.importDbForm.get('pwdDbCalled')?.value.length < 3) {
            this.error = 'You must give the new DB a name with more than 2 characters.'
            this.isLoading = false;
            return;
        }

        if (this.importDbForm.get('secretKey')?.value.length < 8) {
            this.error = 'Your secret key must be at least 8 characters';
            this.isLoading = false;
            return;
        }

        if (this.useKeyFile && this.fileHash.length === 0) {
            this.error = 'No key file selected, but "Use a Key File" checked.';
            this.isLoading = false;
            return;
        }

        // encrypt the file
        let password = this.importDbForm.get('secretKey')?.value;

        if (this.useKeyFile) {
            password = password + this.fileHash;
        }

        this.crypto.encryptText(JSON.stringify(this.jsonContent), password)
            .then((result) => {
                const pwdDb: PwdDb = {
                    name: this.importDbForm.get('pwdDbCalled')?.value,
                    pwdDb: result.cipherText,
                    salt: result.salt,
                    iv: result.iv,
                };

                this.db.insert(pwdDb).then((response) => {
                    if (response) {
                        this.isLoading = false;
                        this.router.navigate(['/open'])
                    }
                });
            });
    }
}
