import { AbstractControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { WithFormsOptions } from './models';

export function observeFormChanges<T>(
  form: AbstractControl<T>,
  options?: WithFormsOptions
) {
  const changes = form.valueChanges;
  return options?.debounceTime !== undefined
    ? changes.pipe(debounceTime(options.debounceTime))
    : changes;
}
