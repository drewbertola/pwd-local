import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-home-page',
    imports: [RouterLink],
    templateUrl: './home-page.html',
})
export class HomePage implements OnInit {
    router = inject(Router);

    ngOnInit(): void {
        this.router.navigate(['/open']);
    }
}
