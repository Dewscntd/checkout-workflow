import { PaymentMethodStrategy } from '../../models/payment.types';
import { PaymentApiService } from '../api/payment-api.service';
import { Observable } from 'rxjs';

export class CreditCardMethod implements PaymentMethodStrategy {
  method = 'CreditCard';

  constructor(private paymentApi: PaymentApiService) {}

  select(data: { cardNumber: string }): Observable<any> {
    return this.paymentApi.selectCreditCard(data.cardNumber);
  }
}
