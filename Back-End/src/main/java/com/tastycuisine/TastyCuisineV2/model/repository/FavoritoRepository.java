package com.tastycuisine.TastyCuisineV2.model.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tastycuisine.TastyCuisineV2.model.entity.Favorito;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {
    List<Favorito> findByUsuarioCodUser(Long codUser);
    Optional<Favorito> findByUsuarioCodUserAndReceitaCodReceitas(long codUser, long codReceitas);
}
