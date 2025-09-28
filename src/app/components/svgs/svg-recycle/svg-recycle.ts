import { Component, input } from '@angular/core';

@Component({
    selector: 'app-svg-recycle',
    imports: [],
    templateUrl: './svg-recycle.html'
})

export class SvgRecycle {
    size = input('16');
    class = input('');
}
