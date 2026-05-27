// src/app/core/services/records.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecordsResponse } from '../../shared/models/record.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RecordsService {
  private readonly apiUrl = `${environment.apiUrl}/records`;

  constructor(private http: HttpClient) {}

  getRecords(delayMs = 0): Observable<RecordsResponse> {
    const params = delayMs > 0
      ? new HttpParams().set('delay', delayMs.toString())
      : new HttpParams();
    return this.http.get<RecordsResponse>(this.apiUrl, { params });
  }
}
