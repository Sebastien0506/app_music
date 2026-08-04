import { Routes } from '@angular/router';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FormsResetPasswordComponent } from './forms-reset-password/forms-reset-password.component';
import { UserComponent } from './user/user.component';

export const routes: Routes = [
    {path: 'reset_password', component: ResetPasswordComponent},
    {path: 'forms_reset_password', component: FormsResetPasswordComponent},
    {path: 'user-account', component: UserComponent},
];
