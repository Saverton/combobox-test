import {
  Component,
  EventEmitter,
  Input,
  Output,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * This component requires children that act as the listbox options. The element's child must be an array of <li> elements,
 * each with a role="option" or role="presentation" attribute. Each <li> with a role="option" must also have a unique id (used
 * to track the aria-activedescendant of the combobox) and a click event listener.
 */
@Component({
  selector: 'app-combobox',
  templateUrl: './combobox.component.html',
  styleUrls: ['./combobox.component.css'],
})
export class ComboboxComponent {
  @Input() label: string = 'Combobox';
  @Input() labelClass: string = '';
  @Input() placeholder: string = 'Search';
  @Input() inputClass: string = '';
  @Input() listboxLabel: string = 'Listbox';
  @Input() listboxClass: string = '';
  @Input() searchText!: string;
  @Output('searchTextChange') searchTextChange = new EventEmitter<string>();

  @ViewChild('listbox') listbox?: ElementRef<HTMLUListElement>;
  @ViewChild('input') input?: ElementRef<HTMLInputElement>;

  isExpanded: boolean = false;

  highlightedOption?: string;

  private removeClickOut?: Function;

  id: number;
  private static idCounter: number = 0;
  private static allComboboxes: ComboboxComponent[];

  constructor(@Inject(DOCUMENT) private dom: Document) {
    this.id = ComboboxComponent.idCounter;
    ComboboxComponent.idCounter++;
    ComboboxComponent.allComboboxes ??= [];
    ComboboxComponent.allComboboxes.push(this);
  }

  onClickDropdownIcon() {
    if (this.isExpanded) {
      this.closeListbox();
    } else {
      this.openListbox();
      this.input?.nativeElement.focus();
    }
  }

  onInputKeydown(event: KeyboardEvent) {
    switch (event.code) {
      case 'Escape':
        // closes listbox if it is open, otherwise clears text
        if (this.isExpanded) {
          this.closeListbox();
        } else {
          this.searchText = '';
          this.searchTextChange.emit(this.searchText);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.openListbox();
        this.stepOptionFocus(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.openListbox();
        if (event.altKey == false) {
          this.stepOptionFocus(1);
        }
        break;
      case 'Enter':
        if (this.highlightedOption) {
          const option = this.listbox?.nativeElement.querySelector<HTMLElement>(
            `#${this.highlightedOption}`
          );
          option?.click();
        }
        this.closeListbox();
        break;
      default:
        this.unhighlight();
        break;
    }
  }

  openListbox() {
    // ensures only one combobox is open at a time globally
    ComboboxComponent.allComboboxes
      .filter((c) => c.id !== this.id)
      .forEach((c) => c.closeListbox());

    this.isExpanded = true;

    const onClickOut = () => this.closeListbox();

    this.dom.addEventListener('click', onClickOut);
    this.removeClickOut = () =>
      this.dom.removeEventListener('click', onClickOut);
  }

  closeListbox() {
    this.isExpanded = false;
    this.unhighlight();

    if (this.removeClickOut) {
      this.removeClickOut();
      this.removeClickOut = undefined;
    }
  }

  captureClicks(event: MouseEvent) {
    event.stopPropagation();
  }

  private stepOptionFocus(delta: number) {
    if (this.listbox === undefined) {
      return;
    }

    const options = Array.from(
      this.listbox.nativeElement.querySelectorAll<HTMLElement>('[role="option"')
    );

    const selectedIndex = options.findIndex(
      (el) => el.id === this.highlightedOption
    );

    let newIndex = selectedIndex + delta;

    if (newIndex >= 0) {
      newIndex %= options.length;
    } else {
      newIndex = options.length - 1;
    }

    this.unhighlight();
    this.highlight(options[newIndex]);

    options[newIndex].scrollIntoView({ block: 'nearest' });
  }

  private highlight(el: HTMLElement) {
    this.highlightedOption = el.id;
    el.classList.add('active-descendant');
  }

  private unhighlight() {
    const highlightedEl = this.listbox?.nativeElement.querySelector(
      `#${this.highlightedOption}`
    );

    highlightedEl?.classList.remove('active-descendant');
    this.highlightedOption = undefined;
  }

  listboxClick(event: MouseEvent) {
    const clickTarget = event.target as HTMLElement;

    if (clickTarget.getAttribute('role') === 'option') {
      this.closeListbox();
    }
  }
}
