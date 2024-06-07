import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ContentLayoutComponent } from './components/content-layout/content-layout.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';

@NgModule({
  declarations: [SidenavComponent, ContentLayoutComponent],
  imports: [CommonModule, RouterModule, NgOptimizedImage, BrowserAnimationsModule],
})
export class CoreModule {}
