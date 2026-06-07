package com.tastycuisine.TastyCuisineV2.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tastycuisine.TastyCuisineV2.model.dto.ReceitaRequest;
import com.tastycuisine.TastyCuisineV2.model.dto.ReceitaResponse;
import com.tastycuisine.TastyCuisineV2.model.entity.Chefe;
import com.tastycuisine.TastyCuisineV2.model.entity.Receita;
import com.tastycuisine.TastyCuisineV2.model.repository.ChefeRepository;
import com.tastycuisine.TastyCuisineV2.model.service.ReceitaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/receita")
public class ReceitaController {

    @Autowired
    private ReceitaService receitaService;

    @Autowired
    private ChefeRepository chefeRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/findAll")
    public ResponseEntity<List<ReceitaResponse>> findAll() {
        List<Receita> receitas = receitaService.findAll();
        List<ReceitaResponse> response = receitas.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Object> save(@Valid @RequestBody ReceitaRequest request) {
        try {
            Receita receita = buildRecipeFromRequest(new Receita(), request);
            Receita saved = receitaService.save(receita);
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().body(Map.of("status", 400, "error", "bad request", "message", "Dados de receita inválidos."));
        }
    }

    @GetMapping("/{codReceita}")
    public ResponseEntity<Object> findById(@PathVariable String codReceita) {
        try {
            Receita receita = receitaService.findById(Long.parseLong(codReceita));
            return ResponseEntity.ok(toResponse(receita));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("status", 400, "error", "bad request", "message", "o id informado não é válido: " + codReceita));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("status", 404, "error", "not found", "message", "receita não encontrada com o id: " + codReceita));
        }
    }

    @PutMapping("/{codReceita}")
    public ResponseEntity<Object> update(@Valid @RequestBody ReceitaRequest request, @PathVariable String codReceita) {
        try {
            Receita existente = receitaService.findById(Long.parseLong(codReceita));
            Receita updatedEntity = buildRecipeFromRequest(existente, request);
            Receita saved = receitaService.save(updatedEntity);
            return ResponseEntity.ok(toResponse(saved));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("status", 400, "error", "bad request", "message", "o id informado não é válido: " + codReceita));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("status", 404, "error", "not found", "message", e.getMessage()));
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().body(Map.of("status", 400, "error", "bad request", "message", "Dados de receita inválidos."));
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

    private Receita buildRecipeFromRequest(Receita receita, ReceitaRequest request) throws JsonProcessingException {
        if (request.getTitle() != null) receita.setNomeReceita(request.getTitle());
        if (request.getDescription() != null) receita.setDescricao(request.getDescription());
        if (request.getCategory() != null) receita.setCategoria(request.getCategory());
        if (request.getDifficulty() != null) receita.setDificuldade(request.getDifficulty());
        if (request.getTime() != null) receita.setTempo(request.getTime());
        if (request.getChefTip() != null) receita.setDica(request.getChefTip());
        if (request.getIngredients() != null) {
            receita.setIngredientes(objectMapper.writeValueAsString(request.getIngredients()));
        }
        if (request.getInstructions() != null) {
            receita.setModoPreparo(objectMapper.writeValueAsString(request.getInstructions()));
        }
        if (request.getChefId() != null) {
            Chefe chefe = chefeRepository.findById(request.getChefId())
                    .orElseThrow(() -> new RuntimeException("Chefe não encontrado com o código " + request.getChefId()));
            receita.setChefe(chefe);
        }
        return receita;
    }

    private ReceitaResponse toResponse(Receita receita) {
        return ReceitaResponse.builder()
                .id(receita.getCodReceitas())
                .title(receita.getNomeReceita())
                .description(receita.getDescricao())
                .category(receita.getCategoria())
                .difficulty(receita.getDificuldade())
                .time(receita.getTempo())
                .chefTip(receita.getDica())
                .chefId(receita.getChefe() != null ? receita.getChefe().getCodChefe() : null)
                .chefName(receita.getChefe() != null ? receita.getChefe().getNomeUsuario() : null)
                .ingredients(parseJsonString(receita.getIngredientes()))
                .instructions(parseJsonString(receita.getModoPreparo()))
                .image(null)
                .build();
    }

    private List<String> parseJsonString(String value) {
        if (value == null || value.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(value, objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
        } catch (JsonProcessingException e) {
            return List.of(value.split("\\n"));
        }
    }
}
