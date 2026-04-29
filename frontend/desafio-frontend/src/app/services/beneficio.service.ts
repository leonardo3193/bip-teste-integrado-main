import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BeneficioService {
  private readonly API = 'http://localhost:8080/api/v1/beneficios';

  constructor(private http: HttpClient) {}

  listAll(): Observable<any[]> {
    return this.http.get<any[]>(this.API);
  }

  transferir(fromId: number, toId: number, amount: number): Observable<any> {
    return this.http.post(`${this.API}/transferir`, { fromId, toId, amount });
  }
}