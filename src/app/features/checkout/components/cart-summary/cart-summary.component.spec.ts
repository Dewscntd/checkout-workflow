import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartSummaryComponent } from './cart-summary.component';

describe('CartSummaryComponent', () => {
  let component: CartSummaryComponent;
  let fixture: ComponentFixture<CartSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartSummaryComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CartSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
