import { Component, input } from '@angular/core';

@Component({
    selector: 'app-svg-close',
    imports: [],
    templateUrl: './svg-close.html'
})

export class SvgClose {
    size = input('16');
    class = input('');
}
