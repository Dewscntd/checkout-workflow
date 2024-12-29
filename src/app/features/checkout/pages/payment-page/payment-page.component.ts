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
import { FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';

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
    
    <div *ngIf="selectedMethod === paymentMethodEnum.PurchaseOrder" class="purchase-order-section">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzFor="poNumber">PO Number</nz-form-label>
        <nz-form-control [nzSpan]="14" nzErrorTip="Please input your PO number!">
          <input 
            nz-input 
            id="poNumber" 
            type="text" 
            name="poNumber"
            [(ngModel)]="poNumber" 
            (ngModelChange)="onPONumberChange($event)"
            required
            placeholder="Enter Purchase Order Number" />
        </nz-form-control>
      </nz-form-item>  
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
    NzFormModule,
    FormsModule
  ],
  styles: [`
    .error {
      margin-bottom: 16px;
    }
    .credit-card-section, .purchase-order-section {
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
  @Output() orderPlaced = new EventEmitter<void>();

  title = 'Payment';
  paymentMethodEnum = PaymentMethod; 
  poNumber: string = '';

  error$: Observable<string | null>;
  paymentOptions$: Observable<PaymentMethod[]>;
  creditCards$: Observable<CreditCard[]>;
  loading$: Observable<Record<string, boolean>>;
  selectedMethod: PaymentMethod | null = null;

  canPlaceOrder$!: Observable<boolean>;

  private destroy$ = new Subject<void>();

  constructor(
    private facade: CheckoutFacadeService,
    private modal: NzModalService,
    private message: NzMessageService,
  ) {

    this.error$ = this.facade.error$;
    this.paymentOptions$ = this.facade.paymentOptions$;
    this.creditCards$ = this.facade.creditCards$;
    this.loading$ = this.facade.loading$;
  }

  ngOnInit(): void {    
    this.facade.loadPaymentOptions();

    this.canPlaceOrder$ = combineLatest([
      this.facade.order$,
      this.facade.selectedAddressId$,
      this.facade.selectedPaymentMethod$,
      this.facade.purchaseOrderNumber$,
      this.facade.paymentInfoId$
    ]).pipe(
      map(([order, addressId, paymentMethod, poNumber, paymentInfoId]) => {
        console.log('canPlaceOrder$ values:', {
          order,
          addressId,
          paymentMethod,
          poNumber,
          paymentInfoId
        });
    
        if (!order || !addressId || !paymentMethod) return false;
    
        if (paymentMethod === PaymentMethod.PurchaseOrder) {
          return !!poNumber && poNumber.trim().length > 0;
        }
    
        if (paymentMethod === PaymentMethod.CreditCard) {
          return !!paymentInfoId && paymentInfoId.trim().length > 0;
        }
    
        return false;
      })
    );
    
  }

  onPONumberChange(value: string): void {
    this.poNumber = value;
    this.facade.setPurchaseOrderNumber(value);
  }


  onPaymentMethodSelected(event: { method: PaymentMethod; data?: any }) {
    const method = event.method;

    this.selectedMethod = method;
    this.facade.choosePaymentMethod(method, undefined);

    if (method === PaymentMethod.PurchaseOrder) {
      this.message.info('Please enter your Purchase Order Number.');
    } else if (method === PaymentMethod.CreditCard) {
      this.message.info('Please select a saved credit card.');
    } else {
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
    if (this.selectedMethod === PaymentMethod.PurchaseOrder && !this.poNumber.trim()) {
      this.message.error('Please enter a valid Purchase Order Number.');
      return;
    }
  
    this.facade.placeOrder();
    
    this.facade.orderId$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(orderId => {
      if (orderId) {
        this.message.success('Order placed successfully.');
        this.orderPlaced.emit();
      }
    });

    this.facade.error$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(error => {
      if (error) {
        this.message.error(error);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}