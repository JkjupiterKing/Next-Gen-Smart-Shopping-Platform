package com.NextGenSmartShoppingPlatformApiApplication.api.repo;

import com.NextGenSmartShoppingPlatformApiApplication.api.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {

    List<Product> findByCategoryIgnoreCase(String category);
}
