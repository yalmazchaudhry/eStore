import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-validations-errors',
  templateUrl: './validations-errors.component.html',
  styleUrls: ['./validations-errors.component.css'],
})
export class ValidationsErrorsComponent {
  @Input() control: any;

  shouldDisplayError(): boolean {
    return (
      this.control !== null &&
      this.control !== undefined &&
      this.control.errors !== null &&
      (this.control.touched || this.control.dirty)
    );
  }
  getErrorMessage(): string {
    if (this.control && this.control.errors) {
      const errors: ValidationErrors = this.control.errors;

      if (errors['required']) {
        return 'This field is required.';
      } else if (errors['email']) {
        return 'Please enter a valid email address.';
      } else if (errors['minlength']) {
        const requiredLength: number = errors['minlength'].requiredLength;
        return `Minimum length is ${requiredLength} characters.`;
      } else if (errors['maxlength']) {
        const requiredLength: number = errors['maxlength'].requiredLength;
        return `Maximum length is ${requiredLength} characters.`;
      } else if (errors['pattern']) {
        return 'Invalid phone number';
      }
    }

    return '';
  }
}
