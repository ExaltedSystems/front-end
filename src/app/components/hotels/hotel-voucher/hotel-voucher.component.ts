import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { CookieService } from 'ngx-cookie-service';
// import * as jspdf from 'jspdf';
// import html2canvas from 'html2canvas';

@Component({
  selector: 'app-hotel-voucher',
  templateUrl: './hotel-voucher.component.html',
  styleUrls: ['./hotel-voucher.component.css']
})
export class HotelVoucherComponent implements OnInit {
  bookingDetails: object;
  bookingId: any;  
  isLoading: boolean = true;
  constructor(private __ms: MainService, private __cookie: CookieService) {
    window.scroll(0, 300);
  }

  ngOnInit() {
    // this.__cookie.set('bookingId', JSON.stringify('17'));
    this.getHotelBookingDetails();
  }
  getHotelBookingDetails = () => {
    // console.log('Cookies:', this.__cookie.getAll())
    let bookingId = JSON.parse(this.__cookie.get('bookingId'));
    // let bookingId = 1;
    this.__ms.postData(this.__ms.backEndUrl+"HotelQuery/hotelBookingDetails", {bookingId}).subscribe(res => {
      this.bookingDetails = res;
      this.bookingId = res['ID'];
      this.isLoading = false;
    });
  }
  cancelBooking(){
    let c = confirm('Are You sure, to Cancel your reservation');
    if(c) {
      let bookingId = this.bookingId;
      this.__ms.postData(this.__ms.backEndUrl+"HotelQuery/cancelHotelReservation", {bookingId}).subscribe(res => {
        window.scroll(0, 0);
        this.bookingDetails = res;
      });
    }
  }
  // captureScreen(divId) {
  //   var data = document.getElementById(divId);
  //   let timeStamp = new Date().getTime();
  //   let pdfName = "RT-Hotel-Voucher_"+timeStamp;
  //   html2canvas(data).then(canvas => {
  //     // Few necessary setting options
  //     var imgWidth = 208;
  //     var pageHeight = 295;
  //     var imgHeight = canvas.height * imgWidth / canvas.width;
  //     var heightLeft = imgHeight;
  //     const contentDataURL = canvas.toDataURL('image/png');
  //     let pdf = new jspdf('p', 'mm', 'legal'); // A4 size page of PDF
  //     var position = 0;
  //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
  //     pdf.save(pdfName+'.pdf'); // Generated PDF
  //   });  
  // } 
  printVoucher(divId){    
    let printContents, popupWin;
    printContents = document.getElementById(divId).innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Hotel Reservation - Rehman Travels</title>
          <style>.table-bordered {border: 1px solid #dee2e6;}
          .table-bordered td, .table-bordered th {border: 1px solid #dee2e6;}
          .table td, .table th {padding: .75rem;vertical-align: top;border-top: 1px solid #dee2e6;}
          .no-print{display:none;}
          @media print {
            .no-print{display:none;}
          }
          </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();

  }
}
