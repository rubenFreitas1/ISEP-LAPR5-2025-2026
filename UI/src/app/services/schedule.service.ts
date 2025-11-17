import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable, throwError } from 'rxjs';
import { ScheduleModel } from '../models/schedule.model';

@Injectable({
   providedIn: 'root'
})
export class ScheduleService {
  constructor(private apiService: ApiService) {}

    getScheduleByTargetDay(targetDay: string, algorithm: string = 'default'): Observable<ScheduleModel> {
      const encoded = encodeURIComponent(targetDay);
      const alg = encodeURIComponent(algorithm || 'default');
      return this.apiService.get<ScheduleModel>(`/Scheduling?targetDay=${encoded}&algorithm=${alg}`);
    }

}
