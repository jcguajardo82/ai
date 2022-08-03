import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';

import {AppMainComponent} from './app.main.component';
import {AppNotfoundComponent} from './pages/app.notfound.component';
import {AppErrorComponent} from './pages/app.error.component';
import {AppAccessdeniedComponent} from './pages/app.accessdenied.component';


import { DashboardComponent } from './core/main/dashboard/dashboard.component';
import { LoginComponent } from './core/Login/login/login.component';
import { AuthGuard } from './core/_helpers/auth.guard';
import { UsersComponent } from './core/users/users.component';
import { MenusComponent } from './core/menus/menus.component';
import { RolesComponent } from './core/roles/roles.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
           
            {path: 'login', component: LoginComponent},

             
            {

                
                path: '', component: AppMainComponent,canActivate: [AuthGuard] ,
                children: [
                    {path: '', component: DashboardComponent},
                    {path: 'users', component: UsersComponent},
                    {path: 'menus', component: MenusComponent},
                    {path: 'roles', component: RolesComponent},

                ]
            },
            {path: 'error', component: AppErrorComponent},
            {path: 'access', component: AppAccessdeniedComponent},
            {path: 'notfound', component: AppNotfoundComponent},
        
            {path: '**', redirectTo: '/notfound'},
        ], {scrollPositionRestoration: 'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
