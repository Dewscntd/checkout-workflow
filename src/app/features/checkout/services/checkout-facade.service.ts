import { Injectable } from '@angular/core';
import { CheckoutStore } from '../store/checkout.store';
import { PaymentApiService } from '../../../core/services/api/payment-api.service';
import { AddressApiService } from '../../../core/services/api/address-api.service';
import { CartApiService } from '../../../core/services/api/cart-api.service';
import { OrderApiService } from '../../../core/services/api/order-api.service';
import { PaymentMethodFactory } from '../../../core/services/payment-methods/payment-method.factory';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Address } from '../../../core/models/address.types';
import { Order, PlaceOrderDto } from '../../../core/models/order.types';
import { CreditCard, AddCreditCardDto } from '../../../core/models/payment.types';
import { PaymentStrategy } from '../../../core/services/payment-methods/payment.strategy';
import { PaymentMethod } from '../../../core/models/payment.types';

@Injectable({ providedIn: 'root' })
export class CheckoutFacadeService {
  order$: Observable<Order | null> = this.store.state$.pipe(map(state => state.order));
  loading$: Observable<Record<string, boolean>> = this.store.state$.pipe(map(state => state.loading));
  error$: Observable<string | null> = this.store.state$.pipe(map(state => state.error));
  orderId$: Observable<string | null> = this.store.state$.pipe(map(state => state.orderId));
  selectedAddressId$: Observable<string | null> = this.store.state$.pipe(map(state => state.selectedAddressId));
  selectedPaymentMethod$: Observable<PaymentMethod | null> = this.store.state$.pipe(map(state => state.selectedPaymentMethod));
  paymentInfoId$: Observable<string | null> = this.store.state$.pipe(map(state => state.paymentInfoId));
  creditCards$: Observable<CreditCard[]> = this.store.state$.pipe(map(state => state.creditCards));
  addresses$: Observable<Address[]> = this.store.state$.pipe(map(state => state.addresses));
  paymentOptions$: Observable<PaymentMethod[]> = this.store.state$.pipe(
    map(state => state.paymentOptions)
  );

  orderItems$: Observable<any[]> = this.order$.pipe(
    map(order => order?.items || [])
  );
  shippingAddress$: Observable<Address | undefined> = this.order$.pipe(
    map(order => order?.shippingAddress)
  );

  constructor(
    private store: CheckoutStore,
    private cartApi: CartApiService,
    private addressApi: AddressApiService,
    private paymentApi: PaymentApiService,
    private orderApi: OrderApiService,
    private paymentMethodFactory: PaymentMethodFactory
  ) {}


  loadPaymentOptions(): void {
    this.store.apiProcedure(
      'loadPaymentOptions',
      this.paymentApi.getPaymentOptions(),
      (options: string[], state) => ({
        paymentOptions: options
          .map(option => this.mapToPaymentMethod(option))
          .filter((method): method is PaymentMethod => !!method)
      }),
      (err, state) => ({
        error: `Failed to load payment options: ${err.message}` as string | null
      })
    );
  }

  private mapToPaymentMethod(option: string): PaymentMethod | undefined {
    switch (option) {
      case 'CreditCard':
        return PaymentMethod.CreditCard;
      case 'PurchaseOrder':
        return PaymentMethod.PurchaseOrder;
      case 'PayPal':
        return PaymentMethod.PayPal;
      default:
        console.warn(`Unknown payment method received: ${option}`);
        return undefined;
    }
  }

  loadOrderData(): void {
    this.store.apiProcedure(
      'loadOrder',
      this.cartApi.getCart(),
      (order, state) => ({
        order,
        orderId: order.id
      }),
      (err, state) => ({
        error: `Failed to load cart: ${err.message}` as string | null
      })
    );
  }

  applyCoupon(couponCode: string): void {
    this.store.apiProcedure(
      'applyCoupon',
      this.cartApi.addCoupon(couponCode),
      (updatedOrder: Order, state) => ({
        order: updatedOrder
      }),
      (err, state) => ({
        error: `Failed to apply coupon: ${err.message}` as string | null
      })
    );
  }

  getCreditCards(): Observable<CreditCard[]> {
    return this.paymentApi.getCreditCards().pipe(
      tap(cards => {
        this.store.setCreditCards(cards);
      }),
      catchError(err => {
        this.store.setError(`Failed to load credit cards: ${err.message}`);
        return of([]);
      })
    );
  }

  addCreditCard(cardData: AddCreditCardDto): void {
    this.store.apiProcedure(
      'addCreditCard',
      this.paymentApi.addCreditCard(cardData),
      (newCard: CreditCard, state) => ({
        creditCards: [...state.creditCards, newCard]
      }),
      (err, state) => ({
        error: `Failed to add credit card: ${err.message}` as string | null
      })
    );
  }

  deleteCreditCard(cardId: string): void {
    this.store.apiProcedure(
      'deleteCreditCard',
      this.paymentApi.deleteCreditCard(cardId),
      () => ({
        creditCards: this.store.currentState.creditCards.filter(card => card.id !== cardId)
      }),
      (err, state) => ({
        error: `Failed to delete credit card: ${err.message}` as string | null
      })
    );
  }

  selectCreditCard(cardId: string): void {
    this.store.apiProcedure(
      'selectPaymentMethod',
      this.paymentMethodFactory.create(PaymentMethod.CreditCard)?.select({ cardId }) || of(null),
      () => ({
        selectedPaymentMethod: PaymentMethod.CreditCard,
        paymentInfoId: cardId
      }),
      (err, state) => ({
        error: `Failed to select credit card: ${err.message}` as string | null
      })
    );
  }

  choosePaymentMethod(method: PaymentMethod, extraData?: any): void {
    const strategy: PaymentStrategy | null = this.paymentMethodFactory.create(method);
    if (!strategy) {
      this.store.setError(`Payment method ${method} not supported.` as string );
      return;
    }

    this.store.apiProcedure(
      'selectPaymentMethod',
      strategy.select(extraData),
      () => ({
        selectedPaymentMethod: method
      }),
      (err, state) => ({
        error: `Failed to select payment method: ${err.message}` as string | null
      })
    );
  }

  loadAddresses(): void {
    this.store.apiProcedure(
      'loadAddresses',
      this.addressApi.getAddresses(),
      (addresses: Address[], state) => ({
        addresses
      }),
      (err, state) => ({
        error: `Failed to load addresses: ${err.message}` as string | null
      })
    );
  }

  addAddress(addressData: Address): void {
    this.store.apiProcedure(
      'addAddress',
      this.addressApi.addAddress(addressData),
      (newAddress: Address, state) => ({
        addresses: [...state.addresses, newAddress]
      }),
      (err, state) => ({
        error: `Failed to add address: ${err.message}` as string | null
      })
    );
  }

  selectAddress(addressId: string): void {
    this.store.apiProcedure(
      'selectAddress',
      this.addressApi.selectAddressById(addressId),
      () => ({
        selectedAddressId: addressId
      }),
      (err, state) => ({
        error: `Failed to select address: ${err.message}` as string | null
      })
    );
  }

  getAddresses(): Observable<Address[]> {
    return this.addresses$;
  }

  placeOrder(): void {
    const state = this.store.currentState;
    if (
      !state.order ||
      !state.selectedAddressId ||
      !state.selectedPaymentMethod ||
      !state.paymentInfoId
    ) {
      this.store.setError('Missing required order details.' as string );
      return;
    }

    const orderData: PlaceOrderDto = {
      cartId: state.order.id,
      addressId: state.selectedAddressId,
      paymentMethod: state.selectedPaymentMethod,
      paymentInfoId: state.paymentInfoId,
      termsAndConditionsAccepted: true,
    };

    this.store.apiProcedure(
      'placeOrder',
      this.orderApi.placeOrder(orderData),
      (orderResponse, state) => ({
        orderId: orderResponse.id,
      }),
      (err, state) => ({
        error: `Failed to place order: ${err.message}` as string | null
      })
    );
  }
}
