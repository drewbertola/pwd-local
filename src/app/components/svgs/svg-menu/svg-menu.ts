import { Component, input } from '@angular/core';

@Component({
    selector: 'app-svg-menu',
    imports: [],
    templateUrl: './svg-menu.html'
})

export class SvgMenu {
    size = input('16');
    class = input('');
}
