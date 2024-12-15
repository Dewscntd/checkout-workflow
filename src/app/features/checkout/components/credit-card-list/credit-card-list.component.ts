import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonModule } from '@angular/common';
import { CreditCard } from '../../../../core/models/payment.types';
@Component({
  selector: 'app-credit-card-list',
  template: `
    <nz-list bordered>
      <nz-list-item *ngFor="let card of creditCards">
        <div nz-row nzJustify="space-between" nzAlign="middle" style="width: 100%;">
          <div>
            <strong>{{ maskCardNumber(card.cardNumber) }}</strong><br />
            {{ card.cardHolderName }}<br />
            Expires: {{ card.expiryMonth }}/{{ card.expiryYear }}
          </div>
          <div>
            <button nz-button nzType="link" (click)="selectCard(card)">Select</button>
            <button nz-button nzType="link" nzDanger (click)="confirmDelete(card)">Delete</button>
          </div>
        </div>
      </nz-list-item>
    </nz-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzListModule, NzButtonModule, CommonModule],
  styleUrls: ['./credit-card-list.component.scss']
})
export class CreditCardListComponent {
    @Input() creditCards: CreditCard[] | null = [];
    @Output() select = new EventEmitter<CreditCard>();
    @Output() delete = new EventEmitter<string>();
  
    constructor(private modal: NzModalService) {}
  
    selectCard(card: CreditCard): void {
      this.select.emit(card);
    }
  
    confirmDelete(card: CreditCard): void {
      this.modal.confirm({
        nzTitle: 'Are you sure you want to delete this credit card?',
        nzContent: `Card Number: ${this.maskCardNumber(card.cardNumber)}`,
        nzOkText: 'Yes',
        nzOkType: 'default',
        nzOnOk: () => this.delete.emit(card.id),
        nzCancelText: 'No',
      });
    }
  
    maskCardNumber(cardNumber: string): string {
      const last4 = cardNumber.slice(-4);
      return `**** **** **** ${last4}`;
    }
}