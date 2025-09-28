import { Component, input } from '@angular/core';

@Component({
    selector: 'app-svg-hide',
    imports: [],
    templateUrl: './svg-hide.html'
})

export class SvgHide {
    size = input('16');
    class = input('');

}
