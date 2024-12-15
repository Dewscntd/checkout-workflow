import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { CommonModule } from '@angular/common';
import { PaymentMethod } from '../../../../core/models/payment.types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-method-selector',
  template: `
    <nz-radio-group [(ngModel)]="selectedMethod" (ngModelChange)="selectPaymentMethod($event)">
      <label *ngFor="let method of paymentOptions" nz-radio-button [nzValue]="method">
        {{ method }}
      </label>
    </nz-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzRadioModule, CommonModule, FormsModule],
})
export class PaymentMethodSelectorComponent {
  @Input() paymentOptions: PaymentMethod[] = [];
  @Output() paymentMethodSelected = new EventEmitter<{ method: PaymentMethod; data?: any }>();

  selectedMethod: PaymentMethod | null = null;

  selectPaymentMethod(method: PaymentMethod): void {
    this.paymentMethodSelected.emit({ method });
  }
}
