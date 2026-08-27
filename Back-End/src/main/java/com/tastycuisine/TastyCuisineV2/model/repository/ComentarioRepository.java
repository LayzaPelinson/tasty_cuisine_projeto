package com.tastycuisine.TastyCuisineV2.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tastycuisine.TastyCuisineV2.model.dto.MediaNotaDTO;
import com.tastycuisine.TastyCuisineV2.model.entity.Comentario;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    List<Comentario> findByReceitaCodReceitas(Long codReceitas);// Busca a média e total de avaliações para UMA receita específica

    @Query("SELECT COALESCE(AVG(c.nota), 0.0) AS mediaNota, " +
       "COUNT(c) AS totalAvaliacoes " +
       "FROM Comentario c " +
       "WHERE c.receita.codReceitas = :codReceita " +
       "AND c.statusComentarios = 'ATIVO'")
MediaNotaDTO buscarMediaPorReceita(@Param("codReceita") Long codReceita);

    // OPCIONAL: Busca a média de TODAS as receitas de uma vez só (ótimo para a tela Home)
    @Query("SELECT c.receita.codReceitas AS codReceita, COALESCE(AVG(c.nota), 0.0) AS mediaNota, COUNT(c) AS totalAvaliacoes " +
           "FROM Comentario c WHERE c.statusComentarios = 'ATIVO' GROUP BY c.receita.codReceitas")
    List<MediaNotaDTO> buscarMediasDeTodasReceitas();
}
