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
    // According to the docs, you send `couponCode` as query param or in request body
    // The swagger doc suggests using "query" parameter. The example:
    // POST /api/Cart/coupon?couponCode=MyCoupon20
    // If it's a query param, do:
    // return this.http.post<Cart>(`${this.baseUrl}/coupon?couponCode=${couponCode}`, {});
    // If it's in the request body, do:
    return this.http.post<Order>(`${this.baseUrl}/coupon`, { couponCode });
  }
}
