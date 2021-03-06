import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { StorageService } from '../../services/storage.service';
@Component({
  selector: 'app-mainscreen',
  templateUrl: './mainscreen.page.html',
  styleUrls: ['./mainscreen.page.scss'],
})
export class MainscreenPage implements OnInit {
  language: string;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private emailComposer: EmailComposer,
    private storage: StorageService
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

  toShowApproved(){
    this.router.navigate(['/get-pre-approved']);
  }

  toShowEstateAgent(){
    this.router.navigate(['/hire-real-state-agent']);
  }

  toShowYourHome(){
    this.router.navigate(['/shop-your-home']);
  }

  toShowHomeInspected(){
    this.router.navigate(['/get-your-home-inspected']);
  }

  toShowNewHome(){
    this.router.navigate(['/close-your-new-home']);
  }

  requestCallBack(){
    const email = {
      to: 'denishm270991@gmail.com',
      cc: 'denishm910927@gmail.com',
      // attachments: [
      //   'file://img/logo.png',
      //   'res://icon.png',
      //   'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
      //   'file://README.pdf'
      // ],
      subject: 'Cordova Email',
      body: 'Hello, this is functione',
      isHtml: true
    };

    // Send a text message using default options
    this.emailComposer.open(email);
  }

  toShowChat(){
    this.router.navigate(['/chat']);
  }

}
