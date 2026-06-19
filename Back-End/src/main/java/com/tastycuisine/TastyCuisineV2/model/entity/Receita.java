package com.tastycuisine.TastyCuisineV2.model.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
    private String modo_preparo;

    @Column(name = "Ingredientes", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    @NotBlank
    private String ingredientes;

    @Column(name = "Restricao", nullable = false)
    private int restricao;

    
    @Builder.Default
    @ManyToMany
    @JoinTable(
        name = "Receitas_Categorias",
        joinColumns = @JoinColumn(name = "Cod_receita"),
        inverseJoinColumns = @JoinColumn(name = "Cod_Categoria")
    )
    private List<Categoria> categoria = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "Cod_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "Foto_receita", nullable = true, columnDefinition = "NVARCHAR(MAX)")
    private String fotoReceita;
}
