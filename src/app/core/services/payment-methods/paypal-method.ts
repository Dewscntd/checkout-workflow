import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaymentStrategy } from './payment.strategy';
import { PaymentApiService } from '../api/payment-api.service';
@Injectable({ providedIn: 'root' })
export class PayPalStrategy implements PaymentStrategy {
  method = 'PayPal';

  constructor(private paymentApi: PaymentApiService) {}

  select(data: { paypalAccountId: string }): Observable<void> {
    return this.paymentApi.selectPayPalAccount(data.paypalAccountId).pipe(
      map(() => undefined)
    );
  }
}
