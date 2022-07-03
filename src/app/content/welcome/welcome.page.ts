import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../services/storage.service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  language: string;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private storage: StorageService,
  ) {
    this.isFirstTimeOnWelcome();
    this.getLanguage();
  }

  // requestCallBack() {
  //   this.mailService.send({});
  // }

  ngOnInit() { }

  isFirstTimeOnWelcome() {
    this.storage.getString('firstimeonwelcome').then((data: any) => {
      if (!data.value) {
        this.storage.setString('firstimeonwelcome', 'true');
      } else {
        this.router.navigate(['/login']);
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
    });
  }

  onSelectChange(selectedValue: any) {
    this.language = selectedValue.detail.value;
    this.translate.setDefaultLang(this.language);
    this.storage.setString('language', this.language);
  }

  showSignup() {
    this.router.navigate(['/register']);
  }

}
