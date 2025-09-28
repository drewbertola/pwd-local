import { Component, input } from '@angular/core';

@Component({
    selector: 'app-svg-clipboard-u',
    imports: [],
    templateUrl: './svg-clipboard-u.html'
})

export class SvgClipboardU {
    size = input('16');
    class = input('');
}
