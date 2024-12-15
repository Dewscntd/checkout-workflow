import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PaymentStrategy } from './payment.strategy';

@Injectable({ providedIn: 'root' })
export class PurchaseOrderStrategy implements PaymentStrategy {
  method = 'Purchase Order';

  constructor() {}

  select(extraData?: any): Observable<void> {
    return of(undefined);
  }
}
