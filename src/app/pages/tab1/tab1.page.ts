import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Article } from 'src/app/interfaces/news';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  @ViewChild( IonInfiniteScroll, {static: true} ) infiniteScroll!: IonInfiniteScroll;

  public articles: Article[] = [];

  constructor(private newService: NewsService) {}


  ngOnInit(): void {
    this.newService.getTopHeadlines()
      .subscribe( (articles) => {
        this.articles.push(...articles)
      });
  }

  loadData(){
    this.newService.getTopHeadlines(true)
      .subscribe(articles => {

        if(articles.length === this.articles.length){
          this.infiniteScroll.disabled = true;
          //event.target.disabled = true;
          return;
        }

        this.articles = articles;
        console.log(this.articles)

        // setTimeout(())
        //event.target.complete();
        this.infiniteScroll.complete();
      })
  }

}
