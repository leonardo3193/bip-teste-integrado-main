package com.example.backend;

import com.example.ejb.BeneficioEjbService;
import com.example.backend.dto.TransferenciaDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.ejb.EJB;
import java.util.*;

// Imports do Swagger/OpenAPI 3
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

@RestController
@RequestMapping("/api/v1/beneficios")
@CrossOrigin(origins = "*")
@Tag(name = "Benefícios", description = "Operações relacionadas à gestão de benefícios e transferências")
public class BeneficioController {

    @EJB
    private BeneficioEjbService beneficioService;

    @Operation(summary = "Lista os benefícios disponíveis", description = "Retorna uma lista mockada de tipos de benefícios para o frontend.")
    @GetMapping
    public ResponseEntity<List<String>> list() {
        return ResponseEntity.ok(Arrays.asList("Auxílio Alimentação", "Vale Transporte", "Plano de Saúde"));
    }

    @Operation(summary = "Realiza transferência de valores", 
               description = "Processa a transferência entre contas de benefícios validando saldo e existência das contas via EJB.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Transferência concluída"),
        @ApiResponse(responseCode = "400", description = "Saldo insuficiente ou IDs inválidos", 
                     content = @Content(schema = @Schema(implementation = Map.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor de aplicação")
    })
    @PostMapping("/transferir")
    public ResponseEntity<?> transferir(@RequestBody TransferenciaDTO request) {
        try {
            beneficioService.transfer(request.getFromId(), request.getToId(), request.getAmount());
            return ResponseEntity.ok().body(Collections.singletonMap("message", "Transferência realizada com sucesso!"));
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Collections.singletonMap("error", "Erro interno ao processar transferência"));
        }
    }
}