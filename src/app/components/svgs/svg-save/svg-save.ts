import { Component, input } from '@angular/core';

@Component({
    selector: 'app-svg-save',
    imports: [],
    templateUrl: './svg-save.html'
})

export class SvgSave {
    size = input('16');
    class = input('');
}
