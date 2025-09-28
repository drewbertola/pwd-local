import { Component, input } from '@angular/core';

@Component({
    selector: 'app-svg-action-button',
    imports: [],
    templateUrl: './svg-action-button.html'
})

export class SvgActionButton {
    size = input('16');
    class = input('');
}
