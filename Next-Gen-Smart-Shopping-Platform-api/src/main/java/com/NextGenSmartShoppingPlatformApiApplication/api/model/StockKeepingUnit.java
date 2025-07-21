package com.NextGenSmartShoppingPlatformApiApplication.api.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="stockkeepingunit")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class StockKeepingUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stockId;

    private String stockName;
    private String description;
    private Double price;
    private Integer stockQuantity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
