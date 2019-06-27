import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-error',
  templateUrl: './payment-error.component.html',
  styleUrls: ['./payment-error.component.css']
})
export class PaymentErrorComponent implements OnInit {

  queryParams;
  refNo;
  referenceNo:string = '';

  constructor(private __actRouter: ActivatedRoute, private __ms: MainService) { }

  ngOnInit() {
    this.queryParams = this.__actRouter.snapshot.queryParams;
    this.refNo = this.queryParams.__token;
    if(this.refNo != ''){
      let pay_errorUrl = 'http://www.cheapfly.pk/rgtapp/index.php/services/Ticket/paymentError';
      let pay_errorObj = Object.assign({_refrenceNo:this.refNo});
      this.__ms.postData(pay_errorUrl, pay_errorObj).subscribe(res => {
        this.referenceNo = res['ref_no'];
      })
    }
  }

}
