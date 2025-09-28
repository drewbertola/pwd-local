import { Component, input } from '@angular/core';

@Component({
    selector: 'app-svg-floppy',
    imports: [],
    templateUrl: './svg-floppy.html'
})

export class SvgFloppy {
    size = input('16');
    class = input('');
}
