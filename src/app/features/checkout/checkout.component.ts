import { Component } from "@angular/core";
import { WizardStepDirective } from "./components/wizard/wizard-step.directive";
import { WizardComponent } from "./components/wizard/wizard.component";
import { CartPageComponent } from "./pages/cart-page/cart-page.component";
import { PaymentPageComponent } from "./pages/payment-page/payment-page.component";
import { SuccessStepComponent } from "./pages/success-page/success-step.component";
import { ShippingPageComponent } from "./pages/shipping-page/shipping-page.component";
import { ConfirmationPageComponent } from "./pages/confirmation-page/confirmation-page.component";

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    WizardComponent,
    CartPageComponent,
    ShippingPageComponent,
    PaymentPageComponent,
    WizardStepDirective,
    SuccessStepComponent,
    ConfirmationPageComponent
],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

}
