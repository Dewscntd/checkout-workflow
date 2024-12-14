import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Validators, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AddressApiService } from '../../../../core/services/api/address-api.service';

@Component({
  selector: 'app-add-address',
  template: `
    <form [formGroup]="addressForm" (ngSubmit)="onSubmit()">
      <label>
        Address Line 1
        <input type="text" formControlName="addressLine1" />
      </label>
      <label>
        City
        <input type="text" formControlName="city" />
      </label>
      <label>
        State
        <input type="text" formControlName="state" />
      </label>
      <label>
        Country
        <input type="text" formControlName="country" />
      </label>
      <label>
        Postal Code
        <input type="text" formControlName="postalCode" />
      </label>
      <button type="submit" [disabled]="addressForm.invalid">Save Address</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class AddAddressComponent {
  constructor(private fb: NonNullableFormBuilder, private addressApi: AddressApiService) {}

  addressForm = this.fb.group({
    addressLine1: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    country: ['', [Validators.required]],
    postalCode: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.addressForm.valid) {
      const formValue = this.addressForm.value; 
      this.addressApi.addAddress(formValue).subscribe();
    }
  }
}
