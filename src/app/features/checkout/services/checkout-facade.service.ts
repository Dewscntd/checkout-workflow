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

  // Derived Streams
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

  /**
   * Load payment options and map them to PaymentMethod enums
   */
  loadPaymentOptions(): void {
    this.store.apiProcedure(
      'loadPaymentOptions',
      this.paymentApi.getPaymentOptions(), // returns Observable<string[]>
      (options: string[], state) => ({
        paymentOptions: options
          .map(option => this.mapToPaymentMethod(option))
          .filter((method): method is PaymentMethod => !!method) // Filters out undefined
      }),
      (err, state) => ({
        error: `Failed to load payment options: ${err.message}` as string | null
      })
    );
  }

  /**
   * Helper method to map string to PaymentMethod enum
   */
  private mapToPaymentMethod(option: string): PaymentMethod | undefined {
    console.log(`Mapping payment method: ${option}`);
    switch (option) {
      case 'CreditCard':
        return PaymentMethod.CreditCard;
      case 'PurchaseOrder':
        return PaymentMethod.PurchaseOrder;
      case 'PayPal':
        return PaymentMethod.PayPal;
      // Add other mappings as needed
      default:
        console.warn(`Unknown payment method received: ${option}`);
        return undefined;
    }
  }

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
        error: `Failed to load cart: ${err.message}` as string | null
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
        error: `Failed to apply coupon: ${err.message}` as string | null
      })
    );
  }

  /**
   * Fetch saved credit cards
   */
  getCreditCards(): Observable<CreditCard[]> {
    return this.paymentApi.getCreditCards().pipe(
      tap(cards => {
        this.store.setCreditCards(cards);
        console.log('CheckoutFacadeService: Credit cards fetched', cards);
      }),
      catchError(err => {
        this.store.setError(`Failed to load credit cards: ${err.message}`);
        console.error('CheckoutFacadeService: Error fetching credit cards', err);
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
        error: `Failed to delete credit card: ${err.message}` as string | null
      })
    );
  }

  /**
   * Select a credit card as the payment method
   */
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

  /**
   * Choose a payment method using a strategy pattern
   */
  choosePaymentMethod(method: PaymentMethod, extraData?: any): void {
    const strategy: PaymentStrategy | null = this.paymentMethodFactory.create(method);
    if (!strategy) {
      this.store.setError(`Payment method ${method} not supported.` as string );
      return;
    }

    this.store.apiProcedure(
      'selectPaymentMethod',
      strategy.select(extraData), // returns Observable<void>
      () => ({
        selectedPaymentMethod: method
      }),
      (err, state) => ({
        error: `Failed to select payment method: ${err.message}` as string | null
      })
    );
  }

  /**
   * Load addresses from API and update the store
   */
  loadAddresses(): void {
    this.store.apiProcedure(
      'loadAddresses',
      this.addressApi.getAddresses(), // returns Observable<Address[]>
      (addresses: Address[], state) => ({
        addresses
      }),
      (err, state) => ({
        error: `Failed to load addresses: ${err.message}` as string | null
      })
    );
  }

  /**
   * Add a new address
   */
  addAddress(addressData: Address): void {
    this.store.apiProcedure(
      'addAddress',
      this.addressApi.addAddress(addressData), // Assuming this API exists and returns Observable<Address>
      (newAddress: Address, state) => ({
        addresses: [...state.addresses, newAddress]
      }),
      (err, state) => ({
        error: `Failed to add address: ${err.message}` as string | null
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
        error: `Failed to select address: ${err.message}` as string | null
      })
    );
  }

  getAddresses(): Observable<Address[]> {
    return this.addresses$; // Return the observable directly
  }

  /**
   * Place an order
   */
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
      paymentMethod: state.selectedPaymentMethod, // 'CreditCard'
      paymentInfoId: state.paymentInfoId, // 'cardId'
      termsAndConditionsAccepted: true,
      // Include other fields as needed, e.g., couponCode
    };

    this.store.apiProcedure(
      'placeOrder',
      this.orderApi.placeOrder(orderData), // returns Observable<Order>
      (orderResponse, state) => ({
        orderId: orderResponse.id,
        // Optionally, update other state properties
      }),
      (err, state) => ({
        error: `Failed to place order: ${err.message}` as string | null
      })
    );
  }
}
