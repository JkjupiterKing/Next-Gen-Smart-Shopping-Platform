package com.NextGenSmartShoppingPlatformApiApplication.api.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private double price;
    private String description;
    private String category;

    @Lob
    @Column(name = "image")
    private byte[] image;

    private String rating;
}
