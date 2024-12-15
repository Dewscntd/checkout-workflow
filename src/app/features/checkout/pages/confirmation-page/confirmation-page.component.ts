import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, Input } from '@angular/core';
import { CheckoutFacadeService } from '../../services/checkout-facade.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-page',
  template: `
    <div *ngIf="(loading$ | async) as loading">
      <nz-spin nzTip="Processing your order..." [nzSpinning]="loading">
        <div *ngIf="!loading">
          <h2>Order Confirmation</h2>
          <nz-alert nzType="success" nzMessage="Your order has been placed successfully!" nzShowIcon></nz-alert>
          <p>Your Order ID: {{ orderId }}</p>
          <!-- Additional confirmation details can be added here -->
        </div>
      </nz-spin>
    </div>

    <div *ngIf="(error$ | async) as error">
      <nz-alert nzType="error" [nzMessage]="error" nzShowIcon></nz-alert>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzSpinModule, NzAlertModule, AsyncPipe, NgIf, CommonModule],
  styles: [`
    div {
      margin: 24px;
    }
  `]
})
export class ConfirmationPageComponent implements OnInit, OnDestroy {
  @Input() orderId: string | null = null; // Receive orderId from the wizard

  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  private destroy$ = new Subject<void>();

  constructor(private facade: CheckoutFacadeService) {
    // Map the loading state specifically for 'placeOrder'
    this.loading$ = this.facade.loading$.pipe(
      map(loading => loading['placeOrder'] || false)
    );
    this.error$ = this.facade.error$;
  }

  ngOnInit(): void {
    // Optionally, perform additional actions based on orderId
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
