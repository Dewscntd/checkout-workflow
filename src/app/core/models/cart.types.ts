// import { FormControl } from "@angular/forms";
// import { Address } from "./address.types";

import { FormControl } from "@angular/forms";

// export interface Product {
//   name?: string;
//   sku?: string;
//   sizeColor?: string;
//   imageUrl?: string;
//   price: number;
//   discountedPrice: number;
// }

// export interface OrderEntry {
//   id?: string;
//   product: Product;
//   quantity: number;
// }

// export interface PaymentInfo {
//   id?: string;
// }


export interface CouponFormControls {
    couponCode: FormControl<string>;
  }
  
//   export interface CouponFormValue {
//     couponCode: string;
//   }