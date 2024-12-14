import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AsyncPipe, NgIf, CurrencyPipe, NgFor } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CheckoutFacadeService } from '../../services/checkout-facade.service';

@Component({
  selector: 'app-confirmation-page',
  template: `
    <h2>Order Confirmation</h2>

    <nz-spin [nzSpinning]="loading$ | async">
      <nz-table
        *ngIf="(orderItems$ | async) as items"
        [nzData]="items"
        nzBordered
        nzSize="middle"
      >
        <thead>
          <tr>
            <th nzWidth="30%">Product</th>
            <th nzWidth="20%">Quantity</th>
            <th nzWidth="20%">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of items">
            <td>{{ item.product.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ (item.product.discountedPrice || item.product.price) | currency }}</td>
          </tr>
        </tbody>
      </nz-table>

      <div class="summary" *ngIf="order$ | async as order">
        <p>Shipping: {{ order.shipping | currency }}</p>
        <p>Tax: {{ order.tax | currency }}</p>
        <p>Subtotal: {{ order.subtotal | currency }}</p>
        <p><strong>Total: {{ order.total | currency }}</strong></p>
      </div>

      <button nz-button nzType="primary" (click)="placeOrder()" [disabled]="(loading$ | async)?.['placeOrder']">
        Place Order
      </button>
    </nz-spin>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, NzSpinModule, NzTableModule, NzButtonModule, CurrencyPipe, NgIf, NgFor],
})
export class ConfirmationPageComponent implements OnInit {
  order$ = this.facade.order$;
  orderItems$ = this.facade.orderItems$;
  loading$ = this.facade.loading$;

  constructor(private facade: CheckoutFacadeService) {}

  ngOnInit(): void {
    this.facade.loadOrderData(); // Previously loadCartData()
  }

  placeOrder(): void {
    this.facade.placeOrder();
  }
}
