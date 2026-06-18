package com.tastycuisine.TastyCuisineV2.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tastycuisine.TastyCuisineV2.model.entity.Livro;

@Repository
public interface LivroRepository extends JpaRepository<Livro, Long> {
    List<Livro> findByUsuarioCodUser(Long codUser);
}