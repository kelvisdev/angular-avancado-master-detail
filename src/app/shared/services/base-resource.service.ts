import { BaseResourceModel } from '../models/base-resource.model';
import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap  } from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core/testing';

export abstract class BaseResourceService<T extends BaseResourceModel> {

  protected http: HttpClient;

  constructor(
    protected apiPath: string,
    protected injector: Injector,
    protected jsonDataToResourceFn: (jsonData: any) => T)
  {
    this.http = injector.get(HttpClient); // http pega uma instancia pronta
  }

  getAll(): Observable<T[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResources)
    );
  }

  getById(id: number): Observable<T> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource)
    );
  }

  create(resource: T): Observable<T> {
    return this.http.post(this.apiPath, resource).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource)
    );
  }

  updated(resource: T): Observable<T> {
    const url = `${this.apiPath}/${resource.id}`;

    return this.http.put('sadad', resource).pipe(
      catchError(this.handleError),
      map(() => resource)
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  // PROTECTED METHODS

  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];

    jsonData.forEach(e => resources.push(e as T));

    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return jsonData as T;
  }

  protected handleError(error: any): Observable<any> {
    console.log('erro na requisicao', error);

    return throwError(error);
  }

}
