import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PwdDbEntry } from '../../models/PwdDbEntry.data';
import { CurrentDb } from '../../models/CurrentDb.data';
import { SessionStorageService } from '../../services/session-storage.service';
import { SvgBack } from '../svgs/svg-back/svg-back';

@Component({
    selector: 'app-export-json',
    imports: [RouterLink, SvgBack],
    templateUrl: './export-json.html'
})
export class ExportJson implements OnInit {
    constructor(private storage: SessionStorageService) { }

    router = inject(Router);

    currentDb: CurrentDb | null = null;
    noDbToExport: boolean = false;

    ngOnInit(): void {
        this.currentDb = this.storage.getItem('currentDb');

        if (!this.currentDb || this.currentDb.pwdEntries.length < 1) {
            this.noDbToExport = true;
        }
    }

    onClick(): void {
        let jsonData: PwdDbEntry[] = [];

        if (!this.currentDb) {
            console.error('No currentDb');
            return;
        }

        const blob = new Blob([JSON.stringify(
            this.currentDb.pwdEntries)],
            { type: "application/json" }
        );

        const filename = this.currentDb.name.toLowerCase().replaceAll(' ', '_') + '.json';

        const a: HTMLAnchorElement = document.createElement("a");
        a.href = URL.createObjectURL(blob);

        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);

        this.router.navigate(['/settings']);
    }
}
