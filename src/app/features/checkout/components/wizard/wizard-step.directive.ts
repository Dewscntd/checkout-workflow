import { Directive, Input, TemplateRef } from '@angular/core';
import { WizardStep } from './wizard-step.types';

@Directive({ selector: '[wizardStep]', standalone: true })
export class WizardStepDirective implements WizardStep {
  @Input() title!: string;

  constructor(public templateRef: TemplateRef<any>) {
  }

  isValid(): boolean {
     return true;
    }

    
  onEnter(): void {}

  onExit(): void {}
}
