import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StateService {
    hasOpenDb = signal(false);

    setHasOpenDb(has: boolean): void {
        this.hasOpenDb.set(has);
    }
}
