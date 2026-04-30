package com.example.backend.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import com.example.ejb.BeneficioEjbService;
import java.math.BigDecimal;
import java.util.logging.Logger;

@ApplicationScoped
public class BeneficioService {

    private static final Logger LOGGER = Logger.getLogger(BeneficioService.class.getName());

    @Inject
    private BeneficioEjbService ejbService;

    /**
     * Este método coordena a operação. 
     * A Service é o lugar ideal para logs, auditoria ou chamadas de outros serviços
     * antes ou depois da transação pesada de banco que ocorre no EJB.
     */
    public void processarTransferencia(Long fromId, Long toId, BigDecimal valor) throws Exception {
        
        LOGGER.info("Iniciando processamento de transferência: Origem ID " + fromId + 
                    " para Destino ID " + toId + " no valor de R$ " + valor);

        try {
            // Delega a transação e o lock de banco para o EJB
            ejbService.transfer(fromId, toId, valor);
            
            LOGGER.info("Transferência finalizada com sucesso no EJB.");
            
        } catch (Exception e) {
            LOGGER.severe("Falha na transferência: " + e.getMessage());
            // Lança a exceção para que a Controller capture e retorne o erro correto ao Front
            throw e; 
        }
    }
}