package com.NextGenSmartShoppingPlatformApiApplication.api.controller;

import com.NextGenSmartShoppingPlatformApiApplication.api.model.Payment;
import com.NextGenSmartShoppingPlatformApiApplication.api.repo.PaymentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@CrossOrigin
public class PaymentController {

    @Autowired
    private PaymentRepo paymentRepository;

    // Create a new payment
    @PostMapping("/process")
    public ResponseEntity<String> processPayment(@RequestBody Payment payment) {
        try {
            paymentRepository.save(payment);
            return ResponseEntity.ok("Payment processed successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Payment processing failed: " + e.getMessage());
        }
    }

    // Read all payments
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        try {
            List<Payment> payments = paymentRepository.findAll();
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // Read a payment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        return paymentRepository.findById(id)
                .map(payment -> ResponseEntity.ok(payment))
                .orElse(ResponseEntity.status(404).body(null));
    }

    // Update a payment
    @PutMapping("/{id}")
    public ResponseEntity<String> updatePayment(@PathVariable Long id, @RequestBody Payment payment) {
        return paymentRepository.findById(id)
                .map(existingPayment -> {
                    payment.setId(existingPayment.getId()); // Ensure ID remains the same
                    paymentRepository.save(payment);
                    return ResponseEntity.ok("Payment updated successfully.");
                })
                .orElse(ResponseEntity.status(404).body("Payment not found."));
    }

    // Delete a payment
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePayment(@PathVariable Long id) {
        return paymentRepository.findById(id)
                .map(payment -> {
                    paymentRepository.delete(payment);
                    return ResponseEntity.ok("Payment deleted successfully.");
                })
                .orElse(ResponseEntity.status(404).body("Payment not found."));
    }
}
