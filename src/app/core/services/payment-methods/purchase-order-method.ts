import { PaymentMethodStrategy } from '../../models/payment.types';
import { PaymentApiService } from '../api/payment-api.service';
import { Observable } from 'rxjs';

export class PurchaseOrderMethod implements PaymentMethodStrategy {
  method = 'PurchaseOrder';

  constructor(private paymentApi: PaymentApiService) {}

  select(data: { purchaseOrderNumber: string }): Observable<any> {
    return this.paymentApi.selectPurchaseOrder(data.purchaseOrderNumber);
  }
}
