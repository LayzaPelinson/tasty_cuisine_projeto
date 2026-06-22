package com.tastycuisine.TastyCuisineV2.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tastycuisine.TastyCuisineV2.model.entity.Comentario;
import com.tastycuisine.TastyCuisineV2.model.repository.ComentarioRepository;

@Service
public class ComentarioService {

    @Autowired
    private ComentarioRepository comentarioRepository;

    public List<Comentario> findAll() { return comentarioRepository.findAll(); }

    public Comentario save(Comentario comentario) { return comentarioRepository.save(comentario); }

    public Comentario findById(long codComentarios) {
        return comentarioRepository.findById(codComentarios)
                .orElseThrow(() -> new RuntimeException("Comentário não encontrado com o código " + codComentarios));
    }

    public Comentario update(long codComentarios, Comentario comentario) {
        Comentario existente = findById(codComentarios);
        existente.setUsuario(comentario.getUsuario());
        existente.setReceita(comentario.getReceita());
        existente.setNota(comentario.getNota());
        existente.setTexto(comentario.getTexto());
        return comentarioRepository.save(existente);
    }

    public void delete(long codComentarios) {
        comentarioRepository.delete(findById(codComentarios));
    }
    public List<Comentario> buscarPorReceita(Long codReceita) {
    return comentarioRepository.findByReceitaCodReceitas(codReceita);
}


    public Comentario inativar(long codComentario){
        Comentario cate = findById(codComentario);
        cate.setStatus_comentarios("INATIVO");
        return comentarioRepository.save(cate); 
    }
    public Comentario ativar(long codComentario){
        Comentario cate = findById(codComentario);
        cate.setStatus_comentarios("ATIVO");
        return comentarioRepository.save(cate);
    }
}
