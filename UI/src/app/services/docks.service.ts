import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { DocksModel } from '../models/docks.model';

@Injectable({
  providedIn: 'root'
})
export class DocksService {

  constructor(private apiService: ApiService) {}

  getAllDocks(): Observable<DocksModel[]> {
    return this.apiService.get<DocksModel[]>('/Docks');
  }

  getDocksByName(name: string): Observable<DocksModel[]> {
    return this.apiService.get<DocksModel[]>(`/Docks/ByName/${name}`);
  }

  getDocksByLocation(location: string): Observable<DocksModel[]> {
    return this.apiService.get<DocksModel[]>(`/Docks/ByLocation/${location}`);
  }

  getDocksById(id: number): Observable<DocksModel> {
    return this.apiService.get<DocksModel>(`/Docks/ByID/${id}`);
  }

  getDocksByVesselType(vesselType: string): Observable<DocksModel[]> {
    return this.apiService.get<DocksModel[]>(`/Docks/ByVesselType`);
  }

  createDock(dock: DocksModel): Observable<DocksModel> {
    return this.apiService.post<DocksModel>('/Docks', dock);
  }

  updateDock(id: number, dock: DocksModel): Observable<any> {
    return this.apiService.put<any>(`/Docks/Update/${id}`, dock);
  }
}
