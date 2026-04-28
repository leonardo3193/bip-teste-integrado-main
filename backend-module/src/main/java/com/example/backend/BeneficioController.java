package com.example.backend;

import com.example.ejb.BeneficioEjbService; // Importe o seu EJB
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.ejb.EJB;
import java.util.*;

@RestController
@RequestMapping("/api/v1/beneficios")
@CrossOrigin(origins = "*") // Libera para o Angular testar localmente
public class BeneficioController {

    @EJB
    private BeneficioEjbService beneficioService;

    @GetMapping
    public ResponseEntity<List<String>> list() {
        // Aqui você chamaria um método do EJB para listar do banco
        return ResponseEntity.ok(Arrays.asList("Auxílio Alimentação", "Vale Transporte", "Plano de Saúde"));
    }

    @PostMapping("/transferir")
       public ResponseEntity<?> transferir(@RequestBody TransferenciaDTO request) { // Ajustado para TransferenciaDTO
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