import { Signal } from '@angular/core';
import { AbstractControl, FormControlState } from '@angular/forms';
import { Observable } from 'rxjs';

export type FormsDictionary = Record<string, AbstractControl>;

type ControlRawValue<T> = T extends AbstractControl<infer TValue>
  ? TValue extends FormControlState<infer Inner>
    ? Inner
    : Exclude<TValue, FormControlState<any> | null>
  : never;

export type FormObservableDictionary<FormsDictionary> = {
  [key in keyof FormsDictionary as `${string & key}Changes`]: Observable<
    ControlRawValue<FormsDictionary[key]>
  >;
};

export type FormSignalsDictionary<FormsDictionary> = {
  [key in keyof FormsDictionary as `${string &
    key}Value`]: FormsDictionary[key] extends AbstractControl<infer TValue>
    ? Signal<TValue>
    : never;
};

export interface WithFormsOptions {
  debounceTime?: number;
}
