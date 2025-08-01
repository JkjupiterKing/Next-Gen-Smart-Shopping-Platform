package com.NextGenSmartShoppingPlatformApiApplication.api.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_product_interactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProductInteraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long productId;

    @Enumerated(EnumType.STRING)
    private InteractionType type;

    private String category;

    private String title;

    private Double price;

    private LocalDateTime timestamp;

    public enum InteractionType {
        VIEW,
        PURCHASE,
        CART_ADD
    }
}
