package com.tastycuisine.TastyCuisineV2.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "Receitas")
public class Receita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Cod_receitas")
    private long codReceitas;

    @Column(name = "Nome_receita", length = 250, nullable = false)
    @NotBlank
    private String nomeReceita;

    @Column(name = "Descricao", length = 250, nullable = false)
    @NotBlank
    private String descricao;

    @Column(name = "Modo_preparo", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    @NotBlank
    private String modoPreparo;

    @Column(name = "Ingredientes", columnDefinition = "NVARCHAR(MAX)")
    private String ingredientes;

    @Column(name = "Categoria", length = 100)
    private String categoria;

    @Column(name = "Dificuldade", length = 50)
    private String dificuldade;

    @Column(name = "Tempo", length = 50)
    private String tempo;

    @Column(name = "Dica", columnDefinition = "NVARCHAR(MAX)")
    private String dica;

    @ManyToOne
    @JoinColumn(name = "Cod_chefe", nullable = false)
    private Chefe chefe;

    @Column(name = "Foto_receita")
    private byte[] fotoReceita;
}
