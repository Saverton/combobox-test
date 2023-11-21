import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { StationsService } from '../stations.service';

@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.css'],
})
export class TestFormComponent {
  selectedOption?: string;
  isLoading: boolean = false;
  stations: any[] = [];

  searchText$ = new BehaviorSubject<string>('');

  constructor(private stationsService: StationsService) {}

  ngOnInit() {
    this.isLoading = true;

    const stations$ = this.stationsService.getStations();

    combineLatest({ stations: stations$, searchText: this.searchText$ })
      .pipe(
        map(({ stations, searchText }) =>
          stations.filter((s) =>
            s.name.toLowerCase().includes(searchText.toLowerCase())
          )
        )
      )
      .subscribe({
        next: (stations) => {
          this.stations = stations;
          this.isLoading = false;
        },
      });
  }

  selectOption(value: string) {
    this.searchText$.next(value);
    this.selectedOption = value;
  }
}
