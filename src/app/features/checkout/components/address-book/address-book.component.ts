import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { CheckoutFacadeService } from '../../services/checkout-facade.service';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Address } from '../../../../core/models/address.types';
import { AddressApiService } from '../../../../core/services/api/address-api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-address-book',
  template: `
    <nz-spin [nzSpinning]="loading">
      <h3>Address Book</h3>
      <div *ngIf="addresses && addresses.length > 0; else noAddress">
        <label nz-radio-group [(ngModel)]="selectedAddressId">
          <label nz-radio *ngFor="let addr of addresses" [nzValue]="addr.id">
            {{addr.addressLine1}}, {{addr.city}}, {{addr.state}}, {{addr.country}}
          </label>
        </label>
        <button nz-button nzType="primary" (click)="selectAddress()">Select Address</button>
      </div>
      <ng-template #noAddress>
        <p>No saved addresses. Please add one.</p>
      </ng-template>
    </nz-spin>
  `,
  styleUrl: './address-book.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ FormsModule,NgForOf, NgIf, NzRadioModule, NzSpinModule]
})
export class AddressBookComponent implements OnInit {
  @Output() addressSelected = new EventEmitter<string>();
  
  addresses: Address[] = [];
  selectedAddressId?: string;
  loading = false;

  constructor(private addressApi: AddressApiService) {}

  ngOnInit() {
    this.loading = true;
    this.addressApi.getAddresses().subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  selectAddress() {
    if (this.selectedAddressId) {
      this.addressSelected.emit(this.selectedAddressId);
    }
  }
}
