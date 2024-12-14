import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentApiService } from '../api/payment-api.service';

interface PaymentStrategy {
  select(extraData?: any): Observable<any>;
}

@Injectable({ providedIn: 'root' })
export class PaymentMethodFactory {
  constructor(private paymentApi: PaymentApiService) {}

  create(method: string): PaymentStrategy | null {
    switch (method) {
      case 'Credit Card':
        return {
          select: (extraData: { cardId?: string }) => {
            if (!extraData.cardId) {
              throw new Error('Card ID is required for Credit Card selection.');
            }
            return this.paymentApi.selectCreditCard(extraData.cardId);
          }
        };
      case 'PayPal':
        return {
          select: (extraData: { paypalAccountId?: string }) => {
            if (!extraData.paypalAccountId) {
              throw new Error('PayPal Account ID is required for PayPal selection.');
            }
            return this.paymentApi.selectPayPalAccount(extraData.paypalAccountId);
          }
        };
      case 'Purchase Order':
        return {
          select: (extraData: { purchaseOrderNumber?: string }) => {
            if (!extraData.purchaseOrderNumber) {
              throw new Error('Purchase Order Number is required for Purchase Order selection.');
            }
            return this.paymentApi.selectPurchaseOrder(extraData.purchaseOrderNumber);
          }
        };
      default:
        return null;
    }
  }
}
