import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-add-address-modal',
  template: `
    <h2>Add New Address</h2>
    <form [formGroup]="addAddressForm" (ngSubmit)="submit()">
      <div>
        <label for="addressLine1">Address Line 1</label>
        <input nz-input id="addressLine1" formControlName="addressLine1" />
      </div>
      <div>
        <label for="addressLine2">Address Line 2</label>
        <input nz-input id="addressLine2" formControlName="addressLine2" />
      </div>
      <div>
        <label for="city">City</label>
        <input nz-input id="city" formControlName="city" />
      </div>
      <div>
        <label for="state">State</label>
        <input nz-input id="state" formControlName="state" />
      </div>
      <div>
        <label for="zipCode">Zip Code</label>
        <input nz-input id="zipCode" formControlName="zipCode" />
      </div>
      <div>
        <label for="country">Country</label>
        <input nz-input id="country" formControlName="country" />
      </div>
      <button nz-button nzType="primary" [disabled]="addAddressForm.invalid" type="submit">Save Address</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, NzInputModule, NzButtonModule, NzModalModule],
})
export class AddAddressModalComponent {
  addAddressForm: FormGroup;

  constructor(private fb: FormBuilder, private modalRef: NzModalRef) {
    this.addAddressForm = this.fb.group({
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  submit(): void {
    if (this.addAddressForm.valid) {
      this.modalRef.close(this.addAddressForm.value);
    }
  }
}
