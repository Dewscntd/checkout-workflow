export interface Address {
    id: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    saved: boolean;
    zipCode: string;
  }
  
  export interface SelectAddressRequest {
    id: string;
    addressLine1: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }
  
  interface AddressFormData {
    addressLine1: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }
  