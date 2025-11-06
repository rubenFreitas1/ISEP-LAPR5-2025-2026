import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { StaffModel } from '../models/staff.model';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  constructor(private apiService: ApiService) {}

  getAllStaff(): Observable<StaffModel[]> {
    return this.apiService.get<StaffModel[]>('/Staff');
  }

  getStaffById(id: number): Observable<StaffModel> {
    return this.apiService.get<StaffModel>(`/Staff/ByID/${id}`);
  }

  getStaffByName(name: string): Observable<StaffModel[]> {
    return this.apiService.get<StaffModel[]>(`/Staff/ByName/${name}`);
  }

  getStaffByQualification(code: string): Observable<StaffModel[]> {
    return this.apiService.get<StaffModel[]>(`/Staff/ByQualification/${code}`);
  }

  createStaff(staff: StaffModel): Observable<StaffModel> {
    return this.apiService.post<StaffModel>('/Staff', staff);
  }

  updateStaff(id: number, staff: StaffModel): Observable<any> {
    return this.apiService.put<any>(`/Staff/Update/${id}`, staff);
  }
}
