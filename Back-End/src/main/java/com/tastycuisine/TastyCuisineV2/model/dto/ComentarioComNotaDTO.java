package com.tastycuisine.TastyCuisineV2.model.dto;
import com.tastycuisine.TastyCuisineV2.model.entity.Comentario;

import java.time.LocalDateTime;
    
public class ComentarioComNotaDTO {
    private Long codComentarios;
    private String texto;
    private LocalDateTime dataComentario;
    private Object usuario;
    private Integer nota;

    // Construtor que monta o DTO a partir do Comentario + nota
    public ComentarioComNotaDTO(Comentario c, Integer nota) {
        this.codComentarios = c.getCodComentarios();
        this.texto = c.getTexto();
        this.dataComentario = c.getDataComentario();
        this.usuario = c.getUsuario();
        this.nota = nota;
    }

    // Getters
    public Long getCodComentarios() { return codComentarios; }
    public String getTexto() { return texto; }
    public LocalDateTime getDataComentario() { return dataComentario; }
    public Object getUsuario() { return usuario; }
    public Integer getNota() { return nota; }
}