import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map, tap } from 'rxjs';

import { Country } from '../interfaces/country.interface';
import { CacheStore } from '../interfaces/cash-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiUrl = "https://restcountries.com/v3.1"

  public cacheStore: CacheStore = {
    byCapital: {term: "", countries: []},
    byCountry: {term: "", countries: []},
    byRegion:  {region: "", countries: []},
  }

  constructor(private httpClient: HttpClient){
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage(){
    localStorage.setItem("cacheStore", JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage(){
    if (!localStorage.getItem("cacheStore")) return;
    this.cacheStore = JSON.parse(localStorage.getItem("cacheStore")!);
  }

  public getCountriesRequest(url: string): Observable<Country[]>{
    return this.httpClient.get<Country[]>(url)
    .pipe
      (
        catchError(error => of([])) //of is used to construct a new observable
      );
  }

  public searchCountryByAlphaCode(code: string): Observable<Country | null> {
    const url = `${this.apiUrl}/alpha/${code}`;
    return this.httpClient.get<Country[]>(url)
      .pipe
      (
        map(countries => countries.length > 0 ? countries[0] : null), //return first country if exist, else returns null
        catchError(error => of(null)) //of is used to construct a new observable
      );
  }

  public searchCapital(capital: string): Observable<Country[]>{
    const url = `${this.apiUrl}/capital/${capital}`;
    return this.getCountriesRequest(url)
      .pipe(
        tap(countries => {this.cacheStore.byCapital = {term: capital, countries}} ),
        tap(() => {this.saveToLocalStorage()})
      );
  }

  public searchCountry(country: string): Observable<Country[]>{
    const url = `${this.apiUrl}/name/${country}`;
    return this.getCountriesRequest(url)
    .pipe(
      tap(countries => {this.cacheStore.byCountry = {term: country, countries}} ),
      tap(() => {this.saveToLocalStorage()})
    );
  }

  public searchRegion(region: Region): Observable<Country[]>{
    const url = `${this.apiUrl}/region/${region}`;
    return this.getCountriesRequest(url)
    .pipe(
      tap(countries => {this.cacheStore.byRegion = {region: region, countries}} ),
      tap(() => {this.saveToLocalStorage()})
    );
  }
}
