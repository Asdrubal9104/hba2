import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  language: string;
  classFacebook: string;
  classGoogle: string;

  constructor(
    private router: Router,
    private authSvc: AuthService,
    private translate: TranslateService
  ) {
    this.language = 'en';
    translate.setDefaultLang('en');
    this.classFacebook = 'circle-content inactive';
    this.classGoogle = 'circle-content inactive';
  }

  ngOnInit() {
  }

  onSelectChange(selectedValue: any) {
    this.translate.setDefaultLang(selectedValue.detail.value);
  }

  ionViewWillEnter() {
    this.getCurrentState();
  }

  async getCurrentState() {
    const result = await Plugins.FacebookLogin.getCurrentAccessToken();
    try {
      console.log(result);
      if (result && result.accessToken) {
        const user = { token: result.accessToken.token, userId: result.accessToken.userId };
        const navigationExtras: NavigationExtras = {
          queryParams: {
            userinfo: JSON.stringify(user)
          }
        };
        this.router.navigate(['/mainscreen'], navigationExtras);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async signIn(): Promise<void> {  
    this.classFacebook = 'circle-content active';
    const FACEBOOK_PERMISSIONS = ['public_profile', 'email'];

    const result = await Plugins.FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
    if (result && result.accessToken) {
      const user = { token: result.accessToken.token, userId: result.accessToken.userId };
      const navigationExtras: NavigationExtras = {
        queryParams: {
          userinfo: JSON.stringify(user)
        }
      };
      this.router.navigate(['/mainscreen'], navigationExtras);
    }
  }

  async onLogin(email, password) {
    try {
      const user = await this.authSvc.login(email.value, password.value);
      if (user) {
        const isVerified = this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified);
      }
    }
    catch (error) {
      console.log('Error---->', error);
    }
  }

  async onLoginGoogle() {
    this.classGoogle = 'circle-content active';
    try {
      const user = await this.authSvc.loginGoogle();
      if (user) {
        const isVerified = this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified);
      }
    }
    catch (error) {
      console.log('Error-->', error);
    }
  }

  private redirectUser(isVerified: boolean) {
    if (isVerified) {
      this.router.navigate(['mainscreen']);
    } else {
      this.router.navigate(['verify-email']);
    }
  }
}
