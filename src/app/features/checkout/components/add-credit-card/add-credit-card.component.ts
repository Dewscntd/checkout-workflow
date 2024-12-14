import { Component, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { AddCreditCardDto } from '../../../../core/models/payment.types';

@Component({
  selector: 'app-add-credit-card',
  template: `
    <form [formGroup]="cardForm" (ngSubmit)="onSubmit()">
      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="cardHolderName">Card Holder Name</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24">
          <input nz-input formControlName="cardHolderName" id="cardHolderName" />
          <nz-form-text *ngIf="cardForm.get('cardHolderName')?.dirty && cardForm.get('cardHolderName')?.errors">
            Please enter the card holder's name.
          </nz-form-text>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="cardNumber">Card Number</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24">
          <input nz-input formControlName="cardNumber" id="cardNumber" maxlength="16" />
          <nz-form-text *ngIf="cardForm.get('cardNumber')?.dirty && cardForm.get('cardNumber')?.errors">
            Please enter a valid 16-digit card number.
          </nz-form-text>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="expiryMonth">Expiry Month</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24">
          <input nz-input formControlName="expiryMonth" id="expiryMonth" maxlength="2" />
          <nz-form-text *ngIf="cardForm.get('expiryMonth')?.dirty && cardForm.get('expiryMonth')?.errors">
            Please enter a valid month (01-12).
          </nz-form-text>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="expiryYear">Expiry Year</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24">
          <input nz-input formControlName="expiryYear" id="expiryYear" maxlength="4" />
          <nz-form-text *ngIf="cardForm.get('expiryYear')?.dirty && cardForm.get('expiryYear')?.errors">
            Please enter a valid 4-digit year.
          </nz-form-text>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="cvv">CVV</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24">
          <input nz-input formControlName="cvv" id="cvv" maxlength="3" />
          <nz-form-text *ngIf="cardForm.get('cvv')?.dirty && cardForm.get('cvv')?.errors">
            Please enter a valid 3-digit CVV.
          </nz-form-text>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="saved">Save Card</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24">
          <label nz-checkbox formControlName="saved">Yes, save this card for future use</label>
        </nz-form-control>
      </nz-form-item>

      <div style="text-align: right;">
        <button nz-button nzType="primary" [disabled]="cardForm.invalid">Add Card</button>
      </div>
    </form>
  `,
  styleUrl: './add-credit-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule, CommonModule],
})
export class AddCreditCardComponent implements OnInit {
 @Output() add = new EventEmitter<AddCreditCardDto>();

  cardForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.cardForm = this.fb.group({
      cardHolderName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryMonth: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)]],
      expiryYear: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      saved: [false],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.cardForm.valid) {
      const cardData: AddCreditCardDto = this.cardForm.value;
      
      this.add.emit(cardData);
      this.cardForm.reset({ saved: false });
     }
    }
}
