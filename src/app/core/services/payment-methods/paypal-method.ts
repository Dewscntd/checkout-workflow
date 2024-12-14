import { PaymentMethodStrategy } from '../../models/payment.types';
import { PaymentApiService } from '../api/payment-api.service';
import { Observable } from 'rxjs';

export class PayPalMethod implements PaymentMethodStrategy {
  method = 'PayPal';

  constructor(private paymentApi: PaymentApiService) {}

  select(data: { paypalAccountId: string }): Observable<any> {
    return this.paymentApi.selectPayPalAccount(data.paypalAccountId);
  }
}
