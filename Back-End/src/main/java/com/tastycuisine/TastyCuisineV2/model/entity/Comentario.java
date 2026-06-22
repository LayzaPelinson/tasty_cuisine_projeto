package com.tastycuisine.TastyCuisineV2.model.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "Comentarios")
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Cod_comentarios")
    private long Cod_comentarios;

    @ManyToOne
    @JoinColumn(name = "Cod_user", nullable = false)
    private Usuario Usuario;
        
    @ManyToOne
    @JoinColumn(name = "Cod_receitas")
    private Receita receita; 
    
    @Column(name = "Nota", nullable = false)
    @NotBlank
    private String Nota;

    @Builder.Default
    @Column(name = "Status_Comentarios",length =  20,nullable = false)
    private String status_comentarios = "ATIVO";

    @Column(name = "Texto", length = 300, nullable = false)
    @NotBlank
    private String Texto;

    @CreationTimestamp
    @Column(name = "Data_Comentario", updatable = false)
    private LocalDateTime Data_Comentario;
}
