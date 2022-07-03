import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../services/storage.service';
import { ToastService } from 'src/app/services/toast.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  language: string;
  constructor(
    private authSvc: AuthService,
    private router: Router,
    private translate: TranslateService,
    private storage: StorageService,
    private toastService: ToastService
  ) {
    this.getLanguage();
  }

  ngOnInit() {
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

  async onResetPassword(email) {
    try {
      await this.authSvc.resetPaswword(email.value);
      if (this.language === 'en') {
        this.toastService.displayToastSuccess('RESPONSE', 'We have sent you an email to change your password, follow the instructions.', 'Close');
      } else {
        this.toastService.displayToastSuccess('RESPUESTA', 'Le hemos enviado un correo para que cambie su contraseña, siga las instrucciones.', 'Cerrar');
      }
      this.router.navigate(['login']);
    }
    catch (error) {
      console.log('Error --->', error);
    }
  }

  navigateLogin(){
    this.router.navigate(['login']);
  }
}
