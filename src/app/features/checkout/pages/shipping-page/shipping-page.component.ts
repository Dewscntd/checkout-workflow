import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Address } from '../../../../core/models/address.types';
import { CheckoutFacadeService } from '../../services/checkout-facade.service';
import { AddAddressModalService } from '../../components/add-address-modal/add-address-modal.service';
import { CommonModule } from '@angular/common';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-shipping-page',
  template: `
    <h2>Shipping Information</h2>

    <form [formGroup]="shippingForm">
      <nz-alert *ngIf="(error$ | async) as error" nzType="error" [nzMessage]="error"></nz-alert>

      <nz-radio-group formControlName="selectedAddressId">
        <label *ngFor="let address of addresses$ | async" nz-radio-button [nzValue]="address.id">
          {{ formatAddress(address) }}
        </label>
      </nz-radio-group>
    </form>

    <button nz-button nzType="dashed" (click)="openAddAddressModal()">Add New Address</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, NzRadioModule, NzButtonModule, NzAlertModule, CommonModule, NzMessageModule],
})
export class ShippingPageComponent implements OnInit, OnDestroy {
  shippingForm: FormGroup;
  addresses$: Observable<Address[]> = this.facade.getAddresses();
  error$ = this.facade.error$;

  private destroy$ = new Subject<void>();

  constructor(
    private facade: CheckoutFacadeService,
    private fb: FormBuilder,
    private addAddressModalService: AddAddressModalService,
    private message: NzMessageService 
  ) {
    this.shippingForm = this.fb.group({
      selectedAddressId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.facade.loadAddresses();

    this.shippingForm
      .get('selectedAddressId')!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((addressId) => {
        this.facade.selectAddress(addressId);
        this.message.success('Shipping address selected.');
      });
  }
openAddAddressModal(): void {
  this.addAddressModalService.open().pipe(takeUntil(this.destroy$)).subscribe({
    next: () => {
      this.facade.loadAddresses();
      this.message.success('Address added successfully.');
    },
    error: (err) => {
      console.error('Failed to add address:', err);
      this.message.error('Failed to add address. Please try again.');
    },
  });
}


  formatAddress(address: Address): string {
    return `${address.addressLine1}, ${address.addressLine2 || ''}, ${address.city}, ${address.state}, ${address.country} - ${address.zipCode}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
