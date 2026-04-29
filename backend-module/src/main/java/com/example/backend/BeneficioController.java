package com.example.backend;

import com.example.ejb.BeneficioEjbService;
import com.example.backend.dto.TransferenciaDTO;
import com.example.backend.repository.BeneficioRepository; // Importe o repository
import com.example.model.Beneficio; // Importe sua entidade
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/v1/beneficios")
@CrossOrigin(origins = "*")
@Tag(name = "Benefícios", description = "Gestão de benefícios e transferências")
public class BeneficioController {

    @Autowired
    private BeneficioRepository repository;

    @Autowired
    private BeneficioEjbService beneficioService;

    @Operation(summary = "Lista todos os benefícios", description = "Retorna os dados reais do banco de dados.")
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
    public ResponseEntity<Beneficio> update(@PathVariable Long id, @RequestBody Beneficio beneficio) {
        return repository.findById(id).map(record -> {
            record.setNome(beneficio.getNome());
            record.setValor(beneficio.getValor());
            return ResponseEntity.ok(repository.save(record));
        }).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Remove um benefício")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return repository.findById(id).map(record -> {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Realiza transferência entre benefícios via EJB")
    @PostMapping("/transferir")
    public ResponseEntity<?> transferir(@RequestBody TransferenciaDTO request) {
        try {
            beneficioService.transfer(request.getFromId(), request.getToId(), request.getAmount());
            return ResponseEntity.ok(Collections.singletonMap("message", "Sucesso!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}