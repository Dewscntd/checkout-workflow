import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddCreditCardDto } from '../../../../core/models/payment.types';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-credit-card',
  template: `
    <form [formGroup]="creditCardForm" (ngSubmit)="submitForm()">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzFor="cardHolderName">Card Holder Name</nz-form-label>
        <nz-form-control [nzSpan]="14" nzErrorTip="Please input the card holder name!">
          <input nz-input formControlName="cardHolderName" id="cardHolderName" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzFor="cardNumber">Card Number</nz-form-label>
        <nz-form-control [nzSpan]="14" nzErrorTip="Please input a valid card number!">
          <input nz-input formControlName="cardNumber" id="cardNumber" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzFor="expiryMonth">Expiry Month</nz-form-label>
        <nz-form-control [nzSpan]="14" nzErrorTip="Please input the expiry month!">
          <input nz-input formControlName="expiryMonth" id="expiryMonth" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzFor="expiryYear">Expiry Year</nz-form-label>
        <nz-form-control [nzSpan]="14" nzErrorTip="Please input the expiry year!">
          <input nz-input formControlName="expiryYear" id="expiryYear" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzFor="cvc">CVC</nz-form-label>
        <nz-form-control [nzSpan]="14" nzErrorTip="Please input the CVC!">
          <input nz-input formControlName="cvc" id="cvc" />
        </nz-form-control>
      </nz-form-item>

      <div style="text-align: right;">
        <button nz-button nzType="default" type="button" (click)="cancel()">Cancel</button>
        <button nz-button nzType="primary" [disabled]="!creditCardForm.valid">Add</button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzButtonModule, NzFormModule, NzInputModule, CommonModule, ReactiveFormsModule],
  styles: [`
    /* Add your styles here if necessary */
  `]
})
export class AddCreditCardComponent {
  @Output() add = new EventEmitter<AddCreditCardDto>();
  @Output() cancelSelection = new EventEmitter<void>(); // Added Output

  creditCardForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.creditCardForm = this.fb.group({
      cardHolderName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryMonth: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)]],
      expiryYear: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      cvc: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
  }

  submitForm(): void {
    if (this.creditCardForm.valid) {
      const formValue = this.creditCardForm.value;
      const newCard: AddCreditCardDto = {
        cardHolderName: formValue.cardHolderName,
        cardNumber: formValue.cardNumber,
        expiryMonth: formValue.expiryMonth,
        expiryYear: formValue.expiryYear,
        cvv: formValue.cvv,
        saved: true
      };
      this.add.emit(newCard);
    }
  }

  cancel(): void {
    this.cancelSelection.emit(); // Emit the cancel event
  }
}
