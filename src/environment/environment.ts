import { InjectionToken } from '@angular/core';

export const environment = {
    production: false,
    mockMode: false, 
    apiBaseUrl: 'https://du-mock-checkout-7d42d0a76fbf.herokuapp.com',
    authToken: 'C4D5C577E9914C4B9C9BF46DF9914A28', 
  };
  
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => 'https://du-mock-checkout-7d42d0a76fbf.herokuapp.com', 
});
