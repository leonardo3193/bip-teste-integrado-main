package com.example.ejb;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import com.example.model.Beneficio;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BeneficioEjbServiceTest {

    @Mock
    private EntityManager em;

    @InjectMocks
    private BeneficioEjbService service;

    private Beneficio contaOrigem;
    private Beneficio contaDestino;

    @BeforeEach
    void setUp() {
        contaOrigem = new Beneficio();
        contaOrigem.setId(1L);
        contaOrigem.setValor(new BigDecimal("100.00"));

        contaDestino = new Beneficio();
        contaDestino.setId(2L);
        contaDestino.setValor(new BigDecimal("50.00"));
    }

    @Test
    void deveRealizarTransferenciaComSucesso() {
        // Mockando o comportamento do EntityManager
        when(em.find(Beneficio.class, 1L, LockModeType.PESSIMISTIC_WRITE)).thenReturn(contaOrigem);
        when(em.find(Beneficio.class, 2L, LockModeType.PESSIMISTIC_WRITE)).thenReturn(contaDestino);

        service.transfer(1L, 2L, new BigDecimal("30.00"));

        // Verificações
        assertEquals(new BigDecimal("70.00"), contaOrigem.getValor());
        assertEquals(new BigDecimal("80.00"), contaDestino.getValor());

        // Garante que o lock foi solicitado
        verify(em).find(Beneficio.class, 1L, LockModeType.PESSIMISTIC_WRITE);
    }

    @Test
    void deveLancarExcecaoQuandoSaldoForInsuficiente() {
        
        when(em.find(eq(Beneficio.class), eq(1L), any(LockModeType.class))).thenReturn(contaOrigem);
        when(em.find(eq(Beneficio.class), eq(2L), any(LockModeType.class))).thenReturn(contaDestino);
        BigDecimal valorMaiorQueSaldo = new BigDecimal("150.00");

        assertThrows(IllegalStateException.class, () -> {
            service.transfer(1L, 2L, valorMaiorQueSaldo);
        });
    }
}