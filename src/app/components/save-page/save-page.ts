import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PwdDb } from '../../models/PwdDb.data';
import { SessionStorageService } from '../../services/session-storage.service';
import { CryptoService } from '../../services/crypto-service';
import { LocalDbService } from '../../services/local-db-service';
import { FileHashInput } from '../file-hash-input/file-hash-input';
import { SvgHide } from '../svgs/svg-hide/svg-hide';
import { SvgShow } from '../svgs/svg-show/svg-show';
import { SvgBack } from '../svgs/svg-back/svg-back';

interface KeyFileData {
    useKeyFile: boolean,
    fileHash: string,
}

interface Error {
    form: string,
    name: string,
}

@Component({
    selector: 'app-save-page',
    imports: [ReactiveFormsModule, RouterLink, FileHashInput, SvgHide, SvgShow, SvgBack],
    templateUrl: './save-page.html'
})
export class SavePage implements OnInit {
    storage = inject(SessionStorageService);
    crypto = inject(CryptoService);
    db = inject(LocalDbService);
    router = inject(Router);

    password: string = 'password';
    fileHash: string = '';
    useKeyFile: boolean = false;
    isLoading: boolean = false;
    currentDb: any = {};

    saveDbForm: FormGroup = new FormGroup({
        pwdDbCalled: new FormControl(''),
        secretKey: new FormControl(''),
    });

    error: Error = {
        form: '',
        name: '',
    }

    // update fileHash data from child component
    updateKeyFileData(keyFileData: KeyFileData): void {
        this.useKeyFile = keyFileData.useKeyFile;
        this.fileHash = keyFileData.fileHash;
    };

    toggleVisibility(): void {
        this.password = (this.password === 'password') ? 'text' : 'password';
    }

    ngOnInit(): void {
        this.currentDb = this.storage.getItem('currentDb');
        this.saveDbForm.get('pwdDbCalled')?.setValue(this.currentDb?.name);
    }

    clearErrors(): void {
        this.error = {
            form: '',
            name: '',
        };

        const inputs: HTMLCollectionOf<Element> = document.getElementsByClassName('error');
        for (const input of inputs) {
            input.classList.remove('error');
        }
    }

    handleSubmit(): void {
        this.isLoading = true;
        const values = this.saveDbForm.getRawValue();

        this.currentDb.name = values.pwdDbCalled;
        this.currentDb.password = values.secretKey + this.fileHash;
        this.storage.setItem('currentDb', this.currentDb);

        const jsonData = JSON.stringify(this.currentDb.pwdEntries);

        const key: string = this.currentDb.key;
        this.crypto.encryptText(jsonData, this.currentDb.password)
            .then((result) => {
                const pwdDb: PwdDb = {
                    name: this.currentDb.name,
                    pwdDb: result.cipherText,
                    salt: result.salt,
                    iv: result.iv,
                };

                this.db.update(key, pwdDb).then((response) => {
                    if (response) {
                        this.isLoading = false;
                        this.currentDb.isDirty = false;
                        this.currentDb.isDirty = false;
                        this.storage.setItem('currentDb', this.currentDb);
                        this.router.navigate(['/show']);
                    } else {
                        console.error('did not save db.');
                        this.isLoading = false;
                    }
                });
            });
    }
}
