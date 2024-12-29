import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { NonNullableFormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgForOf, CurrencyPipe, NgIf, JsonPipe } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CheckoutFacadeService } from '../../services/checkout-facade.service';
import { CouponFormControls } from '../../../../core/models/cart.types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-cart-page',
  template: `
<h2>Cart</h2>

<nz-alert *ngIf="(error$ | async) as error" nzType="error" [nzMessage]="error"></nz-alert>

<nz-alert *ngIf="successMessage" nzType="success" [nzMessage]="successMessage"></nz-alert>

<nz-spin [nzSpinning]="(loading$ | async)?.['loadOrder'] || (loading$ | async)?.['applyCoupon']">
  <ng-container *ngIf="(orderItems$ | async) as items">
    <table class="cart-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>SKU</th>
          <th>Price</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let item of items">
          <td>{{ item.product.name }} ({{ item.product.sizeColor }})</td>
          <td>{{ item.product.sku }}</td>
          <td>{{ item.product.price | currency }}</td>
          <td>{{ item.quantity }}</td>
        </tr>
      </tbody>
    </table>

    <div class="cart-container">
      <div class="cart-item-card" *ngFor="let item of items">
        <div class="product-info">
          <div class="product-name">{{ item.product.name }} ({{ item.product.sizeColor }})</div>
          <div class="product-sku">SKU: {{ item.product.sku }}</div>
        </div>
        <div class="pricing">
          <div class="price">Price: {{ item.product.price | currency }}</div>
          <div class="quantity">Quantity: {{ item.quantity }}</div>
        </div>
      </div>
    </div>

    <div class="order-summary">
      <h3>Order Summary</h3>
      <div class="summary-item">
        <span>Subtotal:</span>
        <span>{{ (order$ | async)?.subtotal | currency }}</span>
      </div>
      <div class="summary-item">
        <span>Discount:</span>
        <span>-{{ (order$ | async)?.discount | currency }}</span>
      </div>
      <div class="summary-item">
        <span>Shipping:</span>
        <span>{{ (order$ | async)?.shipping | currency }}</span>
      </div>
      <div class="summary-item">
        <span>Tax:</span>
        <span>{{ (order$ | async)?.tax | currency }}</span>
      </div>
      <div class="summary-item total">
        <span>Total:</span>
        <span>{{ (order$ | async)?.total | currency }}</span>
      </div>
      <div class="summary-item" *ngIf="(order$ | async)?.appliedCouponCode">
        <span>Applied Coupon:</span>
        <span>{{ (order$ | async)?.appliedCouponCode }}</span>
      </div>
    </div>

    <form [formGroup]="couponForm" (ngSubmit)="applyCoupon()" class="coupon-form">
      <label>
        <span>Coupon Code:</span>
        <input nz-input formControlName="couponCode" placeholder="MyCoupon20" />
      </label>
      <button nz-button type="submit" [disabled]="couponForm.invalid">Apply Coupon</button>
    </form>
  </ng-container>
</nz-spin>
  `,
  styleUrls: ['./cart-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    CurrencyPipe,
    NgIf,
    NzSpinModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzAlertModule,
  
  ]
})
export class CartPageComponent implements OnInit, OnDestroy {
  orderItems$ = this.facade.orderItems$;
  order$ = this.facade.order$;
  loading$ = this.facade.loading$;
  error$ = this.facade.error$;

  couponForm: FormGroup<CouponFormControls>;
  successMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private facade: CheckoutFacadeService,
    private fb: NonNullableFormBuilder,
    private message: NzMessageService
  ) {
    this.couponForm = this.fb.group<CouponFormControls>({
      couponCode: this.fb.control('', Validators.required)
    });
  }

  ngOnInit() {
    this.facade.loadOrderData();

    this.facade.order$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(order => {
      if (order?.appliedCouponCode) {
        this.successMessage = `Coupon "${order.appliedCouponCode}" applied successfully!`;
      } else {
        this.successMessage = null;
      }
    });

  }

  applyCoupon() {
    if (this.couponForm.valid) {
      const { couponCode } = this.couponForm.getRawValue();

      this.facade.applyCoupon(couponCode);
      this.couponForm.reset();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
