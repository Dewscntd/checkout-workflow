import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AddAddressModalComponent } from './add-address-modal.component';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AddAddressModalService {
  constructor(private modal: NzModalService) {}

  open(): Observable<any> {
    const modalRef = this.modal.create({
      nzContent: AddAddressModalComponent,
      nzFooter: null,
    });

    return new Observable((observer) => {
      modalRef.afterClose.subscribe({
        next: (result) => observer.next(result),
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });
    });
  }
}
