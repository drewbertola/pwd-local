import { Component, input } from '@angular/core';

@Component({
    selector: 'app-svg-edit-file',
    imports: [],
    templateUrl: './svg-edit-file.html'
})

export class SvgEditFile {
    size = input('16');
    class = input('');
}
