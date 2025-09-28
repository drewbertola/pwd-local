import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SvgBack } from '../svgs/svg-back/svg-back';
import { SessionStorageService } from '../../services/session-storage.service';
import { CurrentDb } from '../../models/CurrentDb.data';

@Component({
    selector: 'app-settings-page',
    imports: [RouterLink, SvgBack],
    templateUrl: './settings-page.html'
})
export class SettingsPage implements OnInit {
    constructor(
        private storage: SessionStorageService,
    ) { }

    hasOpenDb: boolean = false;

    ngOnInit(): void {
        const currentDb: CurrentDb | null = this.storage.getItem('currentDb');
        this.hasOpenDb = (currentDb && currentDb.name !== '') ? true : false;
    }
}
