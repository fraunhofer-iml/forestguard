import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SharedReload } from '../shared/utils/sharedReload';
import { ContentLayoutComponent } from './components/content-layout/content-layout.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AuthenticationService } from './services/authentication.service';

@NgModule({
  declarations: [SidenavComponent, ContentLayoutComponent],
  imports: [CommonModule, RouterModule, NgOptimizedImage, BrowserAnimationsModule, SharedModule],
  exports: [SidenavComponent, ContentLayoutComponent],
  providers: [AuthenticationService, SharedReload],
})
export class CoreModule {}
