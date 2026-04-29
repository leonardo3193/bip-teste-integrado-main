package com.example.ejb;

import jakarta.ejb.Stateless;
import jakarta.ejb.TransactionAttribute;
import jakarta.ejb.TransactionAttributeType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;
import java.math.BigDecimal;

import com.example.model.Beneficio;
import jakarta.persistence.EntityNotFoundException; 
@Stateless
public class BeneficioEjbService {

    @PersistenceContext
    private EntityManager em;

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O valor da transferência deve ser positivo.");
        }

        //Para resolver isso de forma profissional em um ambiente Java EE/Jakarta EE, vamos aplicar Pessimistic 
        // Locking (bloqueio no banco de dados) e validações de regra de negócio.
        Beneficio from = em.find(Beneficio.class, fromId, LockModeType.PESSIMISTIC_WRITE);
        Beneficio to   = em.find(Beneficio.class, toId, LockModeType.PESSIMISTIC_WRITE);

        if (from == null || to == null) {
            throw new EntityNotFoundException("Uma ou ambas as contas não foram encontradas.");
        }

        if (from.getValor().compareTo(amount) < 0) {
            throw new IllegalStateException("Saldo insuficiente para realizar a transferência.");
        }

        from.setValor(from.getValor().subtract(amount));
        to.setValor(to.getValor().add(amount));

        em.merge(from);
        em.merge(to);
    }
}