import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../../environment/environment';
import { Order } from '../../models/order.types';

@Injectable({ providedIn: 'root' })
export class CartApiService {

  constructor(@Inject(API_BASE_URL) private baseUrl: string ,private http: HttpClient) {}

  getCart(): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/api/cart`);
  }

  addCoupon(couponCode: string): Observable<Order> {

    return this.http.post<Order>(`${this.baseUrl}/coupon?couponCode=${couponCode}`, {});
  }
}
