import { Component, OnInit } from '@angular/core';
import { SwitchLanguageService } from 'src/app/services/switch-language.service';
import { CookieService } from 'ngx-cookie-service';
import { NavbarComponent } from '../navbar/navbar.component';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private __ms: MainService, private __lang: SwitchLanguageService, private __cookie: CookieService) {
    this.__lang.use('en')
   }

  ngOnInit() {
  }
  switchLanguage(evt){
    let lang = evt.target.value;
    this.__cookie.set('selectedLang', JSON.stringify(lang));
    // this.__lang.use(lang);
    let fc = new NavbarComponent(this.__ms, this.__lang, this.__cookie);
    fc.switchLanguage(lang);
  }

}
