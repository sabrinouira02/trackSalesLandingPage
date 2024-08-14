import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscritionService {
  baseUrl = 'https://api.tracksales.io/';
  // baseUrl = 'http://127.0.0.1:8000/';
  constructor(private http: HttpClient) {}

  getAllPlans(code: string): Observable<any> {
    const params = new HttpParams().set('code', code);
    return this.http.get<any>(`${this.baseUrl}api/plansWithTraduction`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  subscription(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}api/subscription`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  getUserByReferralLink(referralLink: any ): Observable<any> {
    const params = new HttpParams().set('referral_link', referralLink);
    return this.http.get<any>(`${this.baseUrl}api/user/referral`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getPromoCode(code: object): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}api/promoCodeByCode`, { code })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // Log error to console or send it to a logging infrastructure
    console.error('An error occurred:', error.message);
    
    // Return an observable with a user-facing error message
    return throwError('Something went wrong; please try again later.');
  }

}
