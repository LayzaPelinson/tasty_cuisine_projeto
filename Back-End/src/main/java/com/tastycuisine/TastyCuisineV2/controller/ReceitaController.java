package com.tastycuisine.TastyCuisineV2.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.tastycuisine.TastyCuisineV2.model.service.ReceitaService;
import com.tastycuisine.TastyCuisineV2.model.entity.Receita;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/receita")
public class ReceitaController {

    @Autowired
    private ReceitaService receitaService;

    @GetMapping("/findAll")
    public ResponseEntity<List<Receita>> findAll() {
        return ResponseEntity.ok(receitaService.findAll());
    }

    @PostMapping
    public ResponseEntity<Receita> save(@Valid @RequestBody Receita receita) {
        return ResponseEntity.status(HttpStatus.CREATED).body(receitaService.salvar(receita));
    }

    @GetMapping("/{codReceita}")
    public ResponseEntity<Object> findById(@PathVariable String codReceita) {
        try {
            return ResponseEntity.ok(receitaService.findById(Long.parseLong(codReceita)));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("status", 400, "error", "bad request", "message", "o id informado não é válido: " + codReceita));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("status", 404, "error", "not found", "message", "receita não encontrada com o id: " + codReceita));
        }
    }

    @PutMapping("/{codReceita}")
    public ResponseEntity<Object> update(@Valid @RequestBody Receita receita, @PathVariable String codReceita) {
        try {
            return ResponseEntity.ok(receitaService.update(Long.parseLong(codReceita), receita));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("status", 400, "error", "bad request", "message", "o id informado não é válido: " + codReceita));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("status", 404, "error", "not found", "message", "receita não encontrada com o id: " + codReceita));
        }
    }

    @GetMapping("/usuario/{codUsuario}")
    public ResponseEntity<Object> findByUsuario(@PathVariable String codUsuario) {
        try {
            return ResponseEntity.ok(receitaService.findByUsuario(Long.parseLong(codUsuario)));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("status", 400, "error", "bad request", "message", "o id informado não é válido: " + codUsuario));
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Receita>> buscar(@RequestParam String termo) {
        return ResponseEntity.ok(receitaService.buscar(termo));
    }

    @GetMapping("/populares")
    public ResponseEntity<List<Receita>> populares() {
        return ResponseEntity.ok(receitaService.populares());
    }

    @PutMapping("/categoria/adicionar/{codCategoria}/{receita}")
    public ResponseEntity<Object> adicionarCategoria(@PathVariable Receita receita,@PathVariable long codCategoria){
        return ResponseEntity.ok(receitaService.adicionarCategoria(codCategoria, receita.getCodReceitas()));
    }

    @PutMapping("/categoria/remover/{codCategoria}/{receita}")
    public ResponseEntity<Object> removerCategoria(@PathVariable Receita receita,@PathVariable long codCategoria){
        return ResponseEntity.ok(receitaService.removerCategoria(codCategoria, receita.getCodReceitas()));
    }

    @GetMapping("/categoria/{codCategoria}")
    public ResponseEntity<Object> findByCategoria(@PathVariable String codCategoria) {
        try {
            return ResponseEntity.ok(receitaService.findByCategoria(Long.parseLong(codCategoria)));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("status", 400, "error", "bad request", "message", "o id informado não é válido: " + codCategoria));
        }
    }

    @DeleteMapping("/{codReceita}")
    public ResponseEntity<Object> delete(@PathVariable String codReceita) {
        try {
            receitaService.delete(Long.parseLong(codReceita));
            return ResponseEntity.ok().body("Receita com o id " + codReceita + " foi removida com sucesso");
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("status", 400, "error", "bad request", "message", "o id informado não é válido: " + codReceita));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("status", 404, "error", "not found", "message", "receita não encontrada com o id: " + codReceita));
        }
    }

    
    @PutMapping("/{codReceita}/inativar")
    public ResponseEntity<Object> inativar(@PathVariable String codReceita){
        return ResponseEntity.ok(receitaService.inativar(Long.parseLong(codReceita)));
    }
    @PutMapping("/{codReceita}/ativar")
    public ResponseEntity<Object> ativar(@PathVariable String codReceita){
        return ResponseEntity.ok(receitaService.ativar(Long.parseLong(codReceita)));
    }

}
