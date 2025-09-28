import { Component, input } from '@angular/core';

@Component({
    selector: 'app-svg-trash',
    imports: [],
    templateUrl: './svg-trash.html'
})

export class SvgTrash {
    size = input('16');
    class = input('');
}
