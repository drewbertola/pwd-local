import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PwdDbEntry } from '../../models/PwdDbEntry.data';
import { CurrentDb } from '../../models/CurrentDb.data';
import { PwdDb } from '../../models/PwdDb.data';
import { CryptoService } from '../../services/crypto-service';
import { SessionStorageService } from '../../services/session-storage.service';
import { EntryCard } from "../entry-card/entry-card";
import { SvgFloppy } from '../svgs/svg-floppy/svg-floppy';
import { SvgLock } from "../svgs/svg-lock/svg-lock";
import { SvgSearch } from '../svgs/svg-search/svg-search';
import { SvgActionButton } from '../svgs/svg-action-button/svg-action-button';
import { PwdDbKeyed } from '../../models/PwdDbKeyed.data';
import { LocalDbService } from '../../services/local-db-service';

@Component({
    selector: 'app-show-db-page',
    imports: [EntryCard, RouterLink, SvgLock, SvgSearch, SvgFloppy, SvgActionButton],
    templateUrl: './show-db-page.html'
})
export class ShowDbPage implements OnInit, OnDestroy {
    storage = inject(SessionStorageService);
    crypto = inject(CryptoService);
    db = inject(LocalDbService);
    router = inject(Router);

    title: string = 'Current DB';
    isLoading: boolean = false;
    isDirty: boolean = false;
    entries: PwdDbEntry[] = [];
    entriesToShow: PwdDbEntry[] = [];
    searchValue: string = '';

    searchEntries(event: Event): void {
        const searchInput = event.target as HTMLInputElement;
        this.searchValue = searchInput?.value;
        this.filterEntries();
    }

    filterEntries(): void {
        if (this.searchValue === '') {
            this.entriesToShow = this.entries.filter(item => !item.inTrash);
        } else {
            const value = this.searchValue.trim().toLowerCase();
            this.entriesToShow = this.entries.filter(item =>
                !item.inTrash &&
                item.title?.toLowerCase().startsWith(value) ||
                item.category?.trim().toLowerCase().startsWith(value)
            );
        }
    }

    // this is quick save.
    saveDatabase(): void {
        this.isLoading = true;
        const currentDb: CurrentDb | null = this.storage.getItem('currentDb');

        if (!currentDb) {
            console.error('Can not find currentDB.');
            return;
        }

        currentDb.pwdEntries = this.entries;

        const jsonData = JSON.stringify(this.entries);

        this.crypto.encryptText(jsonData, currentDb!.password)
            .then((result) => {
                const data: PwdDb = {
                    name: currentDb!.name,
                    pwdDb: result.cipherText,
                    salt: result.salt,
                    iv: result.iv,
                };

                this.db.update(currentDb.key, data).then((response) => {
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

    handleChildToTrash(key: string): void {
        const currentDb: CurrentDb | null = this.storage.getItem('currentDb');

        if (!currentDb) {
            console.error('Can not find currentDB.');
            return;
        }

        const entryIndex: number = this.entries.findIndex((item) => item.key === key);
        this.entries[entryIndex].inTrash = true;

        currentDb.pwdEntries = this.entries;
        currentDb.isDirty = true;
        this.storage.setItem('currentDb', currentDb);
        this.isDirty = true;

        this.filterEntries();
    }

    ngOnInit(): void {
        this.isLoading = true;

        const currentDb: CurrentDb | null = this.storage.getItem('currentDb');

        if (!currentDb) {
            console.error('Can not find currentDB.');
            this.isDirty = false;
            this.entries = [];
            this.isLoading = false;
            return;
        }

        this.isDirty = currentDb.isDirty;

        if (currentDb.pwdEntries.length > 0) {
            this.entries = currentDb.pwdEntries.sort((a, b) => {
                const aName = (a.category + ':' + a.title).toLowerCase();
                const bName = (b.category + ':' + b.title).toLowerCase();

                if (aName < bName) return -1;
                if (bName < aName) return 1;
                return 0;
            });
        }

        this.filterEntries();
        this.isLoading = false;
    }

    ngOnDestroy(): void {
        this.entries = [];
        this.entriesToShow = [];
    }
}
