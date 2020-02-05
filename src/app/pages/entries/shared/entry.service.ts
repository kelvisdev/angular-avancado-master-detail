import { CategoryService } from './../../categories/shared/category.service';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap  } from 'rxjs/operators';
import { BaseResourceService } from '../../../shared/services/base-resource.service';

import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root'
})

export class EntryService extends BaseResourceService<Entry> {
  constructor(protected injector: Injector, private categoryService: CategoryService) {
    super('api/entries', injector, Entry.fromJson);
  }


  create(entry: Entry): Observable<Entry> {
    // entry.categoryId // 1 => moradia
    // entry.category // null

    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return super.create(entry);
      })
    );
  }

  updated(entry: Entry): Observable<Entry> {

    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return super.updated(entry);
      })
    );
  }

  protected jsonDataToResources(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];

    jsonData.forEach(e => {
      const entry = Entry.fromJson(e);
      entries.push(entry);
    });

    return entries;
  }

  protected jsonDataToResource(jsonData: any): Entry {
    return Entry.fromJson(jsonData);
  }

}
