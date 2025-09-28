import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrentDb } from '../../models/CurrentDb.data';
import { PwdDb } from '../../models/PwdDb.data';
import { SessionStorageService } from '../../services/session-storage.service';
import { CryptoService } from '../../services/crypto-service';
import { SvgBack } from '../svgs/svg-back/svg-back';

@Component({
    selector: 'app-export-backup',
    imports: [RouterLink, SvgBack],
    templateUrl: './export-backup.html',
})
export class ExportBackup implements OnInit {
    storage = inject(SessionStorageService);
    crypto = inject(CryptoService);
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
        if (!this.currentDb || this.currentDb.name === '') { return; }

        const jsonData: string = JSON.stringify(this.currentDb.pwdEntries);

        this.crypto.encryptText(jsonData, this.currentDb.password).then((result) => {
            const pwdDb: PwdDb = {
                name: this.currentDb!.name,
                pwdDb: result.cipherText,
                salt: result.salt,
                iv: result.iv,
            };

            const blob = new Blob([JSON.stringify(pwdDb)]);
            const filename = pwdDb.name.toLowerCase().replaceAll(' ', '_') + '.bak';

            const a: HTMLAnchorElement = document.createElement("a");
            a.href = URL.createObjectURL(blob);

            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);

            this.router.navigate(['/settings']);
        });
    }
}
