import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string = environment.authToken;

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string | undefined {
    return this.token;
  }
}
