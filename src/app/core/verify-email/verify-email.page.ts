import { AuthService } from './../../services/auth.service';
import { Observable } from 'rxjs';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/user.interface';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../services/storage.service';
import { ToastService } from 'src/app/services/toast.service';
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnDestroy {
  user$: Observable<User> = this.authSvc.afAuth.user;
  language: string;
  loading: boolean = false;

  constructor(
    private authSvc: AuthService,
    private translate: TranslateService,
    private storage: StorageService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.getLanguage();
  }

  getLanguage() {
    this.storage.getString('language').then((data: any) => {
      if (data.value) {
        this.language = data.value;
        this.translate.setDefaultLang(this.language);
      } else {
        this.language = 'en';
        this.storage.setString('language', this.language);
        this.translate.setDefaultLang(this.language);
      }
    });
  }

  onSelectChange(selectedValue: any) {
    this.language = selectedValue.detail.value;
    this.translate.setDefaultLang(this.language);
    this.storage.setString('language', this.language);
  }

  async onSendEmail(): Promise<void> {
    this.loading = true;
    try {
      await this.authSvc.sendVerificationEmail();
      this.loading = false;
      if (this.language === 'en') {
        this.toastService.displayToastSuccess(
          'RESPONSE',
          'We have resent a confirmation message to your email.',
          'Close'
        );
      } else {
        this.toastService.displayToastSuccess(
          'RESPUESTA',
          'Hemos reenviado un mensaje de confirmación a su correo.',
          'Cerrar'
        );
      }
    } catch (error) {
      this.loading = false;
      if (this.language === 'en') {
        this.toastService.displayToastError(
          'RESPONSE',
          'Oops, something happened, please try again later.',
          'Close'
        );
      } else {
        this.toastService.displayToastError(
          'RESPUESTA',
          'Oops, algo ha ocurrido, inténtelo más tarde.',
          'Cerrar'
        );
      }
    }
  }

  navigateToLogin() {
    this.router.navigate(['login']);
  }

  ngOnDestroy(): void {
    this.authSvc.logout();
  }
}
