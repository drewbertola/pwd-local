import { Component, input } from '@angular/core';

@Component({
    selector: 'app-svg-copy-p',
    imports: [],
    templateUrl: './svg-copy-p.html'
})

export class SvgCopyP {
    size = input('16');
    class = input('');
}
