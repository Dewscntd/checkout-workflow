import { Injectable } from '@angular/core';
import { Order } from '../../../core/models/order.types';
import { CheckoutState } from './checkout.state';
import { Address } from '../../../core/models/address.types';
import { CreditCard } from '../../../core/models/payment.types';
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
      addresses: [],
      creditCards: [],
      paymentOptions: [],
      // Initialize other state properties if needed
    });
  }

  // Helper methods to update specific parts of the state
  setOrder(order: Order): void {
    this.updateState({ order });
  }

  setSelectedAddressId(addressId: string): void {
    this.updateState({ selectedAddressId: addressId });
  }

  setSelectedPaymentMethod(paymentMethod: string): void {
    this.updateState({ selectedPaymentMethod: paymentMethod });
  }

  setOrderId(orderId: string): void {
    this.updateState({ orderId });
  }

  setError(error: string): void {
    this.updateState({ error });
  }

  setPaymentOptions(paymentOptions: string[]): void {
    this.updateState({ paymentOptions });
  }

  setCreditCards(creditCards: CreditCard[]): void {
    this.updateState({ creditCards });
  }

  setAddresses(addresses: Address[]): void {
    this.updateState({ addresses });
  }
}
