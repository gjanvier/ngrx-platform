import { toSignal } from '@angular/core/rxjs-interop';
import { signalStoreFeature, withFeature, withProps } from '@ngrx/signals';
import {
  FormObservableDictionary,
  FormsDictionary,
  FormSignalsDictionary,
  WithFormsOptions,
} from './models';
import { observeFormChanges } from './helpers';

export function withForms<Forms extends FormsDictionary>(
  formsFactory: () => Forms,
  options?: WithFormsOptions
) {
  return withFeature(() => {
    const forms = formsFactory();

    const formEntries = Object.entries(forms).map(([key, control]) => {
      const formChanges = observeFormChanges(control, options);
      const formValue = toSignal(formChanges, {
        initialValue: forms[key].value,
      });
      return [key, { formChanges, formValue }] as const;
    });

    return signalStoreFeature(
      withProps(() => ({
        // Forms as props
        ...forms,

        // Form changes as observables
        ...(Object.fromEntries(
          formEntries.map(([key, { formChanges }]) => [
            `${key}Changes`,
            formChanges,
          ])
        ) as FormObservableDictionary<Forms>),

        // Form values as signals
        ...(Object.fromEntries(
          formEntries.map(([key, { formValue }]) => [`${key}Value`, formValue])
        ) as FormSignalsDictionary<Forms>),
      }))
    );
  });
}
