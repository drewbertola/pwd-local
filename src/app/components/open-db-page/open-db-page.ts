import { Component, inject, OnInit, output } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PwdDb } from '../../models/PwdDb.data';
import { Completion } from '../../models/Completion.data';
import { CurrentDb } from '../../models/CurrentDb.data';
import { CryptoService } from '../../services/crypto-service';
import { LocalDbService } from '../../services/local-db-service';
import { StateService } from '../../services/state-service';
import { SessionStorageService } from '../../services/session-storage.service';
import { SearchInput } from '../search-input/search-input';
import { FileHashInput } from "../file-hash-input/file-hash-input";
import { SvgShow } from '../svgs/svg-show/svg-show';
import { SvgHide } from '../svgs/svg-hide/svg-hide';

interface KeyFileData {
    useKeyFile: boolean,
    fileHash: string,
}
@Component({
    selector: 'app-open-db-page',
    imports: [SearchInput, SvgShow, SvgHide, ReactiveFormsModule, FileHashInput],
    templateUrl: './open-db-page.html'
})
export class OpenDbPage implements OnInit {
    crypto = inject(CryptoService);
    storage = inject(SessionStorageService);
    stateService = inject(StateService)
    db = inject(LocalDbService);
    router = inject(Router);

    pwdDbs: PwdDb[] = [];
    dbs: Completion[] = [];

    openDbForm: FormGroup = new FormGroup({
        database: new FormControl(0),
        secretKey: new FormControl(''),
        keyFile: new FormControl(null),
    });

    databaseControl = this.openDbForm.get('database') as FormControl;

    error: string = '';
    password: string = 'password';
    fileHash: string = '';
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

    ngOnInit(): void {
        // this.localDb.destroy();
        this.storage.setItem('currentDb', {
            id: 0,
            name: '',
            password: '',
            isDirty: false,
            pwdEntries: [],
        });

        // set our initial state
        this.stateService.setHasOpenDb(false);

        this.db.getCompletions().then((completions) => {
            this.dbs = completions;
        });
    }

    handleSubmit(): void {
        this.isLoading = true;
        this.error = '';

        const key: string = this.openDbForm.get('database')?.value || '';

        // do some validation
        if (key === '') {
            this.error = 'You must select a database to open.';
            this.isLoading = false;
            return;
        }

        if (this.openDbForm.get('secretKey')?.value.length < 8) {
            this.error = 'Your secret key must be at least 8 characters';
            this.isLoading = false;
            return;
        }

        if (this.useKeyFile && this.fileHash.length === 0) {
            this.error = 'No key file selected, but "Use a Key File" checked.';
            this.isLoading = false;
            return;
        }

        // decrypt the file
        let password = this.openDbForm.get('secretKey')?.value;

        if (this.useKeyFile) {
            password = password + this.fileHash;
        }

        this.db.get(key).then((pwdDb) => {
            if (pwdDb.pwdDb.trim() === '') {
                // An empty (new, perhaps) pwdDb
                this.storage.setItem('currentDb', {
                    key: key,
                    name: pwdDb.name,
                    password: password,
                    pwdEntries: [],
                    categories: [],
                    isDirty: false,
                });

                this.stateService.setHasOpenDb(true);
                this.isLoading = false;
                this.router.navigate(['/show']);
                return;
            }

            // not an empty pwdDb//
            this.crypto.decryptText(
                password,
                pwdDb.pwdDb,
                pwdDb.salt,
                pwdDb.iv
            ).then((decrypted) => {
                // key the entries
                const jsonEntries = JSON.parse(decrypted);
                const categories: Completion[] = [];
                const cnt = jsonEntries.length;

                for (let i = 0; i < cnt; i++) {
                    if (!categories.find(item => item.label === jsonEntries[i].category)) {
                        categories.push({ label: jsonEntries[i].category, value: jsonEntries[i].category });
                    }

                    jsonEntries[i].key = 'entry-' + i;
                    jsonEntries[i].inTrash = jsonEntries[i].inTrash || false;
                }

                // store in session storage for quick save
                const dbData: CurrentDb = {
                    key: key,
                    name: pwdDb.name,
                    password: password,
                    isDirty: false,
                    pwdEntries: jsonEntries,
                    categories: categories,
                };

                this.storage.setItem('currentDb', dbData);

                this.isLoading = false;
                this.router.navigate(['/show']);
            }).catch((error) => {
                console.error(error);
                this.error = error;
                this.isLoading = false;
            });
        });
    }
}
