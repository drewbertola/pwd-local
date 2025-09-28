import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SvgBack } from '../svgs/svg-back/svg-back';
import { StateService } from '../../services/state-service';

@Component({
    selector: 'app-settings-page',
    imports: [RouterLink, SvgBack],
    templateUrl: './settings-page.html'
})
export class SettingsPage {
    stateService = inject(StateService);
}
