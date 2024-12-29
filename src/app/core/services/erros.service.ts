import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  constructor(private message: NzMessageService) {}

  handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    this.message.error(error.message || 'An unexpected error occurred.');
    return throwError(error);
  }
}
