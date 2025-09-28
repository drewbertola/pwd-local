import { Component, input } from '@angular/core';

@Component({
    selector: 'app-svg-search',
    imports: [],
    templateUrl: './svg-search.html'
})

export class SvgSearch {
    size = input('16');
    class = input('');
}
