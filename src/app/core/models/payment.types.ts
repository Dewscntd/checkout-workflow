import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";

export enum PaymentMethod {
  CreditCard = 'CreditCard',
  PurchaseOrder = 'PurchaseOrder',
  PayPal = 'PayPal',
}
  export interface PayPalAccount {
    id: string;
    paypalAccountId: string;
    email: string;
  }
 
  export interface PaymentMethodStrategy {
    method: string;
    select(data: any): Observable<any>;
  }

 export interface CreditCardFormControls {
    cardNumber: FormControl<string>;
    expiryMonth: FormControl<string>;
    expiryYear: FormControl<string>;
    cvv: FormControl<string>;
    cardHolderName: FormControl<string>;
  }
  
  export interface PurchaseOrderFormControls {
    purchaseOrderNumber: FormControl<string>;
  }
  
  export interface PayPalFormControls {
    paypalAccountId: FormControl<string>;
  }

 export interface CreditCardFormValue {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardHolderName: string;
  }
  
 export interface PurchaseOrderFormValue {
    purchaseOrderNumber: string;
  }
  
 export interface PayPalFormValue {
    paypalAccountId: string;
  }

  export interface AddCreditCardDto {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardHolderName: string;
    saved: boolean;
  }
  
  export interface CreditCard extends AddCreditCardDto {
    id: string;
  }