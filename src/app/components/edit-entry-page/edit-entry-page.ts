import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PwdDbEntry } from '../../models/PwdDbEntry.data';
import { CurrentDb } from '../../models/CurrentDb.data';
import { Completion } from '../../models/Completion.data';
import { SessionStorageService } from '../../services/session-storage.service';
import { SearchInput } from '../search-input/search-input';
import { SvgCycle } from '../svgs/svg-cycle/svg-cycle';
import { SvgBack } from '../svgs/svg-back/svg-back';
import { SvgHide } from '../svgs/svg-hide/svg-hide';
import { SvgShow } from '../svgs/svg-show/svg-show';

@Component({
    selector: 'app-edit-entry-page',
    imports: [ReactiveFormsModule, RouterLink, SearchInput, SvgHide, SvgShow, SvgCycle, SvgBack],
    templateUrl: './edit-entry-page.html'
})
export class EditEntryPage implements OnInit {
    constructor(
        private route: ActivatedRoute,
    ) { }

    router = inject(Router);
    storage = inject(SessionStorageService);

    key: string = '';
    currentDb: CurrentDb | null = null;
    title: string = 'Edit Entry';
    error: string = '';
    password: string = 'password';
    isLoading: boolean = false;

    entryForm = new FormGroup({
        key: new FormControl(''),
        category: new FormControl(''),
        title: new FormControl(''),
        username: new FormControl(''),
        password: new FormControl(''),
        url: new FormControl(''),
        notes: new FormControl(''),
        inTrash: new FormControl(false),
    });

    categoryControl = this.entryForm.get('category') as FormControl;

    toggleVisibility(): void {
        this.password = (this.password === 'password') ? 'text' : 'password';
    }

    generatePassword(): void {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkl' +
            'mnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';

        let result = '';
        const charsLength = chars.length;

        // max: 32, min: 16 ... difference + 1 (because we use floor),
        // then add back our min: 16
        const resultLength = Math.floor(Math.random() * 9) + 16;

        for (let i = 0; i < resultLength; i++) {
            const randomIndex = Math.floor(Math.random() * charsLength);
            result += chars.charAt(randomIndex);
        }

        this.entryForm.get('password')?.setValue(result);
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.key = this.route.snapshot.paramMap.get('key')!;

        this.currentDb = this.storage.getItem('currentDb');

        if (!this.currentDb) {
            console.error('Can not find currentDb');
            this.isLoading = false;
        }

        if (this.key === '0') {
            this.title = 'Add Entry';
            this.key = 'entry-' + this.currentDb?.pwdEntries.length;
            this.isLoading = false;
            return;
        }

        if (this.currentDb!.pwdEntries.length < 1) { return; }

        const entry = this.currentDb!.pwdEntries.find(
            item => item.key === this.key
        );

        if (!entry) { return; }

        this.entryForm.get('key')?.setValue(entry.key);
        this.entryForm.get('category')?.setValue(entry.category);
        this.entryForm.get('title')?.setValue(entry.title);
        this.entryForm.get('username')?.setValue(entry.username);
        this.entryForm.get('password')?.setValue(entry.password);
        this.entryForm.get('url')?.setValue(entry.url);
        this.entryForm.get('notes')?.setValue(entry.notes);
        this.entryForm.get('inTrash')?.setValue(false);

        this.isLoading = false;
    }

    handleSubmit(): void {
        this.isLoading = true;
        const category: string = this.entryForm.get('category')?.value || '';

        if (category.length > 0) {
            if (!this.currentDb?.categories.find(item => item.label === category)) {
                // this is a new category.  Add it to our collection.
                const categories = this.currentDb?.categories;
                const newCategory: Completion = { label: category, value: category };
                this.currentDb?.categories.push(newCategory);

                // sort our categories and store
                this.currentDb?.categories.sort((a, b) => {
                    if (a.label.toLowerCase() < b.label.toLowerCase()) { return -1; }
                    if (a.label.toLowerCase() > b.label.toLowerCase()) { return 1; }
                    return 0;
                });

                this.storage.setItem('currentDb', this.currentDb);
            }
        };

        // find the array index of this entry.  If new, stick it at the end
        let index: any = this.currentDb?.pwdEntries.findIndex(item => item.key === this.key);

        if (index < 0) {
            index = this.currentDb?.pwdEntries.length;
        }

        const entry: PwdDbEntry = {
            key: this.key,
            category: this.entryForm.get('category')?.value || '',
            title: this.entryForm.get('title')?.value || '',
            username: this.entryForm.get('username')?.value || '',
            password: this.entryForm.get('password')?.value || '',
            url: this.entryForm.get('url')?.value || '',
            notes: this.entryForm.get('notes')?.value || '',
            inTrash: false,
        };

        this.currentDb!.pwdEntries[index] = entry;
        this.currentDb!.isDirty = true;
        this.storage.setItem('currentDb', this.currentDb);
        this.isLoading = false;

        this.router.navigate(['/show']);
    };
}
