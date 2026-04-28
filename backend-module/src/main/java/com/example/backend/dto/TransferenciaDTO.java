package com.example.backend.dto;

import java.math.BigDecimal;

/**
 * DTO (Data Transfer Object) para capturar os dados da requisição 
 * de transferência vindos do Frontend.
 */
public class TransferenciaDTO {
    
    private Long fromId;
    private Long toId;
    private BigDecimal amount;

    // Construtor padrão necessário para o Jackson (JSON)
    public TransferenciaDTO() {
    }

    // Getters e Setters
    public Long getFromId() {
        return fromId;
    }

    public void setFromId(Long fromId) {
        this.fromId = fromId;
    }

    public Long getToId() {
        return toId;
    }

    public void setToId(Long toId) {
        this.toId = toId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}