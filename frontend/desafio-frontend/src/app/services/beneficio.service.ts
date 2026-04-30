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

  /**
   * Grava um novo registro de benefício no banco de dados.
   * @param beneficio Objeto contendo nome e valor inicial.
   */
  salvar(beneficio: { nome: string, valor: number | null }): Observable<any> {
  return this.http.post(this.API, beneficio);
}

  transferir(fromId: number, toId: number, amount: number): Observable<any> {
    return this.http.post(`${this.API}/transferir`, { fromId, toId, amount });
  }
}