package com.tastycuisine.TastyCuisineV2.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReceitaResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String difficulty;
    private String time;
    private String chefTip;
    private Long chefId;
    private String chefName;
    private List<String> ingredients;
    private List<String> instructions;
    private String image;
}
