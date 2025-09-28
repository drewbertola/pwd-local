import { Component, input } from '@angular/core';

@Component({
    selector: 'app-svg-show',
    imports: [],
    templateUrl: './svg-show.html'
})

export class SvgShow {
    size = input('16');
    class = input('');
}
