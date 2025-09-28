import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SvgHide } from '../svgs/svg-hide/svg-hide';
import { SvgShow } from '../svgs/svg-show/svg-show';
import { CurrentDb } from '../../models/CurrentDb.data';
import { CryptoService } from '../../services/crypto-service';
import { SessionStorageService } from '../../services/session-storage.service';
import { LocalDbService } from '../../services/local-db-service';
import { FileHashInput } from "../file-hash-input/file-hash-input";
import { PwdDb } from '../../models/PwdDb.data';

interface KeyFileData {
    useKeyFile: boolean,
    fileHash: string,
}

interface Error {
    form: string,
    pwdDbCalled: string,
}

@Component({
    selector: 'app-create-page',
    imports: [ReactiveFormsModule, SvgHide, SvgShow, FileHashInput],
    templateUrl: './create-page.html'
})
export class CreatePage {
    crypto = inject(CryptoService);
    sessionStorage = inject(SessionStorageService);
    db = new LocalDbService;
    router = inject(Router);

    password: string = 'password';
    fileHash: string = '';
    useKeyFile: boolean = false;
    isLoading: boolean = false;

    currentDb: CurrentDb = {
        key: '',
        name: '',
        password: '',
        pwdEntries: [],
        categories: [],
        isDirty: true,
    };

    saveDbForm: FormGroup = new FormGroup({
        pwdDbCalled: new FormControl(''),
        secretKey: new FormControl(''),
    });

    error: Error = {
        form: '',
        pwdDbCalled: '',
    }

    // update fileHash data from child component
    updateKeyFileData(keyFileData: KeyFileData): void {
        this.useKeyFile = keyFileData.useKeyFile;
        this.fileHash = keyFileData.fileHash;
    };

    toggleVisibility(): void {
        this.password = (this.password === 'password') ? 'text' : 'password';
    }

    clearErrors(): void {
        this.error = {
            form: '',
            pwdDbCalled: '',
        };

        const inputs: HTMLCollectionOf<Element> = document.getElementsByClassName('error');
        for (const input of inputs) {
            input.classList.remove('error');
        }
    }

    handleSubmit(): void {
        this.clearErrors();
        const values = this.saveDbForm.getRawValue();

        if (values.pwdDbCalled.length < 2) {
            this.error.pwdDbCalled = 'A name for this PwdDb is required of at least 2 characters.';
            return;
        }

        // prepare and save to current session
        this.currentDb.name = values.pwdDbCalled;
        this.currentDb.password = values.secretKey + this.fileHash;

        // save to indexedDb
        const pwdDb: PwdDb = {
            name: this.currentDb.name,
            pwdDb: '',
            salt: '',
            iv: '',
        };

        this.db.insert(pwdDb).then((key) => {
            this.currentDb.key = key;
            this.currentDb.isDirty = false;
            this.sessionStorage.setItem('currentDb', this.currentDb);
            this.router.navigate(['/show']);
        });
    }
}
