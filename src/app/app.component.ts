import { Component, OnInit } from '@angular/core';
import { SwitchLanguageService } from './services/switch-language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(private __lang: SwitchLanguageService){
    this.__lang.use('en').then(() => {
    });
  }
  ngOnInit(){
    if(window.matchMedia('(max-width: 768px)').matches){
      window.scroll(0, 0);
    } else {
      window.scroll(0, 300);
    }
  }
}
