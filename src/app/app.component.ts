import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
  <div class="app-wrapper">
    <header class="app-header"><h1>Checkout:</h1></header>
  <main class="app-main">
    <router-outlet></router-outlet>
  </main>
  <footer class="app-footer">
    <p>&copy; 2024 My E-Commerce App</p>
  </footer>
</div>

  `,
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent {}
