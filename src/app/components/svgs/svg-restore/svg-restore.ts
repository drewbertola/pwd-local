import { Component, input } from '@angular/core';

@Component({
    selector: 'app-svg-restore',
    imports: [],
    templateUrl: './svg-restore.html'
})

export class SvgRestore {
    size = input('16');
    class = input('');
}
