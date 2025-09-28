import { Component, input } from '@angular/core';

@Component({
    selector: 'app-svg-cycle',
    imports: [],
    templateUrl: './svg-cycle.html'
})

export class SvgCycle {
    size = input('16');
    class = input('');
}
