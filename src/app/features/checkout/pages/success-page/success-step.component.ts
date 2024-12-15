import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-success-step',
  template: `
    <div class="success-step">
      <h2>Thank You for Your Purchase!</h2>
      <p>Your order has been placed successfully.</p>
      <p>We hope you enjoy your shopping experience!</p>
      <button nz-button nzType="primary" (click)="goToHome()">Back to Home</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./success-step.component.scss'],
  standalone: true,
  imports: [NzButtonModule],
})
export class SuccessStepComponent {
  goToHome(): void {
    window.location.href = '/';
  }
}
