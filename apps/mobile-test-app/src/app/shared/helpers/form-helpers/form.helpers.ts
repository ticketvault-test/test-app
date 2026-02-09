import { NgForm, NgModel } from '@angular/forms';

export function triggerNgModelValidation(ngModel: NgModel): void {
  ngModel.control.markAsTouched();
  ngModel.control.updateValueAndValidity();
}

export function isFormValid(form: NgForm): boolean {
  if (!form) return false;

  for (const key in form.controls) {
    form.controls[key].markAsTouched();
    form.controls[key].updateValueAndValidity();
  }

  form.control.markAsTouched();
  form.control.updateValueAndValidity();

  return form.valid;
}
