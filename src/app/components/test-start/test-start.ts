import { Component, inject, OnInit } from "@angular/core";
import { LocalDbService } from "../../services/local-db-service";
import { SessionStorageService } from "../../services/session-storage.service";
import { Completion } from "../../models/Completion.data";

@Component({
    selector: 'app-test-start',
    imports: [],
    templateUrl: './test-start.html'

})
export class TestStart implements OnInit {
    db = inject(LocalDbService);
    storage = inject(SessionStorageService);

    ngOnInit(): void {
        this.db.getAllKeyed().then((records) => {
            console.log(records);
        });
    }
}
