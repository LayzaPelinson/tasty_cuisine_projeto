package com.tastycuisine.TastyCuisineV2.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/findAll")
    public ResponseEntity<List<Chefe>> findAll() {
        return ResponseEntity.ok(chefeService.findAll());
    }

    @PostMapping
    public ResponseEntity<Chefe> save(@RequestBody String rawBody) {
        Chefe chefe = parseChefe(rawBody);
        return ResponseEntity.status(HttpStatus.CREATED).body(chefeService.save(chefe));
    }

    @GetMapping("/{codChefe}")
    public ResponseEntity<Object> findById(@PathVariable String codChefe) {
        try {
            return ResponseEntity.ok(chefeService.findById(Long.parseLong(codChefe)));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("status", 400, "error", "bad request", "message", "o id informado não é válido: " + codChefe));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("status", 404, "error", "not found", "message", "chefe não encontrado com o id: " + codChefe));
        }
    }

    @PutMapping("/{codChefe}")
    public ResponseEntity<Object> update(@RequestBody String rawBody, @PathVariable String codChefe) {
        try {
            Chefe chefe = parseChefe(rawBody);
            return ResponseEntity.ok(chefeService.update(Long.parseLong(codChefe), chefe));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("status", 400, "error", "bad request", "message", "o id informado não é válido: " + codChefe));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("status", 404, "error", "not found", "message", "chefe não encontrado com o id: " + codChefe));
        }
    }

    private Chefe parseChefe(String rawBody) {
        String payload = rawBody == null ? "" : rawBody.trim();
        try {
            return objectMapper.readValue(payload, Chefe.class);
        } catch (JsonProcessingException firstException) {
            if (payload.startsWith("\"{") && payload.endsWith("}\"")) {
                try {
                    String unquoted = objectMapper.readValue(payload, String.class);
                    return objectMapper.readValue(unquoted, Chefe.class);
                } catch (JsonProcessingException ignored) {
                    // fall through to fallback parsing
                }
            }
            if (payload.contains("\\\"") || payload.contains("\\\\")) {
                String cleaned = payload.replace("\\\"", "\"").replace("\\\\", "\\");
                try {
                    return objectMapper.readValue(cleaned, Chefe.class);
                } catch (JsonProcessingException ignored) {
                    // fall through to final failure
                }
            }
            throw new IllegalArgumentException("Corpo JSON inválido para Chefe: " + firstException.getOriginalMessage(), firstException);
        }
    }

    @DeleteMapping("/{codChefe}")
    public ResponseEntity<Object> delete(@PathVariable String codChefe) {
        try {
            chefeService.delete(Long.parseLong(codChefe));
            return ResponseEntity.ok().body("Chefe com o id " + codChefe + " foi removido com sucesso");
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("status", 400, "error", "bad request", "message", "o id informado não é válido: " + codChefe));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("status", 404, "error", "not found", "message", "chefe não encontrado com o id: " + codChefe));
        }
    }
}
