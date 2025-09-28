import { Routes } from '@angular/router';
import { HomePage } from './components/home-page/home-page';
import { OpenDbPage } from './components/open-db-page/open-db-page';
import { ShowDbPage } from './components/show-db-page/show-db-page';
import { EditEntryPage } from './components/edit-entry-page/edit-entry-page';
import { SavePage } from './components/save-page/save-page';
import { TrashPage } from './components/trash-page/trash-page';
import { CreatePage } from './components/create-page/create-page';
import { ExportBackup } from './components/export-backup/export-backup';
import { RestorePage } from './components/restore-page/restore-page';
import { ExportJson } from './components/export-json/export-json';
import { ImportPage } from './components/import-page/import-page';
import { SettingsPage } from './components/settings-page/settings-page';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'open', component: OpenDbPage },
    { path: 'show', component: ShowDbPage },
    { path: 'edit/:key', component: EditEntryPage },
    { path: 'save', component: SavePage },
    { path: 'trash', component: TrashPage },
    { path: 'create', component: CreatePage },
    { path: 'export/backup-db', component: ExportBackup },
    { path: "restore", component: RestorePage },
    { path: 'export/json', component: ExportJson },
    { path: 'import', component: ImportPage },
    { path: 'settings', component: SettingsPage },
];
