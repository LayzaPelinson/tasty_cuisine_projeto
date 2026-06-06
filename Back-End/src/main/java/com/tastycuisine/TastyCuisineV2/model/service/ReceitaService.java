package com.tastycuisine.TastyCuisineV2.model.service;

import com.tastycuisine.TastyCuisineV2.model.entity.Receita;
import com.tastycuisine.TastyCuisineV2.model.repository.ReceitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReceitaService {

    @Autowired
    private ReceitaRepository receitaRepository;

    public List<Receita> findAll() { return receitaRepository.findAll(); }

    public Receita save(Receita receita) { return receitaRepository.save(receita); }

    public Receita findById(long codReceitas) {
        return receitaRepository.findById(codReceitas)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada com o código " + codReceitas));
    }

    public Receita update(long codReceitas, Receita receita) {
        Receita existente = findById(codReceitas);
        existente.setNomeReceita(receita.getNomeReceita());
        existente.setDescricao(receita.getDescricao());
        existente.setManual2(receita.getManual2());
        existente.setChefe(receita.getChefe());
        existente.setFotoReceita(receita.getFotoReceita());
        return receitaRepository.save(existente);
    }

    public void delete(long codReceitas) {
        receitaRepository.delete(findById(codReceitas));
    }
}
