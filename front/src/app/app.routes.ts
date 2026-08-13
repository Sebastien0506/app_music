import { Routes } from '@angular/router';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FormsResetPasswordComponent } from './forms-reset-password/forms-reset-password.component';
import { UserComponent } from './user/user.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AddMusicComponent } from './add-music/add-music.component';
import { InfoMusicComponent } from './info-music/info-music.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { GetCategoryComponent } from './get-category/get-category.component';
import { MusicCategoryComponent } from './music-category/music-category.component';
import { GetAllMusicComponent } from './get-all-music/get-all-music.component';

export const routes: Routes = [
    {path: 'reset_password', component: ResetPasswordComponent},
    {path: 'forms_reset_password', component: FormsResetPasswordComponent},
    {path: 'user-account', component: UserComponent},
    {path: 'add-music', component: AddMusicComponent},
    {path: 'info_music/:id', component: InfoMusicComponent},
    {path: 'create_category', component: CreateCategoryComponent},
    {path: 'get_category', component: GetCategoryComponent},
    {path: 'category/:id/musics', component: MusicCategoryComponent},
    {path: 'get_all_music', component: GetAllMusicComponent}
    
    // {path: 'admin-dashboard', component: AdminDashboardComponent},
];
