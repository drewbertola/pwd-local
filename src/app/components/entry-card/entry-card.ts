import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SvgEditFile } from '../svgs/svg-edit-file/svg-edit-file';
import { SvgDropdown } from '../svgs/svg-dropdown/svg-dropdown';
import { SvgShow } from '../svgs/svg-show/svg-show';
import { SvgHide } from '../svgs/svg-hide/svg-hide';
import { SvgTrash } from '../svgs/svg-trash/svg-trash';
import { SvgRecycle } from "../svgs/svg-recycle/svg-recycle";
import { SvgClipboardU } from '../svgs/svg-clipboard-u/svg-clipboard-u';
import { SvgClipboardP } from '../svgs/svg-clipboard-p/svg-clipboard-p';

@Component({
    selector: 'app-entry-card',
    imports: [RouterLink, SvgEditFile, SvgDropdown, SvgShow, SvgHide,
        SvgClipboardU, SvgClipboardP, SvgTrash, SvgRecycle],
    templateUrl: './entry-card.html'
})

export class EntryCard {
    entry: any = input.required();
    dataEmitted = output<string>();

    showDetails: boolean = false;
    password: string = 'password';

    copyToClipboard(text: string): void {
        navigator.clipboard.writeText(text);
    }

    toggleVisibility(): void {
        this.password = this.password === 'password' ? 'text' : 'password';
    }

    toggleDetails(customerId: string): void {
        const details = document.getElementById('details-' + customerId);

        if (details?.style.maxHeight && details?.style.maxHeight !== '0px') {
            details.style.maxHeight = '0';
            this.showDetails = false;
        } else {
            details!.style.maxHeight = details?.scrollHeight + 'px';
            this.showDetails = true;
        }
    };

    handleTrash(key: string): void {
        this.dataEmitted.emit(key);
    };
}

