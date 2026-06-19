package com.tastycuisine.TastyCuisineV2.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tastycuisine.TastyCuisineV2.model.entity.Categoria;
import com.tastycuisine.TastyCuisineV2.model.entity.Receita;
import com.tastycuisine.TastyCuisineV2.model.entity.Usuario;
import com.tastycuisine.TastyCuisineV2.model.repository.ReceitaRepository;
import com.tastycuisine.TastyCuisineV2.model.repository.UsuarioRepository;

@Service
public class ReceitaService {

    @Autowired
    private ReceitaRepository receitaRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private CategoriaService categoriaService;

    public List<Receita> findAll() {
        return receitaRepository.findAll();
    }

    @Autowired
private ObjectMapper objectMapper;

public Receita salvar(Receita dto) {

    Receita receita = new Receita();
    try{
    receita.setNomeReceita(dto.getNomeReceita());
    receita.setDescricao(dto.getDescricao());

    receita.setModo_preparo(
        objectMapper.writeValueAsString(dto.getModo_preparo())
    );

    receita.setIngredientes(
        objectMapper.writeValueAsString(dto.getIngredientes())
    );


    receita.setRestricao(dto.getRestricao());
    receita.setFotoReceita(dto.getFotoReceita());

    Usuario usuario = usuarioRepository.findById(dto.getUsuario().getCodUser())
            .orElseThrow();

    receita.setUsuario(usuario);

    return receitaRepository.save(receita); }
        catch (JsonProcessingException e) {
        throw new RuntimeException("Erro ao converter JSON", e);
}} 


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

    public void delete(long codReceitas) {
        receitaRepository.delete(findById(codReceitas));
    }

    public Receita adicionarCategoria(long codCategoria,long codReceita){
        Receita receita = findById(codReceita);
        Categoria categoria = categoriaService.findById(codCategoria);
        receita.getCategoria().add(categoria);
        return receitaRepository.save(receita);
    }

    public List<Receita> findByCategoria(long codCategoria){
        return receitaRepository.findByCategoriaCodCategoria(codCategoria);
    }

    public Receita removerCategoria(long codCategoria, long codReceita) {
        Receita receita = findById(codReceita);
        receita.getCategoria().removeIf(r -> r.getCodCategoria() == codCategoria);
        return receitaRepository.save(receita);
    }
}
