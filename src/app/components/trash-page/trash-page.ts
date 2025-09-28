import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PwdDbEntry } from '../../models/PwdDbEntry.data';
import { CurrentDb } from '../../models/CurrentDb.data';
import { PwdDb } from '../../models/PwdDb.data';
import { EntryCard } from "../entry-card/entry-card";
import { SessionStorageService } from '../../services/session-storage.service';
import { CryptoService } from '../../services/crypto-service';
import { LocalDbService } from '../../services/local-db-service';
import { SvgBack } from '../svgs/svg-back/svg-back';
import { SvgRecycle } from "../svgs/svg-recycle/svg-recycle";

@Component({
    selector: 'app-trash-page',
    imports: [EntryCard, RouterLink, SvgBack, SvgRecycle],
    templateUrl: './trash-page.html'
})
export class TrashPage implements OnInit, OnDestroy {
    storage = inject(SessionStorageService);
    crypto = inject(CryptoService);
    db = inject(LocalDbService);
    router = inject(Router);

    isLoading: boolean = false;
    isDirty: boolean = false;
    entries: PwdDbEntry[] = [];
    entriesInTrash: PwdDbEntry[] = [];

    filterTrashEntries(): void {
        this.entriesInTrash = this.entries.filter(item => item.inTrash);
    }

    emptyTrash(): void {
        this.isLoading = true;
        const currentDb: CurrentDb | null = this.storage.getItem('currentDb');

        if (!currentDb) {
            console.error('Can not find currentDB.');
            return;
        }

        const currentEntries = this.entries;
        let newEntries: PwdDbEntry[] = [];

        for (const entry of currentEntries) {
            if (!entry.inTrash) {
                newEntries.push(entry);
            }
        }

        currentDb.pwdEntries = newEntries;

        currentDb.isDirty = true;
        this.storage.setItem('currentDb', currentDb);
        this.isDirty = true;

        const timeout = setTimeout(() => {
            this.saveDatabase();

            this.entries = currentDb.pwdEntries.sort((a, b) => {
                const aName = (a.category + ':' + a.title).toLowerCase();
                const bName = (b.category + ':' + b.title).toLowerCase();

                if (aName < bName) return -1;
                if (bName < aName) return 1;
                return 0;
            });

            this.filterTrashEntries();

            clearTimeout(timeout);
        }, 250);
    }

    // this is quick save.
    saveDatabase(): void {
        const currentDb: CurrentDb | null = this.storage.getItem('currentDb');

        if (!currentDb) {
            console.error('Can not find currentDB.');
            return;
        }

        const jsonData = JSON.stringify(currentDb.pwdEntries);

        const key: string = currentDb.key;
        this.crypto.encryptText(jsonData, currentDb.password)
            .then((result) => {
                const pwdDb: PwdDb = {
                    name: currentDb.name,
                    pwdDb: result.cipherText,
                    salt: result.salt,
                    iv: result.iv,
                };

                this.db.update(key, pwdDb).then((response) => {
                    if (response) {
                        this.isLoading = false;
                        this.isDirty = false;
                        currentDb.isDirty = false;
                        this.storage.setItem('currentDb', currentDb);
                    } else {
                        console.error('did not save db.');
                        this.isLoading = false;
                    }
                });
            });
    }

    handleChildFromTrash(key: string): void {
        const currentDb: CurrentDb | null = this.storage.getItem('currentDb');

        if (!currentDb) {
            console.error('Can not find currentDB.');
            return;
        }

        const entryIndex: number = this.entries.findIndex((item) => item.key === key);
        this.entries[entryIndex].inTrash = false;

        currentDb.pwdEntries = this.entries;
        currentDb.isDirty = true;
        this.storage.setItem('currentDb', currentDb);
        this.isDirty = true;

        this.filterTrashEntries();
    }

    ngOnInit(): void {
        this.isLoading = true;

        const currentDb: CurrentDb = this.storage.getItem('currentDb')!;

        if (!currentDb) {
            this.isDirty = false;
            this.entries = [];
            this.isLoading = false;
            return;
        }

        this.isDirty = currentDb.isDirty;
        this.entries = currentDb.pwdEntries.sort((a, b) => {
            const aName = (a.category + ':' + a.title).toLowerCase();
            const bName = (b.category + ':' + b.title).toLowerCase();

            if (aName < bName) return -1;
            if (bName < aName) return 1;
            return 0;
        });

        this.filterTrashEntries();
        this.isLoading = false;
    }

    ngOnDestroy(): void {
        this.entries = [];
        this.entriesInTrash = [];
    }
}
