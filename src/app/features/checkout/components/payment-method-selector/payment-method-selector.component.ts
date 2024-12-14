import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-method-selector',
  template: `
    <nz-radio-group [(ngModel)]="selectedMethod" (ngModelChange)="onSelectionChange($event)">
      <label *ngFor="let method of paymentOptions" nz-radio nzValue="{{method}}">
        {{ method }}
      </label>
    </nz-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzRadioModule, CommonModule, FormsModule],
})
export class PaymentMethodSelectorComponent {
  @Input() paymentOptions: string[] = [];
  @Output() paymentMethodSelected = new EventEmitter<{ method: string; data?: any }>();

  selectedMethod: string | null = null;

  onSelectionChange(method: string): void {
    this.paymentMethodSelected.emit({ method });
  }
}
