import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address } from '../../models/address.types';
import { API_BASE_URL } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class AddressApiService {

  constructor(@Inject(API_BASE_URL) private baseUrl: string ,private http: HttpClient) {}

  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.baseUrl}/api/Address`);
  }

  addAddress(address: Partial<Address>): Observable<Address> {
    return this.http.post<Address>(this.baseUrl, address);
  }

  selectAddress(address: Address): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/api/address/select`, address);
  }

  selectAddressById(id: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/api/address/select/${id}`, {});
  }
  
}
