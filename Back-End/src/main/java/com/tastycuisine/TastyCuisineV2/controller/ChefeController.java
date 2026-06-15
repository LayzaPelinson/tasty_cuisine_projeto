package com.tastycuisine.TastyCuisineV2.controller;

import com.tastycuisine.TastyCuisineV2.model.entity.Chefe;
import com.tastycuisine.TastyCuisineV2.model.service.ChefeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chefe")
public class ChefeController {

    @Autowired
    private ChefeService chefeService;

    @GetMapping("/findAll")
    public ResponseEntity<List<Chefe>> findAll() {
        return ResponseEntity.ok(chefeService.findAll());
    }

    @PostMapping
    public ResponseEntity<Chefe> save(@Valid @RequestBody Chefe chefe) {
        return ResponseEntity.status(HttpStatus.CREATED).body(chefeService.save(chefe));
    }

    @GetMapping("/{codChefe}")
    public ResponseEntity<Object> findById(@PathVariable Long codChefe) {
        try {
            return ResponseEntity.ok(chefeService.findById(codChefe));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("status", 404, "error", "not found", "message", "chefe não encontrado com o id: " + codChefe));
        }
    }

    @PutMapping("/{codChefe}")
    public ResponseEntity<Object> update(@RequestBody Chefe chefe, @PathVariable Long codChefe) {
        try {
            return ResponseEntity.ok(chefeService.update(codChefe, chefe));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("status", 404, "error", "not found", "message", "chefe não encontrado com o id: " + codChefe));
        }
    }

    @PutMapping("/inativar/{codChefe}")
    public ResponseEntity<Object> inativar(@PathVariable Long codChefe) {
        try {
            chefeService.inativar(codChefe);
            return ResponseEntity.ok().body("Chefe com o id " + codChefe + " foi inativado com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("status", 404, "error", "not found", "message", "chefe não encontrado com o id: " + codChefe));
        }
    }
    
    @PutMapping("/ativar/{codChefe}")
    public ResponseEntity<Object> ativar(@PathVariable Long codChefe) {
        try {
            chefeService.ativar(codChefe);
            return ResponseEntity.ok().body("Chefe com o id " + codChefe + " foi ativado com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("status", 404, "error", "not found", "message", "chefe não encontrado com o id: " + codChefe));
        }
    }

    @PostMapping("/reativar")
    public ResponseEntity<Object> reativar(@RequestBody Map<String, String> body) {
        try {
            String gmail = body.get("email");
            String senha = body.get("senha");
            return ResponseEntity.ok(chefeService.reativar(gmail, senha));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of(
                    "status", 401,
                    "error", "unauthorized",
                    "message", "Email ou senha incorretos"
            ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody Map<String, String> body) {
        try {
            String gmail = body.get("email");
            String senha = body.get("senha");
            return ResponseEntity.ok(chefeService.login(gmail, senha));
        } catch (RuntimeException e) {
            if ("CONTA_INATIVA".equals(e.getMessage())) {
                return ResponseEntity.status(403).body(Map.of(
                    "status", 403,
                    "error", "conta_inativa",
                    "message", "Conta inativa"
                ));
            }
            return ResponseEntity.status(401).body(Map.of(
                    "status", 401,
                    "error", "unauthorized",
                    "message", "Email ou senha incorretos"
            ));
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Chefe>> buscar(@RequestParam String termo) {
        return ResponseEntity.ok(chefeService.buscar(termo));
    }

    @GetMapping("/populares")
    public ResponseEntity<List<Chefe>> populares() {
        return ResponseEntity.ok(chefeService.populares());
    }
}
