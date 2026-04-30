package com.example.backend;

import com.example.backend.dto.TransferenciaDTO;
import com.example.backend.service.BeneficioService;
import com.example.backend.repository.BeneficioRepository;
import com.example.model.Beneficio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/beneficios")
@CrossOrigin(origins = "*")
@Tag(name = "Benefícios", description = "Gestão de benefícios e transferências")
public class BeneficioController {

    @Autowired
    private BeneficioRepository repository;

    @Autowired
    private BeneficioService beneficioService;

    @Operation(summary = "Lista todos os benefícios")
    @GetMapping
    public List<Beneficio> list() {
        return repository.findAll();
    }

    @Operation(summary = "Busca um benefício por ID")
    @GetMapping("/{id}")
    public ResponseEntity<Beneficio> findById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Cria um novo benefício")
    @PostMapping
    public ResponseEntity<Beneficio> create(@RequestBody Beneficio beneficio) {
        Beneficio salvo = repository.save(beneficio);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @Operation(summary = "Atualiza um benefício existente")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Beneficio beneficio) {
    try {
        return repository.findById(id).map(record -> {
            record.setNome(beneficio.getNome());
            record.setValor(beneficio.getValor());
            return ResponseEntity.ok(repository.save(record));
        }).orElse(ResponseEntity.notFound().build());
    } catch (Exception e) {
        return ResponseEntity.status(500).body(Map.of("errorMessage", e.getMessage()));
    }
    }

    @Operation(summary = "Remove um benefício")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Aqui a Controller não fala direto com o EJB.
     * Ela chama a Service, que faz os logs/auditoria e delega a transação pesada ao EJB.
     */
    @Operation(summary = "Realiza transferência entre benefícios", 
               description = "Operação atômica gerenciada por EJB com Pessimistic Locking.")
    @PostMapping("/transferir")
    public ResponseEntity<?> transferir(@RequestBody TransferenciaDTO request) {
        try {
            beneficioService.processarTransferencia(
                request.getFromId(), 
                request.getToId(), 
                request.getAmount()
            );
            return ResponseEntity.ok(Collections.singletonMap("message", "Transferência realizada com sucesso!"));
        } catch (Exception e) {
            // Retorna o erro de negócio (ex: Saldo Insuficiente) capturado na Service/EJB
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}