package com.example.ejb;

import jakarta.ejb.Stateless;
import jakarta.ejb.TransactionAttribute;
import jakarta.ejb.TransactionAttributeType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import com.example.model.Beneficio;

@Stateless // Define como um EJB para o container gerenciar o ciclo de vida
public class BeneficioEjbService {

    @PersistenceContext
    private EntityManager em;

    /**
     * REQUIRED garante que o método execute dentro de uma transação.
     * Se ocorrer uma RuntimeException, o container fará Rollback automaticamente.
     */
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O valor da transferência deve ser positivo.");
        }

        // Aplicando Pessimistic Locking para evitar o "Double Spending"
        // O banco trava as linhas até o fim da transação.
        Beneficio from = em.find(Beneficio.class, fromId, LockModeType.PESSIMISTIC_WRITE);
        Beneficio to   = em.find(Beneficio.class, toId, LockModeType.PESSIMISTIC_WRITE);

        // Validação de existência
        if (from == null || to == null) {
            throw new EntityNotFoundException("Uma ou ambas as contas não foram encontradas.");
        }

        // Validação de Regra de Negócio: Saldo Insuficiente
        // Essa é a correção principal do bug citado no critério.
        if (from.getValor().compareTo(amount) < 0) {
            throw new IllegalStateException("Saldo insuficiente (Disponível: " + from.getValor() + ").");
        }

        // Execução da lógica (O Dirty Checking do JPA salvará as alterações no commit)
        from.setValor(from.getValor().subtract(amount));
        to.setValor(to.getValor().add(amount));
    }
}