import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Article } from 'src/app/interfaces/news';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  //Para buscar un elemento del template html.
  //con static hacemos que esté disponible en el ngOnInit u otro ciclo 
  //de vida. De lo contrario puede estar undefined al principio.
  @ViewChild( IonInfiniteScroll, {static: true} ) infiniteScroll!: IonInfiniteScroll;
  @ViewChild( IonContent ) content!: IonContent;

  public categorias: string[] = [
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology']

    public selectedCategory: string = this.categorias[0];
    public articles: Article[] = [];

  constructor(private newService: NewsService) {}

  ngOnInit(): void {
    this.newService.getTopHeadlinesByCategory(this.selectedCategory)
      .subscribe(articles => {
        console.log('Peticion realizada')
        this.articles = [...articles]
      })
  }

  segmentChanged(event:any){
    this.content.scrollToTop();
    this.selectedCategory = event.detail.value;
    
    this.newService.getTopHeadlinesByCategory(this.selectedCategory)
      .subscribe(articles => {
        this.articles = [...articles]
      })
  }


  loadData(){
    this.newService.getTopHeadlinesByCategory(this.selectedCategory, true)
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
