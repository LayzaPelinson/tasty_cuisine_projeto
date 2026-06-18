package com.tastycuisine.TastyCuisineV2.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tastycuisine.TastyCuisineV2.model.entity.Categoria;
import com.tastycuisine.TastyCuisineV2.model.repository.CategoriaRepository;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Categoria> findAll() { return categoriaRepository.findAll(); }

    public Categoria save(Categoria categoria) { return categoriaRepository.save(categoria); }

    public Categoria findById(long codCategoria) {
        return categoriaRepository.findById(codCategoria)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada com o código " + codCategoria));
    }

    public Categoria update(long codCategoria, Categoria categoria) {
        Categoria existente = findById(codCategoria);
        existente.setNomeCategoria(categoria.getNomeCategoria());
        return categoriaRepository.save(existente);
    }

    public void delete(long codCategoria) {
        categoriaRepository.delete(findById(codCategoria));
    }
}
