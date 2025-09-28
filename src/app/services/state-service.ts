import { effect, Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StateService {
    hasOpenDb = signal(false);

    // loggingEffect = effect(() => {
    //     console.log(`The hasOpenDb is: ${this.hasOpenDb()}`);
    // });

    setHasOpenDb(has: boolean): void {
        //console.log('setting: ' + has);
        this.hasOpenDb.set(has);
    }
}
