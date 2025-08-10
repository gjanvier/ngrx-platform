import { isSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { signalStore } from '@ngrx/signals';
import { isObservable } from 'rxjs';
import { withForms } from '../src';

describe('withForms', () => {
  it('adds form to the store', () => {
    const form = new FormControl('');

    const Store = signalStore(withForms(() => ({ form })));
    let store!: InstanceType<typeof Store>;
    TestBed.runInInjectionContext(() => (store = new Store()));

    expect(store.form).toBe(form);
  });

  it('adds form value as a signal', () => {
    const form = new FormControl('');

    const Store = signalStore(withForms(() => ({ form })));
    let store!: InstanceType<typeof Store>;
    TestBed.runInInjectionContext(() => (store = new Store()));

    expect(isSignal(store.formValue)).toBe(true);
    expect(store.formValue()).toBe('');

    form.setValue('new value');
    expect(store.formValue()).toBe('new value');
  });

  it('adds form valueChange as an observable', () => {
    const form = new FormControl('');

    const Store = signalStore(withForms(() => ({ form })));
    let store!: InstanceType<typeof Store>;
    TestBed.runInInjectionContext(() => (store = new Store()));

    expect(isObservable(store.formChanges)).toBe(true);

    const values: (string | null)[] = [];
    store.formChanges.subscribe((value) => values.push(value));

    form.setValue('new value');
    expect(values.length).toBe(1);
    expect(values[0]).toBe('new value');
  });

  it('should support formGroup', () => {
    const form = new FormGroup({
      search: new FormControl('', { nonNullable: true }),
      ignoreCase: new FormControl(false, { nonNullable: true }),
    });

    const Store = signalStore(withForms(() => ({ form })));
    let store!: InstanceType<typeof Store>;
    TestBed.runInInjectionContext(() => (store = new Store()));

    expect(store.form).toBe(form);

    expect(isSignal(store.formValue)).toBe(true);
    expect(store.formValue()).toEqual({
      search: '',
      ignoreCase: false,
    });

    expect(isObservable(store.formChanges)).toBe(true);

    const values: (string | null)[] = [];
    store.formChanges.subscribe((value) => values.push(value));

    form.patchValue({
      search: 'new value',
      ignoreCase: true,
    });

    expect(store.formValue()).toEqual({
      search: 'new value',
      ignoreCase: true,
    });

    expect(values.length).toBe(1);
    expect(values[0]).toEqual({
      search: 'new value',
      ignoreCase: true,
    });
  });

  it('should support multiple forms', () => {
    const form1 = new FormControl('');

    const form2 = new FormGroup({
      search: new FormControl('', { nonNullable: true }),
      ignoreCase: new FormControl(false, { nonNullable: true }),
    });

    const Store = signalStore(withForms(() => ({ form1, form2 })));
    let store!: InstanceType<typeof Store>;
    TestBed.runInInjectionContext(() => (store = new Store()));

    expect(store.form1).toBe(form1);
    expect(store.form2).toBe(form2);

    expect(isSignal(store.form1Value)).toBe(true);
    expect(store.form1Value()).toBe('');

    expect(isSignal(store.form2Value)).toBe(true);
    expect(store.form2Value()).toEqual({
      search: '',
      ignoreCase: false,
    });

    expect(isObservable(store.form1Changes)).toBe(true);
    expect(isObservable(store.form2Changes)).toBe(true);
  });
});
