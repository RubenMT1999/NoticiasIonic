import { Component, Input, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import { Article } from 'src/app/interfaces/news';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent   {

  @Input() article!: Article;
  @Input() index!: number;

  constructor(private iab: InAppBrowser,
              private platform: Platform) { }

  openArticle(){

    if(this.platform.is('ios') || this.platform.is('android')){
      const browser = this.iab.create(this.article.url);
      browser.show();
      return;
    }

    window.open(this.article.url, '_blank');
    

  }

  onClick(){

  }

}
