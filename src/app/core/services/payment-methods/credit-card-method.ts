import { Injectable } from '@angular/core';
import { PaymentStrategy } from './payment.strategy';
import { PaymentApiService } from '../api/payment-api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaymentMethod } from '../../models/payment.types';

@Injectable({ providedIn: 'root' })
export class CreditCardStrategy implements PaymentStrategy {
  method = PaymentMethod.CreditCard;

  constructor(private paymentApi: PaymentApiService) {}

  select(data: { cardId: string }): Observable<void> {
    return this.paymentApi.selectCreditCard(data.cardId).pipe(
      map(() => undefined) 
    );
  }
}
