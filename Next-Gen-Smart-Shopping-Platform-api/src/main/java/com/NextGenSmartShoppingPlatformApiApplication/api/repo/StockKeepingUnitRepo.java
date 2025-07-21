package com.NextGenSmartShoppingPlatformApiApplication.api.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.NextGenSmartShoppingPlatformApiApplication.api.model.StockKeepingUnit;
@Repository
public interface StockKeepingUnitRepo extends JpaRepository<StockKeepingUnit, Long> {

}