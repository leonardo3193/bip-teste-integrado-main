import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BeneficioService } from './beneficio.service';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('BeneficioService', () => {
  let service: BeneficioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BeneficioService]
    });

    service = TestBed.inject(BeneficioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve enviar uma requisição POST para transferir valores', () => {

    const fromId = 1;
    const toId = 2;
    const amount = 100.00;

    // Chame o método passando os 3 argumentos conforme a assinatura do seu Service
    service.transferir(fromId, toId, amount).subscribe(response => {
      expect(response).toBeTruthy();
    });

    // Validação do Mock
    const req = httpMock.expectOne('http://localhost:8080/api/v1/beneficios/transferir');
    expect(req.request.method).toBe('POST');
    
    // O body enviado no POST deve conter o objeto que o seu Service monta internamente
    expect(req.request.body).toEqual({ fromId, toId, amount });

    req.flush({ message: 'Sucesso!' });
  });
});