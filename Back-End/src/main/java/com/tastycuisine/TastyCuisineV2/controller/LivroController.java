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
import org.springframework.web.bind.annotation.RestController;

import com.tastycuisine.TastyCuisineV2.model.entity.Livro;
import com.tastycuisine.TastyCuisineV2.model.service.LivroService;

@RestController
@RequestMapping("/livro")
public class LivroController {

    @Autowired
    private LivroService livroService;

    @GetMapping("/findAll")
    public ResponseEntity<List<Livro>> findAll() {
        return ResponseEntity.ok(livroService.findAll());
    }

    @GetMapping("/usuario/{codUser}")
    public ResponseEntity<List<Livro>> findByUsuario(@PathVariable Long codUser) {
        return ResponseEntity.ok(livroService.findByUsuario(codUser));
    }

    @GetMapping("/{codLivro}")
    public ResponseEntity<Object> findById(@PathVariable Long codLivro) {
        try {
            return ResponseEntity.ok(livroService.findById(codLivro));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("status", 404, "error", "not found", "message", "Livro não encontrado"));
        }
    }

    @PostMapping
    public ResponseEntity<Livro> save(@RequestBody Livro livro) {
        return ResponseEntity.status(HttpStatus.CREATED).body(livroService.save(livro));
    }

    @PutMapping("/{codLivro}")
    public ResponseEntity<Object> update(@PathVariable Long codLivro, @RequestBody Livro livro) {
        try {
            return ResponseEntity.ok(livroService.update(codLivro, livro));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("status", 404, "error", "not found", "message", "Livro não encontrado"));
        }
    }

    @PostMapping("/{codLivro}/receita/{codReceita}")
    public ResponseEntity<Object> adicionarReceita(@PathVariable Long codLivro, @PathVariable Long codReceita) {
        try {
            return ResponseEntity.ok(livroService.adicionarReceita(codLivro, codReceita));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("status", 404, "error", "not found", "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{codLivro}/receita/{codReceita}")
    public ResponseEntity<Object> removerReceita(@PathVariable Long codLivro, @PathVariable Long codReceita) {
        try {
            return ResponseEntity.ok(livroService.removerReceita(codLivro, codReceita));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("status", 404, "error", "not found", "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{codLivro}")
    public ResponseEntity<Object> delete(@PathVariable Long codLivro) {
        try {
            livroService.delete(codLivro);
            return ResponseEntity.ok("Livro deletado com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("status", 404, "error", "not found", "message", "Livro não encontrado"));
        }
    }
}