// src/app/core/services/payment-methods/payment-method.factory.ts
import { Injectable } from '@angular/core';
import { PaymentMethod } from '../../models/payment.types';
import { PaymentStrategy } from './payment.strategy';
import { CreditCardStrategy } from './credit-card-method';
import { PurchaseOrderStrategy } from './purchase-order-method';
import { PayPalStrategy } from './paypal-method';

@Injectable({ providedIn: 'root' })
export class PaymentMethodFactory {
  constructor(
    private creditCardStrategy: CreditCardStrategy,
    private purchaseOrderStrategy: PurchaseOrderStrategy,
    private payPalStrategy: PayPalStrategy
  ) {}

  create(method: PaymentMethod): PaymentStrategy | null {
    switch (method) {
      case PaymentMethod.CreditCard:
        return this.creditCardStrategy;
      case PaymentMethod.PurchaseOrder:
        return this.purchaseOrderStrategy;
      case PaymentMethod.PayPal:
        return this.payPalStrategy;
      // Add other cases as needed
      default:
        console.warn(`Payment method ${method} is not supported.`);
        return null;
    }
  }
}
