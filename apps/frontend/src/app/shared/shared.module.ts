import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { authHttpInterceptor } from '../core/interceptors/auth-http.interceptor.ts.interceptor';
import { UploadFormComponent } from './components/upload-form/upload-form.component';
import { BatchService } from './services/batch/batch.service';
import { CompanyService } from './services/company/company.service';
import { CultivationService } from './services/cultivation/cultivation.service';
import { PlotOfLandService } from './services/plotOfLand/plotOfLand.service';
import { UserService } from './services/user/user.service';
import { FileSizePipe } from './utils/file-size.pipe';

@NgModule({
  declarations: [UploadFormComponent, FileSizePipe],
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatButtonModule, ReactiveFormsModule, MatInputModule, MatTooltipModule],
  providers: [
    CompanyService,
    BatchService,
    PlotOfLandService,
    UserService,
    CultivationService,
    provideHttpClient(withInterceptors([authHttpInterceptor])),
  ],
  exports: [UploadFormComponent, FileSizePipe],
})
export class SharedModule {}
