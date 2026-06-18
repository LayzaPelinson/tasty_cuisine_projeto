package com.tastycuisine.TastyCuisineV2.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tastycuisine.TastyCuisineV2.model.entity.Receita;
import com.tastycuisine.TastyCuisineV2.model.repository.ReceitaRepository;

@Service
public class ReceitaService {

    @Autowired
    private ReceitaRepository receitaRepository;

    public List<Receita> findAll() {
        return receitaRepository.findAll();
    }

    public Receita save(Receita receita) {
        return receitaRepository.save(receita);
    }

    public Receita findById(long codReceitas) {
        return receitaRepository.findById(codReceitas)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada com o código " + codReceitas));
    }

    public Receita update(long codReceitas, Receita receita) {
        Receita existente = findById(codReceitas);

        existente.setNomeReceita(receita.getNomeReceita());
        existente.setDescricao(receita.getDescricao());
        existente.setModo_preparo(receita.getModo_preparo());
        existente.setIngredientes(receita.getIngredientes());
        existente.setCategoria(receita.getCategoria());
        existente.setUsuario(receita.getUsuario());
        existente.setFotoReceita(receita.getFotoReceita());
        existente.setRestricao(receita.getRestricao());
        return receitaRepository.save(existente);
    }

    public List<Receita> findByUsuario(long codUsuario) {
        return receitaRepository.findByUsuarioCodUser(codUsuario);
    }

    public List<Receita> buscar(String termo) {
        return receitaRepository.findByNomeReceitaContainingIgnoreCase(termo);
    }

    public List<Receita> populares() {
        return receitaRepository.findAll().stream()
                .limit(10)
                .collect(java.util.stream.Collectors.toList());
    }

    public List<Receita> findByCategoria(long codCategoria) {
        return receitaRepository.findAll().stream()
                .filter(r -> r.getCategoria() != null &&
                        r.getCategoria().getCodCategoria() == codCategoria)
                .collect(java.util.stream.Collectors.toList());
    }

    public void delete(long codReceitas) {
        receitaRepository.delete(findById(codReceitas));
    }
}
