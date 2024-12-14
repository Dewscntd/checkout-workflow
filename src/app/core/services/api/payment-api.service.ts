import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../../environment/environment';
import { AddCreditCardDto, CreditCard, PayPalAccount } from '../../models/payment.types';

@Injectable({ providedIn: 'root' })
export class PaymentApiService {

  constructor(
    @Inject(API_BASE_URL) private baseUrl: string,
    private http: HttpClient
  ) {}

  getPaymentOptions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/api/Payment/options`);
  }

  getCreditCards(): Observable<CreditCard[]> {
    return this.http.get<CreditCard[]>(`${this.baseUrl}/api/Payment/creditcards`);
  }

  addCreditCard(cardData: AddCreditCardDto): Observable<CreditCard> {
    return this.http.post<CreditCard>(`${this.baseUrl}/api/Payment/creditcards`, cardData);
  }

  selectCreditCard(cardId: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/api/Payment/creditcards/${cardId}`, {});
  }

  deleteCreditCard(cardId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/Payment/${cardId}`);
  }

  updateCreditCard(cardId: string, cardData: Partial<CreditCard>): Observable<CreditCard> {
    return this.http.patch<CreditCard>(`${this.baseUrl}/api/Payment/${cardId}`, cardData);
  }

  selectPurchaseOrder(purchaseOrderNumber: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/api/Payment/purchase-order/${purchaseOrderNumber}`, {});
  }

  // PayPal APIs
  selectPayPalAccount(paypalAccountId: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/api/Payment/paypal/${paypalAccountId}`, {});
  }

  getPayPalAccounts(): Observable<PayPalAccount[]> {
    return this.http.get<PayPalAccount[]>(`${this.baseUrl}/api/Payment/paypal/accounts`);
  }
}

