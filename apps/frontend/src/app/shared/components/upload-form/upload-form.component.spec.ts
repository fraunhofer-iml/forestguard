/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UploadFormComponent } from './upload-form.component';

describe('UploadFormComponent', () => {
  let component: UploadFormComponent;
  let fixture: ComponentFixture<UploadFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadFormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the length of uploaded files', () => {
    component.selectOptions = [
      { file: undefined, key: '', value: '' },
      { file: new File([''], 'file1.txt'), key: '', value: '' },
      { file: new File([''], 'file2.txt'), key: '', value: '' },
    ];

    expect(component.lengthOfUploadedFiles()).toBe(2);
  });

  it('should update the file control when a file is selected', () => {
    const file = new File([''], 'file.txt');
    const event = { target: { files: [file] } } as unknown as Event;

    component.onFileSelected(event);

    expect(component.formGroup.get('file')?.value).toBe(file);
  });

  it('should emit the uploadDocument event and reset the form when submitDocument is called with valid form', () => {
    const file = new File([''], 'file.txt');
    const documentType = 'type';

    component.formGroup = new FormGroup({
      documentType: new FormControl(documentType, Validators.required),
      file: new FormControl(file, Validators.required),
    });

    jest.spyOn(component.uploadDocument, 'emit');
    jest.spyOn(component.formGroup, 'reset');

    component.submitDocument();

    expect(component.uploadDocument.emit).toHaveBeenCalledWith({ file, documentType });
    expect(component.formGroup.reset).toHaveBeenCalled();
  });

  it('should not emit the uploadDocument event and reset the form when submitDocument is called with invalid form', () => {
    component.formGroup = new FormGroup({
      documentType: new FormControl(null, Validators.required),
      file: new FormControl(null, Validators.required),
    });

    jest.spyOn(component.uploadDocument, 'emit');
    jest.spyOn(component.formGroup, 'reset');

    component.submitDocument();

    expect(component.uploadDocument.emit).not.toHaveBeenCalled();
    expect(component.formGroup.reset).not.toHaveBeenCalled();
  });
});
