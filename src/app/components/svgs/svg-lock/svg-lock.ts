import { Component, input } from '@angular/core';

@Component({
    selector: 'app-svg-lock',
    imports: [],
    templateUrl: './svg-lock.html',
})
export class SvgLock {
    size = input('16');
    class = input('');
}
