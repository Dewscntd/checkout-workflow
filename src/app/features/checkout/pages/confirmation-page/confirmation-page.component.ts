import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
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
          <h2>Order Confirmation</h2>
          <nz-alert nzType="success" nzMessage="Your order has been placed successfully!" nzShowIcon></nz-alert>
          <p *ngIf="orderId$ | async as orderId">Your Order ID: {{ orderId }}</p>
          <p *ngIf="!(orderId$ | async)">Your Order ID is being generated. Please wait...</p>

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
  orderId$: Observable<string | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  private destroy$ = new Subject<void>();

  constructor(private facade: CheckoutFacadeService) {
    this.loading$ = this.facade.loading$.pipe(
      map(loading => loading['placeOrder'] || false)
    );
    this.error$ = this.facade.error$;
    this.orderId$ = this.facade.orderId$;
  }

  ngOnInit(): void {
    this.orderId$.pipe(takeUntil(this.destroy$)).subscribe(orderId => {
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
