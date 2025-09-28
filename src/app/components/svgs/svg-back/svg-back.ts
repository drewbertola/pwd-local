import { Component, input } from '@angular/core';

@Component({
    selector: 'app-svg-back',
    imports: [],
    templateUrl: './svg-back.html'
})

export class SvgBack {
    size = input('16');
    class = input('');
}
