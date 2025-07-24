package com.NextGenSmartShoppingPlatformApiApplication.api.controller;

import com.NextGenSmartShoppingPlatformApiApplication.api.model.Product;
import com.NextGenSmartShoppingPlatformApiApplication.api.repo.ProductRepo;
import com.NextGenSmartShoppingPlatformApiApplication.api.dto.ProductResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
@CrossOrigin
public class ProductController {

    @Autowired
    private ProductRepo productRepository;

    // Utility to convert Product to ProductResponse
    private ProductResponse convertToDto(Product product) {
        String base64Image = product.getImage() != null
                ? Base64.getEncoder().encodeToString(product.getImage())
                : null;

        return new ProductResponse(
                product.getId(),
                product.getTitle(),
                product.getPrice(),
                product.getDescription(),
                product.getCategory(),
                product.getRating(),
                base64Image
        );
    }

    // Get all products
    @GetMapping("/all")
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    // Get a product by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(value -> ResponseEntity.ok(convertToDto(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new product
    @PostMapping("/addProduct")
    public ResponseEntity<ProductResponse> createProduct(
            @RequestPart("product") Product product,
            @RequestPart("image") MultipartFile imageFile) {
        try {
            product.setImage(imageFile.getBytes());
            Product savedProduct = productRepository.save(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedProduct));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update a product
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @RequestPart("product") Product product,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        Optional<Product> existing = productRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            product.setId(id);
            if (imageFile != null) {
                product.setImage(imageFile.getBytes());
            } else {
                product.setImage(existing.get().getImage());
            }

            Product updatedProduct = productRepository.save(product);
            return ResponseEntity.ok(convertToDto(updatedProduct));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete a product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
