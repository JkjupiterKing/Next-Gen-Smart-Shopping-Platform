package com.NextGenSmartShoppingPlatformApiApplication.api.repo;

import com.NextGenSmartShoppingPlatformApiApplication.api.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepo extends JpaRepository<Payment, Long> {
}
