import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-umrah-readymade-packages',
  templateUrl: './umrah-readymade-packages.component.html',
  styleUrls: ['./umrah-readymade-packages.component.css']
})
export class UmrahReadymadePackagesComponent implements OnInit {
  rmuPackages: object;
  constructor(private __ms: MainService) { }

  ngOnInit() {
    this.getReadymadeUmrahPackages();
  }
  getReadymadeUmrahPackages() {
    this.__ms.getData(this.__ms.backEndUrl+'Umrah/umrahReadymadePkg').subscribe(res => {
      if(res.status) {
        this.rmuPackages = res.data
      }
    });
  }

}
