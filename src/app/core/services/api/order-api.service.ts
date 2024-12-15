import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, PlaceOrderDto } from '../../models/order.types';
import { API_BASE_URL } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class OrderApiService {
  private endpoint = `${this.baseUrl}/api/Order`;

  constructor(
    @Inject(API_BASE_URL) private baseUrl: string,
    private http: HttpClient
  ) {}

  placeOrder(orderData: PlaceOrderDto): Observable<Order> {
    return this.http.post<Order>(this.endpoint, orderData);
  }
}
