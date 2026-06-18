package com.tastycuisine.TastyCuisineV2.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tastycuisine.TastyCuisineV2.model.entity.Livro;
import com.tastycuisine.TastyCuisineV2.model.entity.Receita;
import com.tastycuisine.TastyCuisineV2.model.repository.LivroRepository;
import com.tastycuisine.TastyCuisineV2.model.repository.ReceitaRepository;

@Service
public class LivroService {

    @Autowired
    private LivroRepository livroRepository;

    @Autowired
    private ReceitaRepository receitaRepository;

    public List<Livro> findAll() { return livroRepository.findAll(); }

    public List<Livro> findByUsuario(Long codUser) {
        return livroRepository.findByUsuarioCodUser(codUser);
    }

    public Livro save(Livro livro) { 
        if(livro != null){
        return livroRepository.save(livro); 
        }
        else return livro;
    }

    public Livro findById(long codLivro) {
        return livroRepository.findById(codLivro)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado com o código " + codLivro));
    }

    public Livro adicionarReceita(long codLivro, long codReceita) {
        Livro livro = findById(codLivro);
        Receita receita = receitaRepository.findById(codReceita)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada"));
        livro.getReceitas().add(receita);
        return livroRepository.save(livro);
    }

    public Livro removerReceita(long codLivro, long codReceita) {
        Livro livro = findById(codLivro);
        livro.getReceitas().removeIf(r -> r.getCodReceitas() == codReceita);
        return livroRepository.save(livro);
    }
        
    public Livro update(long codLivro, Livro livro) {
        Livro existente = findById(codLivro);
        existente.setNomeLivro(livro.getNomeLivro());
        existente.setFotoLivro(livro.getFotoLivro());
        return livroRepository.save(existente);
    }

    public void delete(long codLivro) {
        Livro livro = findById(codLivro);
        if(livro != null){
        livroRepository.delete(livro);
        }
    }
}