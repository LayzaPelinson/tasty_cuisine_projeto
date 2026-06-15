package com.tastycuisine.TastyCuisineV2.model.repository;

import com.tastycuisine.TastyCuisineV2.model.entity.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

    @Repository
    public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
        Optional<Avaliacao> findByReceitaCodReceitasAndUsuarioCodUser(Long Cod_receitas, Long Cod_user);
        Optional<Avaliacao> findByReceitaCodReceitas(Long Cod_receitas);
    }
