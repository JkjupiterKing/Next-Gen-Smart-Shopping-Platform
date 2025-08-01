package com.NextGenSmartShoppingPlatformApiApplication.api.controller;

import com.NextGenSmartShoppingPlatformApiApplication.api.model.UserProductInteraction;
import com.NextGenSmartShoppingPlatformApiApplication.api.model.UserProductInteraction.InteractionType;
import com.NextGenSmartShoppingPlatformApiApplication.api.repo.UserProductInteractionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/interactions")
@CrossOrigin
public class UserInteractionController {

    @Autowired
    private UserProductInteractionRepo interactionRepo;

    @PostMapping("/add")
    public ResponseEntity<String> logInteraction(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam String type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Double price
    ) {
        InteractionType interactionType;
        try {
            interactionType = InteractionType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid interaction type: " + type);
        }

        UserProductInteraction interaction = new UserProductInteraction();
        interaction.setUserId(userId);
        interaction.setProductId(productId);
        interaction.setType(interactionType);
        interaction.setCategory(category);
        interaction.setTitle(title);
        interaction.setPrice(price);
        interaction.setTimestamp(LocalDateTime.now());

        interactionRepo.save(interaction);
        return ResponseEntity.ok("Interaction saved");
    }
    // Get interactions by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getInteractionsByUserId(@PathVariable Long userId) {
        var interactions = interactionRepo.findByUserId(userId);

        if (interactions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(interactions);
    }
}
