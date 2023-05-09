import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { configSpreadSheet } from 'assets/config';

@Component({
  selector: 'app-help-texts',
  templateUrl: './help-texts.component.html',
  styleUrls: ['./help-texts.component.css']
})
export class HelpTextsComponent implements OnInit {

  constructor(private http: HttpClient,private sanitizer:DomSanitizer ) { }

  htmlTemplate: any;
  jsonConfigData: any;

  ngOnInit(): void {
    this.http.get(configSpreadSheet.helpTextUrl,{responseType:'text'}).subscribe(res=>{
      this.htmlTemplate = this.sanitizer.bypassSecurityTrustHtml(res);
    })
  }

}
