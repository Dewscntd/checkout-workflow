import { Injectable } from '@angular/core';
import { PaymentMethod } from '../../models/payment.types';
import { PaymentStrategy } from './payment.strategy';
import { CreditCardStrategy } from './credit-card-method';
import { PurchaseOrderStrategy } from './purchase-order-method';
import { PayPalStrategy } from './paypal-method';
@Injectable({ providedIn: 'root' })
export class PaymentMethodFactory {
  constructor(
    private purchaseOrderStrategy: PurchaseOrderStrategy,
    private creditCardStrategy: CreditCardStrategy,
    private payPalStrategy: PayPalStrategy
  ) {}

  create(method: PaymentMethod): PaymentStrategy | null {
    switch (method) {
      case PaymentMethod.PurchaseOrder:
        return this.purchaseOrderStrategy;
      case PaymentMethod.CreditCard:
        return this.creditCardStrategy;
      case PaymentMethod.PayPal:
        return this.payPalStrategy;
      default:
        console.warn(`Payment method ${method} is not supported.`);
        return null;
    }
  }
}
