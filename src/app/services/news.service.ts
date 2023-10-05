import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Article, ArticleByCategoryAndPage, NewsResponse } from '../interfaces/news';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

const apiKey = environment.apiKey;
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class NewsService {


  private articlesByCategoryAndPage: ArticleByCategoryAndPage= {}

  constructor(private http: HttpClient) { }

  private executeQuery<T>( endpoint: string ) {
    return this.http.get<T>(`${ apiUrl }${ endpoint }`, {
      params: {
        apiKey:apiKey,
        country: 'us',
      }
    });
   }


   getTopHeadlines(loadMore: boolean = false):Observable<Article[]>{
 
    if(loadMore){
      console.log('Más cargados');
      return this.getArticlesByCategory('business');
    }

    if(this.articlesByCategoryAndPage['business']){
      return of(this.articlesByCategoryAndPage['business'].articles);
    }

    return this.getArticlesByCategory('business');

    // return this.executeQuery<NewsResponse>(`/top-headlines?category=business`)
    // .pipe(
    //  map(({articles}) => articles)
    //  );
    }
   
  
   // Sólo se cargaran los articulos para cada categoría una vez. Lo almacenamos
   // en el objeto articlesByCategoryAndPage. Cuando vayamos otra vez a la 
   // misma categoría no deberá cargarlo de nuevo ya que lo tendremos en el objeto
    getTopHeadlinesByCategory(category:string, loadMore:boolean = false):Observable<Article[]>{
  
       if(loadMore){
         console.log('Más cargados')
         return this.getArticlesByCategory(category);
       }

      // Si el objeto ya tiene esa categoría significa que ya han sido cargados
      // los articulos previamente, por lo que se los pasamos directamente a partir del objeto
      if(this.articlesByCategoryAndPage[category]){
        return of(this.articlesByCategoryAndPage[category].articles);
      }
  
      return this.getArticlesByCategory(category);
    }


  private getArticlesByCategory(category: string): Observable<Article[]>{

    //Verifica si el objeto existe y si no existe lo creo.
    if( Object.keys(this.articlesByCategoryAndPage).includes(category) ){
      // Ya existe
      // this.articlesByCategoryAndPage[category].page += 0;
    }else{
      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: []
      }
    }

    // Tomo la página, pero la página 0 no existe así que le sumo 1.
    const page = this.articlesByCategoryAndPage[category].page + 1;

    return this.executeQuery<NewsResponse>(`/top-headlines?category=${category}&page=${page}`)
      .pipe(
        map( ({articles}) => {

          //Si para esa categoria y página es 0 devuelvo los artículo que ya tengo.
          if(articles.length === 0){
            return this.articlesByCategoryAndPage[category].articles;
          }

          this.articlesByCategoryAndPage[category] = {
            page: page,
            //Desestructuro los articulos anteriores y les añado los nuevos
            articles: [...this.articlesByCategoryAndPage[category].articles, ...articles]
          }

          return this.articlesByCategoryAndPage[category].articles;
        } )
      );
  }



}
