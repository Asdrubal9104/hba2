import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../services/storage.service';
import { MailService } from '../../services/mail.service';
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
    private mailService: MailService,
    private storage: StorageService,    
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

  requestCallBack() {
    this.mailService.send({});
  }

  toShowChat(){
    this.router.navigate(['/chat']);
  }

}
