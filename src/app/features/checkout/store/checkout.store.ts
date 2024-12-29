import { Injectable } from '@angular/core';
import { Order } from '../../../core/models/order.types';
import { CheckoutState } from './checkout.state';
import { Address } from '../../../core/models/address.types';
import { CreditCard, PaymentMethod } from '../../../core/models/payment.types';
import { BaseStore } from '../../../core/store/base-store';
@Injectable({ providedIn: 'root' })
export class CheckoutStore extends BaseStore<CheckoutState> {
  constructor() {
    super({
      loading: {},
      error: null,
      order: null,
      orderId: null,
      selectedAddressId: null,
      selectedPaymentMethod: null,
      paymentInfoId: undefined,
      addresses: [],
      creditCards: [],
      paymentOptions: [],
    });
  }

  setOrder(order: Order): void {
    this.updateState({ order });
  }

  setSelectedAddressId(addressId: string): void {
    this.updateState({ selectedAddressId: addressId });
  }

  setOrderId(orderId: string): void {
    this.updateState({ orderId });
  }

  setError(error: string): void {
    this.updateState({ error });
  }

  setCreditCards(creditCards: CreditCard[]): void {
    this.updateState({ creditCards });
  }

  setAddresses(addresses: Address[]): void {
    this.updateState({ addresses });
  }

  setPaymentInfoId(paymentInfoId: string): void {
    this.updateState({ paymentInfoId });
  }

  setPaymentOptions(paymentOptions: PaymentMethod[]): void {
    this.updateState({ paymentOptions });
  }

  setSelectedPaymentMethod(method: PaymentMethod | null): void {
    this.updateState({ selectedPaymentMethod: method });
  }
}
