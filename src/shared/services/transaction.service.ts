import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'https://api.myjson.online/v1/records/1362d463-6dec-40fd-b1f0-7bf93a19ba5b';

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
