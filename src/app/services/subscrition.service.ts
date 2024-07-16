import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SubscritionService {
  // baseUrl = 'https://api.tracksales.io/';
  baseUrl = 'http://127.0.0.1:8000/';
  constructor(private http: HttpClient) {}

  getAllPlans() {
    return this.http.get<any>(`${this.baseUrl}api/plans`);
  }

  subscription(data: any) {
    return this.http.post<any>(`${this.baseUrl}api/subscription`, data);
  }
}
