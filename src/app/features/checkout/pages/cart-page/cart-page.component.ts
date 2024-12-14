import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgForOf, CurrencyPipe, NgIf, JsonPipe } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { CheckoutFacadeService } from '../../services/checkout-facade.service';
import { CouponFormControls } from '../../../../core/models/cart.types';


@Component({
  selector: 'app-cart-page',
  template: `
<h2>Cart</h2>

<nz-alert *ngIf="(error$ | async) as error" nzType="error" [nzMessage]="error"></nz-alert>

<nz-spin [nzSpinning]="(loading$ | async)?.['loadOrder']">
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

    <!-- Card Layout for Small Screens -->
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
  </ng-container>

  <form [formGroup]="couponForm" (ngSubmit)="applyCoupon()" class="coupon-form">
    <label>
      <span>Coupon Code:</span>
      <input nz-input formControlName="couponCode" placeholder="MyCoupon20" />
    </label>
    <button nz-button type="submit" [disabled]="couponForm.invalid">Apply Coupon</button>
  </form>
</nz-spin>

  `,
  styleUrls: ['./cart-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, NgForOf, CurrencyPipe, NgIf, NzSpinModule, NzInputModule, NzButtonModule, ReactiveFormsModule, NzAlertModule, JsonPipe]
})
export class CartPageComponent implements OnInit {
  orderItems$ = this.facade.orderItems$;
  order$ = this.facade.order$
  loading$ = this.facade.loading$;
  error$ = this.facade.error$;

  couponForm: FormGroup<CouponFormControls>;

  constructor(
    private facade: CheckoutFacadeService,
    private fb: NonNullableFormBuilder
  ) {
    this.couponForm = this.fb.group<CouponFormControls>({
      couponCode: this.fb.control('', Validators.required)
    });
  }

  ngOnInit() {
    this.facade.loadOrderData();
  }

  applyCoupon() {
    if (this.couponForm.valid) {
      const { couponCode } = this.couponForm.getRawValue();
      this.facade.applyCoupon(couponCode);
    }
  }
}
