package com.example.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

/**
 * DTO (Data Transfer Object) para capturar os dados da requisição 
 * de transferência vindos do Frontend.
 */
@Schema(description = "Modelo para representação de uma transferência financeira")
public class TransferenciaDTO {
    
    @Schema(description = "ID da conta de origem", example = "101", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long fromId;

    @Schema(description = "ID da conta de destino", example = "202", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long toId;

    @Schema(description = "Valor a ser transferido", example = "1500.50", requiredMode = Schema.RequiredMode.REQUIRED)
    private BigDecimal amount;

    // Construtor padrão necessário para o Jackson (JSON)
    public TransferenciaDTO() {
    }

    public Long getFromId() { return fromId; }
    public void setFromId(Long fromId) { this.fromId = fromId; }

    public Long getToId() { return toId; }
    public void setToId(Long toId) { this.toId = toId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}