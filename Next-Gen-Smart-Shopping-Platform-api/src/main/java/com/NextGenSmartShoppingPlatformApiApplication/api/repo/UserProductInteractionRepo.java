package com.NextGenSmartShoppingPlatformApiApplication.api.repo;

import com.NextGenSmartShoppingPlatformApiApplication.api.model.UserProductInteraction;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserProductInteractionRepo extends JpaRepository<UserProductInteraction, Long> {

    List<UserProductInteraction> findByUserId(Long userId);

    @Query("SELECT DISTINCT u.userId FROM UserProductInteraction u WHERE u.productId IN :productIds AND u.userId <> :currentUserId")
    List<Long> findSimilarUsers(List<Long> productIds, Long currentUserId);

    @Query("SELECT u.productId FROM UserProductInteraction u WHERE u.userId IN :userIds AND u.productId NOT IN :excludeProductIds")
    List<Long> findRecommendedProductIds(List<Long> userIds, List<Long> excludeProductIds);
}
