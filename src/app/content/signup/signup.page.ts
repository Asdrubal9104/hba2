import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth2Service } from 'src/app/services/auth2.service';
import { Router } from '@angular/router';
import { UserI } from '../../interfaces/user';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  language: string;
  isSpanish: boolean;
  form: FormGroup;
  submitted: boolean;
  loading: boolean = false;

  constructor(
    private translate: TranslateService,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private auth2Service: Auth2Service,
    private router: Router
  ) {
    this.getLanguage();
    this.submitted = false;
    this.form = this.formBuilder.group(
      {
        fullName: ['', [Validators.required]],
        mobileNumber: [
          '',
          [
            Validators.required,
            Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        repeatPassword: ['', [Validators.required]],
      },
      {
        validator: this.confirmedPasswordValidator(
          'password',
          'repeatPassword'
        ),
      }
    );
  }

  // this function validate that password and repeat password match
  confirmedPasswordValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  get f() {
    return this.form.controls;
  }

  register() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    var values = this.form.value;
    this.onRegister(values.email, values.password, values);
  }

  currentUser: any;
  async onRegister(email: string, password: string, values: any) {
    try {
      const user = await this.auth2Service.register(email, password);
      if (user) {
        const isVerified = this.auth2Service.isEmailVerified(user);
        var data = {
          fullName: values.fullName,
          mobileNumber: values.mobileNumber,
          email: values.email,
        };
        this.saveUser(user.uid, data);
        this.loading = false;
        this.redirectUser(isVerified);
      }
    } catch (error) {
      this.loading = false;
      console.log('Error-->', error);
    }
  }

  saveUser(uid: string, values: any) {
    this.storage.setObject('hbaUid', uid);
    this.storage.setObject('hbaUser', JSON.stringify(values));
  }

  private redirectUser(isVerified: boolean) {
    if (isVerified) {
      this.router.navigate(['mainscreen']);
    } else {
      this.router.navigate(['verify-email']);
    }
  }

  ngOnInit() {}

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

  onSelectChange(selectedValue: any) {
    this.language = selectedValue.detail.value;
    this.translate.setDefaultLang(this.language);
    this.storage.setString('language', this.language);
    this.isSpanish = this.language === 'en' ? false : true;
  }

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  passwordType2: string = 'password';
  passwordIcon2: string = 'eye-off';
  hideShowPassword2() {
    this.passwordType2 = this.passwordType2 === 'text' ? 'password' : 'text';
    this.passwordIcon2 = this.passwordIcon2 === 'eye-off' ? 'eye' : 'eye-off';
  }

  // classLFN: string = 'normal';
  // classLMN: string = 'normal';
  // classLE: string = 'normal';
  // classLP: string = 'normal';
  // classLRP: string = 'normal';

  // customClickFullName() {
  //   this.classLFN = 'normal-clicked-data';
  //   this.updateStyleMovileNumber();
  //   this.updateStyleEmail();
  //   this.updateStylePassword();
  //   this.updateStyleRepeatPassword();
  // }

  // customClickMovileNumber() {
  //   this.classLMN = 'normal-clicked-data';
  //   this.updateStyleFullName();
  //   this.updateStyleEmail();
  //   this.updateStylePassword();
  //   this.updateStyleRepeatPassword();
  // }

  // customClickEmail() {
  //   this.classLE = 'normal-clicked-data';
  //   this.updateStyleFullName();
  //   this.updateStyleMovileNumber();
  //   this.updateStylePassword();
  //   this.updateStyleRepeatPassword();
  // }

  // customClickPassword() {
  //   this.classLP = 'normal-clicked-data';
  //   this.updateStyleFullName();
  //   this.updateStyleMovileNumber();
  //   this.updateStyleEmail();
  //   this.updateStyleRepeatPassword();
  // }

  // customClickRepeatPassword() {
  //   this.classLRP = 'normal-clicked-data';
  //   this.updateStyleFullName();
  //   this.updateStyleMovileNumber();
  //   this.updateStyleEmail();
  //   this.updateStylePassword();
  // }

  // updateStyleFullName() {
  //   if (this.form.controls['fullName'].value === "") {
  //     this.classLFN = 'normal';
  //   } else {
  //     this.classLFN = 'normal-clicked-no-data';
  //   }
  // }

  // updateStyleEmail() {
  //   if (this.form.controls['email'].value === "") {
  //     this.classLE = 'normal';
  //   } else {
  //     this.classLE = 'normal-clicked-no-data';
  //   }
  // }

  // updateStyleMovileNumber() {
  //   if (this.form.controls['mobileNumber'].value === "") {
  //     this.classLMN = 'normal';
  //   } else {
  //     this.classLMN = 'normal-clicked-no-data';
  //   }
  // }

  // updateStylePassword() {
  //   if (this.form.controls['password'].value === "") {
  //     this.classLP = 'normal';
  //   } else {
  //     this.classLP = 'normal-clicked-no-data';
  //   }
  // }

  // updateStyleRepeatPassword() {
  //   if (this.form.controls['repeatPassword'].value === "") {
  //     this.classLRP = 'normal';
  //   } else {
  //     this.classLRP = 'normal-clicked-no-data';
  //   }
  // }
}
