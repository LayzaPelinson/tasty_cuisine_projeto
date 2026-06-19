package com.tastycuisine.TastyCuisineV2.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tastycuisine.TastyCuisineV2.model.entity.Receita;

@Repository
public interface ReceitaRepository extends JpaRepository<Receita, Long> {
    List<Receita> findByUsuarioCodUser(long codChefe);
    List<Receita> findByNomeReceitaContainingIgnoreCase(String termo);
    List<Receita> findByCategoriaCodCategoria(long codCategoria);
}
