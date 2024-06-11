import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UploadFormSelectType } from './upload-form-select.type';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrl: './upload-form.component.css',
})
export class UploadFormComponent {
  @Input() title?: string;
  @Input() selectOptions?: UploadFormSelectType[];

  @Output() uploadDocument = new EventEmitter<{ file: File; documentType: string }>();

  file: File | null = null;

  formGroup: FormGroup = new FormGroup({
    documentType: new FormControl(null, Validators.required),
    file: new FormControl(null, Validators.required),
  });

  lengthOfUploadedFiles(): number {
    return this.selectOptions?.filter((option) => option.file).length || 0;
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
      this.uploadDocument.emit({ file: this.formGroup.value.file, documentType: this.formGroup.value.documentType });
      this.formGroup.reset();
    }
  }
}
