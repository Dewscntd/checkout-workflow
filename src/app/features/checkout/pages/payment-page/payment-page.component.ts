import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CreditCard, PaymentMethod } from '../../../../core/models/payment.types';
import { AddCreditCardComponent } from '../../components/add-credit-card/add-credit-card.component';
import { AsyncPipe, NgIf, CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CreditCardListComponent } from '../../components/credit-card-list/credit-card-list.component';
import { PaymentMethodSelectorComponent } from '../../components/payment-method-selector/payment-method-selector.component';
import { CheckoutFacadeService } from '../../services/checkout-facade.service';

@Component({
  selector: 'app-payment-page',
  template: `
    <h2>{{ title }}</h2>
    
    <div *ngIf="(error$ | async) as error" class="error">
      <nz-alert nzType="error" [nzMessage]="error"></nz-alert>
    </div>
    
    <div *ngIf="paymentOptions$ | async as paymentOptions">
      <app-payment-method-selector 
        [paymentOptions]="paymentOptions" 
        (paymentMethodSelected)="onPaymentMethodSelected($event)">
      </app-payment-method-selector>
    </div>

    <div *ngIf="selectedMethod === paymentMethodEnum.CreditCard" class="credit-card-section">
      <h3>Saved Credit Cards</h3>
      <nz-spin [nzSpinning]="(loading$ | async)?.['getCreditCards']">
        <app-credit-card-list 
          [creditCards]="creditCards$ | async" 
          (select)="onSelectCreditCard($event)" 
          (delete)="onDeleteCreditCard($event)">
        </app-credit-card-list>
      </nz-spin>
      <button nz-button nzType="dashed" (click)="openAddCreditCardModal()" class="add-card-button">
        Add New Credit Card
      </button>
    </div>

    <button 
      nz-button 
      nzType="primary" 
      (click)="placeOrder()" 
      [disabled]="!(canPlaceOrder$ | async)" 
      class="place-order-button">
      Place Order
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    PaymentMethodSelectorComponent,
    CreditCardListComponent,
    AddCreditCardComponent,
    NzAlertModule,
    NzButtonModule,
    NzSpinModule,
    NzModalModule,
    NzMessageModule,
    CommonModule,
  ],
  styles: [`
    .error {
      margin-bottom: 16px;
    }
    .credit-card-section {
      margin-top: 24px;
    }
    .add-card-button {
      margin-top: 16px;
    }
    .place-order-button {
      margin-top: 24px;
    }
  `]
})
export class PaymentPageComponent implements OnInit, OnDestroy {
  title = 'Payment';
  paymentMethodEnum = PaymentMethod; 

  error$ = this.facade.error$;
  paymentOptions$ = this.facade.paymentOptions$;
  creditCards$ = this.facade.creditCards$;
  loading$ = this.facade.loading$;
  selectedMethod: PaymentMethod | null = null;

  private destroy$ = new Subject<void>();

  canPlaceOrder$: Observable<boolean> = combineLatest([
    this.facade.order$,
    this.facade.selectedAddressId$,
    this.facade.selectedPaymentMethod$
  ]).pipe(
    map(([order, addressId, paymentMethod]) => !!(order && addressId && paymentMethod))
  );

  @Output() orderPlaced = new EventEmitter<void>();

  constructor(
    private facade: CheckoutFacadeService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.facade.loadOrderData();
    this.facade.loadAddresses();
    this.facade.loadPaymentOptions();

    this.facade.getCreditCards().pipe(takeUntil(this.destroy$)).subscribe(cards => {
    });

    this.paymentOptions$.subscribe(options => {
    });

    this.error$.subscribe(error => {
      if (error) {
      }
    });
  }

  onPaymentMethodSelected(event: { method: PaymentMethod; data?: any }) {
    const method = event.method;
    this.selectedMethod = method;

    if (method === PaymentMethod.CreditCard) {
    } else {
      this.facade.choosePaymentMethod(method, undefined);
      this.message.success(`Payment method ${method} selected.`);
    }
  }

  onSelectCreditCard(card: CreditCard): void {
    if (!card.id) {
      this.message.error('Invalid credit card selected.');
      return;
    }
    this.facade.selectCreditCard(card.id);
    this.message.success('Credit card selected as payment method.');
  }

  onDeleteCreditCard(cardId: string): void {
    this.facade.deleteCreditCard(cardId);
    this.message.success('Credit card deleted successfully.');
  }

  openAddCreditCardModal(): void {
    const modal = this.modal.create({
      nzTitle: 'Add New Credit Card',
      nzContent: AddCreditCardComponent,
      nzFooter: null,
      nzWidth: '400px',
    });

    const instance = modal.componentInstance as AddCreditCardComponent;

    const addSubscription = instance.add.pipe(takeUntil(this.destroy$)).subscribe(cardData => {
      this.facade.addCreditCard(cardData);
      this.message.success('Credit card added successfully.');
      modal.close();
    });

    const cancelSubscription = instance.cancelSelection.pipe(takeUntil(this.destroy$)).subscribe(() => {
      modal.close();
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(() => {
      addSubscription.unsubscribe();
      cancelSubscription.unsubscribe();
    });
  }

  placeOrder(): void {
    this.facade.placeOrder();
    this.message.success('Order placed successfully.');
    this.orderPlaced.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
