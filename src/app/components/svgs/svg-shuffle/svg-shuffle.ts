import { Component, input } from '@angular/core';

@Component({
    selector: 'app-svg-shuffle',
    imports: [],
    templateUrl: './svg-shuffle.html'
})

export class SvgShuffle {
    size = input('16');
    class = input('');
}
