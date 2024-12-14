import { Component, ContentChildren, QueryList, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { WizardStepDirective } from './wizard-step.directive';
import { CommonModule } from '@angular/common';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-wizard',
  template: `<nz-steps [nzCurrent]="currentIndex" nzDirection="horizontal">
  <nz-step *ngFor="let step of steps" [nzTitle]="step.title"></nz-step>
</nz-steps>

<div class="wizard-content">
  <ng-container *ngFor="let step of steps; let i = index">
    <ng-container *ngIf="currentIndex === i">
      <ng-container *ngTemplateOutlet="step.templateRef"></ng-container>
    </ng-container>
  </ng-container>
</div>

<div class="wizard-actions">
  <button nz-button (click)="previous()" [disabled]="currentIndex === 0">Back</button>
  <button
  nz-button
  nzType="primary"
  (click)="next()"
  [disabled]="steps.length === 0 || !steps[currentIndex].isValid() || currentIndex === steps.length - 1"
>
  {{ currentIndex === steps.length - 1 ? 'Finish' : 'Next' }}
</button>
</div>
`,
  styleUrls: ['./wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, NzStepsModule, NzButtonModule, WizardStepDirective]
})
export class WizardComponent implements AfterViewInit {
  @ContentChildren(WizardStepDirective) stepsRef!: QueryList<WizardStepDirective>;
  steps: WizardStepDirective[] = [];
  currentIndex = 0;

  constructor(private cdr: ChangeDetectorRef) {}


  ngAfterViewInit(): void {
    this.steps = this.stepsRef.toArray();
  
    if (this.steps.length > 0) {
      this.steps[this.currentIndex]?.onEnter();
    } else {
      console.error('No steps found in WizardComponent.');
    }
  
    this.cdr.detectChanges();
  }
  
  next() {
    const currentStep = this.steps[this.currentIndex];
    if (this.currentIndex < this.steps.length - 1 && currentStep.isValid()) {
      currentStep.onExit();
      this.currentIndex++;
      this.steps[this.currentIndex]?.onEnter();
    }
  }
  
  previous() {
    if (this.currentIndex > 0) {
      this.steps[this.currentIndex]?.onExit();
      this.currentIndex--;
      this.steps[this.currentIndex]?.onEnter();
    }
  }
  
}