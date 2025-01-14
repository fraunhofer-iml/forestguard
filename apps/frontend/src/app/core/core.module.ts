/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ContentLayoutComponent } from './components/content-layout/content-layout.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AuthenticationService } from './services/authentication.service';

@NgModule({
  declarations: [SidenavComponent, ContentLayoutComponent],
  imports: [CommonModule, RouterModule, NgOptimizedImage, BrowserAnimationsModule, SharedModule],
  exports: [SidenavComponent, ContentLayoutComponent],
  providers: [AuthenticationService],
})
export class CoreModule {}
