import { Injectable } from '@angular/core';
import { CheckoutStore } from '../store/checkout.store';
import { PaymentApiService } from '../../../core/services/api/payment-api.service';
import { AddressApiService } from '../../../core/services/api/address-api.service';
import { CartApiService } from '../../../core/services/api/cart-api.service';
import { OrderApiService } from '../../../core/services/api/order-api.service';
import { PaymentMethodFactory } from '../../../core/services/payment-methods/payment-method.factory';
import { Observable, of, combineLatest } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Address } from '../../../core/models/address.types';
import { Order, PlaceOrderDto } from '../../../core/models/order.types';
import { AddCreditCardDto, CreditCard } from '../../../core/models/payment.types';

@Injectable({ providedIn: 'root' })
export class CheckoutFacadeService {
  order$: Observable<Order | null> = this.store.state$.pipe(map(state => state.order));
  loading$: Observable<Record<string, boolean>> = this.store.state$.pipe(map(state => state.loading));
  error$: Observable<string | null> = this.store.state$.pipe(map(state => state.error));
  orderId$: Observable<string | null> = this.store.state$.pipe(map(state => state.orderId));
  selectedAddressId$: Observable<string | null> = this.store.state$.pipe(map(state => state.selectedAddressId));
  selectedPaymentMethod$: Observable<string | null> = this.store.state$.pipe(map(state => state.selectedPaymentMethod));

  // Derived Streams
  orderItems$: Observable<any[]> = this.order$.pipe(
    map(order => order?.items || [])
  );
  shippingAddress$: Observable<Address | undefined> = this.order$.pipe(
    map(order => order?.shippingAddress)
  );

  // Payment Observables
  paymentOptions$: Observable<string[]> = this.getPaymentOptions();
  creditCards$: Observable<CreditCard[]> = this.getCreditCards();
  payPalAccounts$: Observable<any[]> = this.paymentApi.getPayPalAccounts().pipe(
    catchError(err => {
      this.store.setError(`Failed to load PayPal accounts: ${err.message}`);
      return of([]);
    })
  );

  constructor(
    private store: CheckoutStore,
    private cartApi: CartApiService,
    private addressApi: AddressApiService,
    private paymentApi: PaymentApiService,
    private orderApi: OrderApiService,
    private paymentMethodFactory: PaymentMethodFactory
  ) {}

  /**
   * Load cart data into the state
   */
  loadOrderData(): void {
    this.store.apiProcedure(
      'loadOrder',
      this.cartApi.getCart(), // should return Observable<Order>
      (order, state) => ({
        order,
        orderId: order.id
      }),
      (err, state) => ({
        error: `Failed to load cart: ${err.message}`
      })
    );
  }

  /**
   * Apply a coupon to the cart
   */
  applyCoupon(couponCode: string): void {
    this.store.apiProcedure(
      'applyCoupon',
      this.cartApi.addCoupon(couponCode), // returns Observable<Order>
      (updatedOrder: Order, state) => ({
        order: updatedOrder
      }),
      (err, state) => ({
        error: `Failed to apply coupon: ${err.message}`
      })
    );
  }

  /**
   * Fetch available payment options
   */
  private getPaymentOptions(): Observable<string[]> {
    return this.paymentApi.getPaymentOptions().pipe(
      tap(options => {
        this.store.setPaymentOptions(options);
      }),
      catchError(err => {
        this.store.setError(`Failed to load payment options: ${err.message}`);
        return of([]);
      })
    );
  }

  /**
   * Fetch saved credit cards
   */
  private getCreditCards(): Observable<CreditCard[]> {
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

  /**
   * Add a new credit card
   */
  addCreditCard(cardData: AddCreditCardDto): void { // Use AddCreditCardDto without 'id'
    this.store.apiProcedure(
      'addCreditCard',
      this.paymentApi.addCreditCard(cardData), // returns Observable<CreditCard>
      (newCard: CreditCard, state) => ({
        creditCards: [...state.creditCards, newCard]
      }),
      (err, state) => ({
        error: `Failed to add credit card: ${err.message}` as string | null
      })
    );
  }

  /**
   * Delete a credit card
   */
  deleteCreditCard(cardId: string): void {
    this.store.apiProcedure(
      'deleteCreditCard',
      this.paymentApi.deleteCreditCard(cardId), // returns Observable<void>
      () => ({
        creditCards: this.store.currentState.creditCards.filter(card => card.id !== cardId)
      }),
      (err, state) => ({
        error: `Failed to delete credit card: ${err.message}`
      })
    );
  }

  /**
   * Select a credit card as the payment method
   */
  selectCreditCard(cardId: string): void {
    this.store.apiProcedure(
      'selectCreditCard',
      this.paymentApi.selectCreditCard(cardId), // returns Observable<void>
      () => ({
        selectedPaymentMethod: `Credit Card:${cardId}`
      }),
      (err, state) => ({
        error: `Failed to select credit card: ${err.message}`
      })
    );
  }

  /**
   * Fetch all saved addresses
   */
  getAddresses(): Observable<Address[]> {
    return this.addressApi.getAddresses().pipe(
      tap(addresses => {
        this.store.setAddresses(addresses);
      }),
      catchError(err => {
        this.store.setError(`Failed to load addresses: ${err.message}`);
        return of([]);
      })
    );
  }

  /**
   * Select a shipping address
   */
  selectAddress(addressId: string): void {
    this.store.apiProcedure(
      'selectAddress',
      this.addressApi.selectAddressById(addressId), // returns Observable<void>
      () => ({
        selectedAddressId: addressId
      }),
      (err, state) => ({
        error: `Failed to select address: ${err.message}`
      })
    );
  }

  /**
   * Load addresses from API and update the store
   */
  loadAddresses(): void {
    this.store.apiProcedure(
      'loadAddresses',
      this.getAddresses(), // returns Observable<Address[]>
      (addresses, state) => ({
        addresses
      }),
      (err, state) => ({
        error: `Failed to load addresses: ${err.message}`
      })
    );
  }

  /**
   * Choose a payment method using a strategy pattern
   */
  choosePaymentMethod(method: string, extraData?: { cardId?: string; purchaseOrderNumber?: string }): void {
    const strategy = this.paymentMethodFactory.create(method);
    if (!strategy) {
      this.store.setError(`Payment method ${method} not supported.`);
      return;
    }

    this.store.apiProcedure(
      'selectPaymentMethod',
      strategy.select(extraData), // returns Observable<any>
      () => ({
        selectedPaymentMethod: method
      }),
      (err, state) => ({
        error: `Failed to select payment method: ${err.message}`
      })
    );
  }

  /**
   * Place an order
   */
  placeOrder(): void {
    const state = this.store.currentState;
    if (!state.order || !state.selectedAddressId || !state.selectedPaymentMethod) {
      this.store.setError('Missing required order details.');
      return;
    }

    const orderData: PlaceOrderDto = {
      cartId: state.order.id, // Assuming 'id' is the cart ID
      addressId: state.selectedAddressId,
      paymentMethod: state.selectedPaymentMethod,
      // Add other necessary fields as per your API
      termsAndConditionsAccepted: true, // Example field
    };

    this.store.apiProcedure(
      'placeOrder',
      this.orderApi.placeOrder(orderData), // returns Observable<PlaceOrderResponse>
      (orderResponse, state) => ({
        orderId: orderResponse.id
      }),
      (err, state) => ({
        error: `Failed to place order: ${err.message}`
      })
    );
  }
}
