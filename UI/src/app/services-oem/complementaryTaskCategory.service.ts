import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OemService } from './oem.service';
import { ComplementaryTaskCategoryModel } from '../models/complementaryTaskCategory.model';

@Injectable({
  providedIn: 'root'
})
export class ComplementaryTaskCategoryService {

  constructor(private oemService: OemService) {}

  createComplementaryTaskCategory(complementaryTaskCategory: ComplementaryTaskCategoryModel): Observable<ComplementaryTaskCategoryModel> {
    return this.oemService.post<ComplementaryTaskCategoryModel>('/complementary-task-categories', complementaryTaskCategory);
  }

  updateComplementaryTaskCategory(code: string, complementaryTaskCategory: ComplementaryTaskCategoryModel): Observable<ComplementaryTaskCategoryModel> {
    return this.oemService.put<ComplementaryTaskCategoryModel>(`/complementary-task-categories/update/${code}`, complementaryTaskCategory);
  }

  getAllComplementaryTaskCategories(): Observable<ComplementaryTaskCategoryModel[]> {
    return this.oemService.get<ComplementaryTaskCategoryModel[]>('/complementary-task-categories');
  }

  getComplementaryTaskCategoryById(id: string): Observable<ComplementaryTaskCategoryModel> {
    return this.oemService.get<ComplementaryTaskCategoryModel>(`/complementary-task-categories/id/${id}`);
  }

  getComplementaryTaskCategoryByCode(code: string): Observable<ComplementaryTaskCategoryModel> {
    return this.oemService.get<ComplementaryTaskCategoryModel>(`/complementary-task-categories/code/${code}`);
  }

  getComplementaryTaskCategoryByName(name: string): Observable<ComplementaryTaskCategoryModel> {
    return this.oemService.get<ComplementaryTaskCategoryModel>(`/complementary-task-categories/name/${name}`);
  }

  getComplementaryTaskCategoriesByParent(parentCode: string): Observable<ComplementaryTaskCategoryModel[]> {
    return this.oemService.get<ComplementaryTaskCategoryModel[]>(`/complementary-task-categories/parent/${parentCode}`);
  }

  getComplementaryTaskCategoriesWithParent(value: boolean): Observable<ComplementaryTaskCategoryModel[]> {
    return this.oemService.get<ComplementaryTaskCategoryModel[]>(`/complementary-task-categories/hasParent/${value}`);
  }
}
