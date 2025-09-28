import { Component, inject, input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SessionStorageService } from '../../services/session-storage.service';
import { StateService } from '../../services/state-service';
import { SvgMenu } from '../svgs/svg-menu/svg-menu';
import { SvgClose } from '../svgs/svg-close/svg-close';

interface CurrentDb {
    id: number,
    name: string,
    password: string,
}

@Component({
    selector: 'app-top-nav',
    imports: [RouterLink, RouterLinkActive, SvgMenu, SvgClose],
    templateUrl: './top-nav.html',
})
export class TopNav implements OnInit {
    storage = inject(SessionStorageService);
    stateService = inject(StateService);

    title: string = environment.pageTitle;
    currentRoute: string = '';
    isOpen: boolean = false;

    toggleMenu(event: MouseEvent): void {
        event.stopPropagation();

        const menu = document.getElementById('topNavMenu') as HTMLElement;

        if (menu.classList.contains('max-h-0')) {
            menu.classList.remove('max-h-0');
            menu.classList.add('max-h-screen');
            this.isOpen = true;
        } else {
            menu.classList.remove('max-h-screen');
            menu.classList.add('max-h-0');
            this.isOpen = false;
        }
    };

    ngOnInit(): void {
        const currentDb: CurrentDb | null = this.storage.getItem('currentDb');

        if (currentDb && currentDb.name.length > 1) {
            this.stateService.setHasOpenDb(true);
        }

        document.addEventListener('click', (event: MouseEvent) => {
            // not open?  Don't do anything
            if (!this.isOpen) { return; }

            const parentElement = document.getElementById('topNavMenu');
            const clickedElement = event.target as HTMLElement;

            if (parentElement?.contains(clickedElement)) {
                // the click was inside the menu
                return;
            }

            // the click was outside the menu
            this.toggleMenu(event);
        });
    }
}
