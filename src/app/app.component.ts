import {Component, OnInit} from '@angular/core';
import {PrimeNGConfig} from 'primeng/api';
import { Router } from '@angular/router';
import { AuthenticationService } from './core/_services/authentication.service';
import { User } from './core/_models/user';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit{

    layoutMode = 'slim';

    lightMenu = true;

    topbarColor = 'layout-topbar-blue';

    inlineUser = false;

    isRTL = false;

    inputStyle = 'outlined';

    ripple = true;

    currentUser: User;

    constructor(private primengConfig: PrimeNGConfig, private router: Router,
        private authenticationService: AuthenticationService) {

            this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

         }

    ngOnInit() {
        this.primengConfig.ripple = true;
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

}
