import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { VesselRecordModel } from '../models/vessel.model';

@Injectable({
  providedIn: 'root'
})
export class VesselService {

  constructor(private apiService: ApiService) {}

  getAllVesselRecords(): Observable<VesselRecordModel[]> {
    return this.apiService.get<VesselRecordModel[]>('/VesselRecord');
  }

  getVesselRecordByIMONumber(imoNumber: string): Observable<VesselRecordModel> {
    return this.apiService.get<VesselRecordModel>(`/VesselRecord/ByIMONumber/${imoNumber}`);
  }

  getVesselRecordById(id: number): Observable<VesselRecordModel> {
    return this.apiService.get<VesselRecordModel>(`/VesselRecord/ByID/${id}`);
  }

  getVesselRecordByVesselName(name: string): Observable<VesselRecordModel> {
    return this.apiService.get<VesselRecordModel>(`/VesselRecord/ByVesselName/${name}`);
  }

  getVesselRecordByOperator(operator: string): Observable<VesselRecordModel> {
    return this.apiService.get<VesselRecordModel>(`/VesselRecord/ByOperator/${operator}`);
  }

  createVesselRecord(vesselRecord: VesselRecordModel): Observable<VesselRecordModel> {
    return this.apiService.post<VesselRecordModel>('/VesselRecord', vesselRecord);
  }

  updateVesselRecord(imoNumber: string, vesselRecord: VesselRecordModel): Observable<any> {
    return this.apiService.put<any>(`/VesselRecord/Update/${imoNumber}`, vesselRecord);
  }
}
