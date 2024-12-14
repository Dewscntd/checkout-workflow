// src/app/core/store/checkout.state.ts
import { Address } from '../../../core/models/address.types';
import { Order } from '../../../core/models/order.types';
import { CreditCard } from '../../../core/models/payment.types';
import { BaseState } from '../../../core/store/base-store';

export interface CheckoutState extends BaseState {
  order: Order | null;
  orderId: string | null;
  selectedAddressId: string | null;
  selectedPaymentMethod: string | null;
  addresses: Address[];
  creditCards: CreditCard[];
  paymentOptions: string[];
}
