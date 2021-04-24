import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private readonly getPredictSalaryUrl = environment.apiUrl + environment.predictSalaryUrl;

  constructor(private httpClient: HttpClient) { }

  getPrediction(obj: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.httpClient.post<any[]>(this.getPredictSalaryUrl, obj, { headers: header });
  }
}
