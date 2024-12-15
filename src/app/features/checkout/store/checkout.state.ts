import { Address } from '../../../core/models/address.types';
import { Order } from '../../../core/models/order.types';
import { CreditCard, PaymentMethod } from '../../../core/models/payment.types';
export interface CheckoutState {
  loading: Record<string, boolean>;
  error: string | null;
  order: Order | null;
  orderId: string | null;
  selectedAddressId: string | null;
  selectedPaymentMethod: PaymentMethod | null;
  paymentInfoId: string | null;
  addresses: Address[];
  creditCards: CreditCard[];
  paymentOptions: PaymentMethod[]; 
}