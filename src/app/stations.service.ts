import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StationsService {
  constructor(private http: HttpClient) {}

  getStations() {
    return this.http.get<any[]>(
      'https://s3.amazonaws.com/flat-api.septa.org/prod/static/new-stations.json'
    );
  }
}
