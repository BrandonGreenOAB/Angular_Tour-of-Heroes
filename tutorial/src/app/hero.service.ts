import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HeroService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}
  getHeroes(): Observable<Hero[]> {
    //message sent after fetching
    this.messageService.add('HeroService: fetched heroes');
    return this.http
      .get<Hero[]>(this.heroesUrl)
      .pipe(catchError(this.handleError<Hero[]>('getHeroes', [])));
  }

  private heroesUrl = 'api/heroes'; // URL to web api

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap((_) => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  //updates the Hero name
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=-${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    )
  }
  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  //* Handle Http operation that failed. * Let the app continue. * @param operation - name of the operation that failed * @param result - optional value to return as the observable result
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      //send the error to remote logging infastructure
      console.error(error); //log to console isntead

      //transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      //let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}
