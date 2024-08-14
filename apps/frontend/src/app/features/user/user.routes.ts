import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AddUserComponent } from './add/add-user.component';

export const userRoutes: Route[] = [
  {
    path: 'add',
    component: AddUserComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
