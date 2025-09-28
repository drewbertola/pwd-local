import { Component, input } from '@angular/core';

@Component({
    selector: 'app-svg-dropdown',
    imports: [],
    templateUrl: './svg-dropdown.html'
})

export class SvgDropdown {
    size = input('16');
    class = input('');
}
