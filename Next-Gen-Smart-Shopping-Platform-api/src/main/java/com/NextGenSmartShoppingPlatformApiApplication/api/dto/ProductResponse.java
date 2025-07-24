package com.NextGenSmartShoppingPlatformApiApplication.api.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String title;
    private double price;
    private String description;
    private String category;
    private String rating;
    private String image; // Base64-encoded image
}
