import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TopNav } from './components/top-nav/top-nav';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, TopNav],
    templateUrl: './app.html',
})
export class App {
    router = inject(Router);
}
