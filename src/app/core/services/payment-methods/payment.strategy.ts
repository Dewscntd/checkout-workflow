import { Observable } from 'rxjs';

export interface PaymentStrategy {
  select(extraData?: any): Observable<void>;
}
