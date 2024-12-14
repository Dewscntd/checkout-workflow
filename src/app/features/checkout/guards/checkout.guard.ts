// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
// import { CheckoutFacadeService } from '../services/checkout-facade.service';
// import { map } from 'rxjs/operators';
// import { Observable } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class CheckoutGuard implements CanActivate {
//   constructor(private facade: CheckoutFacadeService, private router: Router) {}

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
//     return this.facade.state$.pipe(
//       map((checkoutState) => {
//         const step = route.routeConfig?.path;

//         if (step === 'shipping') {
//           if (!checkoutState.cartItems || checkoutState.cartItems.length === 0) {
//             this.router.navigate(['/checkout/cart']);
//             return false;
//           }
//         }

//         if (step === 'payment') {
//           if (!checkoutState.selectedAddressId) {
//             this.router.navigate(['/checkout/shipping']);
//             return false;
//           }
//         }

//         if (step === 'confirmation') {
//           if (!checkoutState.selectedPaymentMethod) {
//             this.router.navigate(['/checkout/payment']);
//             return false;
//           }
//         }

//         return true;
//       })
//     );
//   }
// }
