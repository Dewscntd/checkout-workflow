import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { PaymentApiService } from '../../../core/services/api/payment-api.service';
import { PaymentStrategy } from './payment.strategy';

@Injectable({ providedIn: 'root' })
export class PurchaseOrderStrategy implements PaymentStrategy {
  constructor(private paymentApi: PaymentApiService) {}

  select(extraData?: any): Observable<void> {
    const poNumber = extraData?.purchaseOrderNumber;
    if (poNumber) {
      if (!poNumber.trim()) {
        return throwError(() => new Error('Purchase Order Number is required.'));
      }
      return this.paymentApi.selectPurchaseOrder(poNumber);
    } else {
      return of(void 0);
    }
  }
}
