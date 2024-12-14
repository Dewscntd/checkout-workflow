export interface WizardStep {
  title: string;
  isValid(): boolean;
  onEnter(): void;
  onExit(): void;
}