import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  fullName: string;
  mobileNumber: string;
  email: string;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private toastService: ToastService
  ) { }

  send(dataForm: any) {
    let language = 'en';
    this.storage.getString('language').then((data: any) => {
      if (data.value) {
        language = data.value;
      }
      if (!dataForm.approved) {
        dataForm = {
          approved: '',
          zipCode: 0, creditScore: 0, monthlyIncome: 0,
          monthlyDebts: 0, zipCode2: 0, creditScore2: 0,
          monthlyIncome2: 0, monthlyDebts2: 0
        }
      }

      this.storage.getObject('hbaUser').then((dataUser: any) => {
        let user = JSON.parse(dataUser);
        let urlLocal = 'http://localhost:3000/api/mail';
        let urlInternet = 'http://3.132.216.154:3000/api/mail';
        return this.http.get(urlInternet, {
          params: {    
            'fullName':user.fullName,
            'mobileNumber': user.mobileNumber,
            'language': language,
            'email': user.email,
            'approved': dataForm.approved,
            'zipCode': dataForm.zipCode,
            'creditScore': dataForm.creditScore,
            'monthlyIncome': dataForm.monthlyIncome,
            'monthlyDebts': dataForm.monthlyDebts,
            'zipCode2': dataForm.zipCode2,
            'creditScore2': dataForm.creditScore2,
            'monthlyIncome2': dataForm.monthlyIncome2,
            'monthlyDebts2': dataForm.monthlyDebts2
          }
        })
          .subscribe(
            res => {
              if (language === 'en') {
                this.toastService.displayToastSuccess('RESPONSE', 'We have received your request, we will contact you soon.', 'Close');
              } else {
                this.toastService.displayToastSuccess('RESPUESTA', 'Hemos recibido tu solicitud, nos pondremos en contacto pronto.', 'Cerrar');
              }
            },
            error => {
              if (language === 'en') {
                this.toastService.displayToastError('RESPONSE', 'Oops, something happened, please  try again later.', 'Close');
              } else {
                this.toastService.displayToastError('RESPUESTA', 'Oops, algo ha ocurrido, inténtelo más tarde.', 'Cerrar');
              }
            }
          )
      });
    })
  }
}
