package com.NextGenSmartShoppingPlatformApiApplication.api.model;

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
@Table(name="customerorders")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class CustomerOrders {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
        private int orderId;

        private String customerName;

        private String productName;

        private String paymentMethod;

        private String email;
        private String address;
       private String city;
        private String state;
}

