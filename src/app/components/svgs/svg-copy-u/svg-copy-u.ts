import { Component, input } from '@angular/core';

@Component({
    selector: 'app-svg-copy-u',
    imports: [],
    templateUrl: './svg-copy-u.html'
})

export class SvgCopyU {
    size = input('16');
    class = input('');
}
