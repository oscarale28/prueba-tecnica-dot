import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-field-error',
  standalone: true,
  imports: [],
  template: `
  @if(showError) {
  <small class="form-error">
    {{ errorMessage }}
  </small>
  }
  `,
  styleUrl: './field-error.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldError {

  @Input() showError = false
  @Input() errorMessage = '';
}
