import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../services/storage.service';
import { User } from 'src/app/shared/user.interface';
import { UserI } from 'src/app/interfaces/user';
import { Auth2Service } from 'src/app/services/auth2.service';
import { ToastService } from 'src/app/services/toast.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  language: string;
  isSpanish: boolean;
  form: FormGroup;
  submitted: boolean;
  loading: boolean = false;

  constructor(
    private router: Router,
    private authSvc: AuthService,
    private auth2Service: Auth2Service,
    private translate: TranslateService,
    private storage: StorageService,
    private toastService: ToastService,
    private formBuilder: FormBuilder
  ) {
    this.isFirsTime();
    this.getLanguage();
    // this.isFirstTimeOnLogin();
    this.submitted = false;
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  isFirsTime() {
    this.storage.getString('logged').then((data: any) => {
      if (data.value) {
        this.router.navigate(['/mainscreen']);
      }
    });
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
      this.isSpanish = this.language === 'en' ? false : true;
    });
  }

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  ngOnInit() {}

  onSelectChange(selectedValue: any) {
    this.language = selectedValue.detail.value;
    this.translate.setDefaultLang(this.language);
    this.storage.setString('language', this.language);
    this.isSpanish = this.language === 'en' ? false : true;
  }

  get f() {
    return this.form.controls;
  }

  async onLogin() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    var values = this.form.value;

    try {
      const user = await this.authSvc.login(values.email, values.password);
      if (user) {
        const isVerified = this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified, user);
      } else {
        if (this.language === 'en') {
          this.toastService.displayToastError(
            'RESPONSE',
            'Please check your login credentials.',
            'Close'
          );
        } else {
          this.toastService.displayToastError(
            'RESPUESTA',
            'Por favor verifique sus credenciales de autenticación.',
            'Cerrar'
          );
        }
        this.loading = false;
      }
    } catch (error) {
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

  private redirectUser(isVerified: boolean, user: User) {
    if (isVerified) {
      let uid: string;
      this.storage.getString('hbaUid').then((res: any) => {
        if (res.value) {
          uid = res.value;
          this.storage.getObject('hbaUser').then((dataUser: any) => {
            let user = JSON.parse(dataUser);
            const data: UserI = {
              uid: uid,
              email: user.email,
              fullName: user.fullName,
              mobileNumber: user.mobileNumber,
            };
            this.auth2Service.addUser(data);
            this.storage.setString('logged', 'true');
            this.loading = false;
            this.router.navigate(['/mainscreen']);
          });
        } else {
          //todo hay que ir a firebase y encontrar ese usuario con ese uid
          this.auth2Service.findUser(user.uid);
          this.storage.setString('logged', 'true');
          this.loading = false;
          this.router.navigate(['/mainscreen']);
        }
      });
    } else {
      this.loading = false;
      this.router.navigate(['/verify-email']);
    }
  }
}
