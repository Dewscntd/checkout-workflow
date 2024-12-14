import { Address } from "./address.types";
  
  export interface PlaceOrderDto {
    cartId: string;
    addressId: string;
    paymentMethod: string;
    paymentInfoId?: string;
    purchaseOrderNumber?: string;
    couponCode?: string;
    termsAndConditionsAccepted: boolean;
  }

  export interface Product {
    name: string;
    sku: string;
    sizeColor?: string;
    imageUrl?: string;
    price: number;
    discountedPrice: number;
  }
  
  export interface OrderEntry {
    id: string;
    product: Product;
    quantity: number;
  }


  export interface PaymentInfo {
    id: string;
  }
  
  export interface Order {
    id: string;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    discount: number;
    paymentMethod?: string | null;
    shippingAddress?: Address;
    paymentInfo?: PaymentInfo | null;
    items: OrderEntry[];
    appliedCouponCode?: string | null;
  }
  