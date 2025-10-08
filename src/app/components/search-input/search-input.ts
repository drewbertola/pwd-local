import { Component, input, output, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Completion } from '../../models/Completion.data';
import { SvgDropdown } from '../svgs/svg-dropdown/svg-dropdown';

@Component({
    selector: 'app-search-input',
    imports: [ReactiveFormsModule, SvgDropdown],
    templateUrl: './search-input.html'
})

export class SearchInput implements OnInit {
    isOpen = false;
    arrowCounter = -1;

    control = input.required<FormControl>();
    completions = input.required<Completion[]>();
    id = input.required<string>();
    label = input.required<string>();
    allowNew = input<boolean>(false);

    updateTrigger = output<string>();

    results: Completion[] = [];

    // filter completions for matches using search value
    updateResults() {
        const searchElement = document.getElementById(this.id() + '-label') as HTMLInputElement;
        const search: string = searchElement?.value.toLowerCase().trim();

        let searchResult: Completion[] = this.completions();

        if (search !== '') {
            searchResult =
                this.completions().filter((item) => item.label.toLowerCase().includes(search));
        }

        this.results = searchResult;
    };

    setResult(label: string, value: string): void {
        const labelField = document.getElementById(this.id() + '-label') as HTMLInputElement;

        labelField.value = label;
        this.control().setValue(value);
    };

    onKeyup(event: KeyboardEvent): void {
        if (event.key === 'Enter') { return; }
        if (event.key === 'ArrowUp') { return; }
        if (event.key === 'ArrowDown') { return; }

        if (this.allowNew()) {
            const labelField = document.getElementById(this.id() + '-label') as HTMLInputElement;
            this.control().setValue(labelField.value);
        }

        this.isOpen = true;
        this.updateResults();
    };

    onItemClick(event: Event): void {
        const target = event.target as HTMLElement;
        const label: string | null = target.innerText.trim();

        if (!label) { return; }

        const completion: Completion | undefined = this.completions().find((item) => item.label === label);

        if (!completion) { return; }

        const value: string = String(completion.value);

        this.setResult(label, value);
        this.isOpen = false;
    };

    onEnter(event: Event): void {
        const label = this.results[this.arrowCounter].label;
        const value = String(this.results[this.arrowCounter].value);

        this.setResult(label, value);
        this.isOpen = false;
    }

    onArrowUp(): void {
        const container = document.getElementById(this.id() + '-results')!;

        // scroll negative direction after 3rd from last list item selected
        const scroll = document.getElementsByTagName('li')[0].scrollHeight * -1;

        if (this.arrowCounter > 0) {
            this.arrowCounter--;

            if (this.arrowCounter < this.results.length - 3) {
                container.scrollBy({ top: (scroll), behavior: 'smooth' });
            }
        }
    };

    onArrowDown(): void {
        const container = document.getElementById(this.id() + '-results')!;

        // scroll positive direction after 3rd list item selected
        const scroll = document.getElementsByTagName('li')[0].scrollHeight;

        if (this.arrowCounter < this.results.length - 1) {
            this.arrowCounter++;

            if (this.arrowCounter > 2) {
                container.scrollBy({ top: scroll, behavior: 'smooth' });
            }
        }
    };

    onFocus(): void {
        this.updateResults();
        this.isOpen = true;
    };

    onBlur(): void {
        this.arrowCounter = -1;

        // need a small delay so that clicks on items will still be there
        const timeout = setTimeout(() => {
            this.isOpen = false;
            clearTimeout(timeout)
        }, 200);
    }

    ngOnInit(): void {
        const timeout = setTimeout(() => {
            const searchInput = document.getElementById(this.id() + '-label') as HTMLInputElement;
            const value = String(this.control().value);

            searchInput!.value = this.completions().find((item) => String(item.value) === value)?.label || '';

            this.updateResults();

            clearTimeout(timeout);
        }, 250);
    };
}
