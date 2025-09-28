import { Component, input } from '@angular/core';

@Component({
    selector: 'app-svg-clipboard-p',
    imports: [],
    templateUrl: './svg-clipboard-p.html'
})

export class SvgClipboardP {
    size = input('16');
    class = input('');
}
