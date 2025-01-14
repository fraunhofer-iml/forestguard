/*
 * Copyright 2025 Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UploadFormSelectType } from './upload-form-select.type';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
})
export class UploadFormComponent {
  @Input() title?: string;
  @Input() buttonText = 'Add file';
  @Input() buttonTooltip = 'Add file to upload at save';
  @Input() selectOptions?: UploadFormSelectType[];
  @Input() showUploadedFiles = true;
  @Input() showDescriptionField = false;
  @Input() informationText?: string;
  @Input() uploadedFiles: { file: File; documentType?: string }[] = [];
  @Input() uploadedFilesPosition: 'bottom' | 'right' = 'bottom';

  @Output() uploadDocument = new EventEmitter<{ file: File; documentType?: string }>();
  @Output() removeDocument = new EventEmitter<{ file: File; documentType?: string }>();

  file: File | null = null;

  formGroup: FormGroup = new FormGroup({
    documentType: new FormControl(null),
    file: new FormControl(null, Validators.required),
    description: new FormControl(null),
  });

  lengthOfUploadedFiles(): number {
    return this.selectOptions?.filter((option) => option.file).length ?? this.uploadedFiles.length;
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!target.files) return;
    const file = target.files[0];

    this.formGroup.patchValue({
      file: file,
    });
  }

  submitDocument(): void {
    if (this.formGroup.valid) {
      this.uploadDocument.emit({
        file: this.formGroup.value.file,
        documentType: this.formGroup.value.documentType ?? this.formGroup.value.description,
      });
      this.formGroup.reset();
    }
  }
}
