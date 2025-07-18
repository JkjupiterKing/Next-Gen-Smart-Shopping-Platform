package com.NextGenSmartShoppingPlatformApiApplication.api.controller;

import com.NextGenSmartShoppingPlatformApiApplication.api.model.Admin;
import com.NextGenSmartShoppingPlatformApiApplication.api.repo.AdminRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
public class AdminController {

    @Autowired
    private AdminRepo adminRepository;

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<Admin>> getAllUsers() {
        try {
            List<Admin> adminList = adminRepository.findAll();

            if (adminList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(adminList, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getUserById/{id}")
    public ResponseEntity<Admin> getUserById(@PathVariable Long id) {
        Optional<Admin> userData = adminRepository.findById(id);

        return userData.map(admin ->
                        new ResponseEntity<>(admin, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/addUser")
    public ResponseEntity<Admin> addUser(@RequestBody Admin admin) {
        try {
            // Check for existing username or email
            if (adminRepository.findByUsername(admin.getUsername()) != null) {
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
            if (adminRepository.findByEmail(admin.getEmail()) != null) {
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }

            // Encode the password using Base64
            String encodedPassword = Base64.getEncoder().encodeToString(admin.getPassword().getBytes());
            admin.setPassword(encodedPassword);

            Admin savedAdmin = adminRepository.save(admin);
            return new ResponseEntity<>(savedAdmin, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateUserById/{id}")
    public ResponseEntity<Admin> updateUserById(@PathVariable Long id, @RequestBody Admin admin) {
        Optional<Admin> oldUserData = adminRepository.findById(id);

        if (oldUserData.isPresent()) {
            Admin updatedAdmin = oldUserData.get();
            updatedAdmin.setUsername(admin.getUsername());
            updatedAdmin.setEmail(admin.getEmail());
            updatedAdmin.setPassword(Base64.getEncoder().encodeToString(admin.getPassword().getBytes())); // Encode password

            Admin savedAdmin = adminRepository.save(updatedAdmin);
            return new ResponseEntity<>(savedAdmin, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //find user by username
    @GetMapping("/getUserByUsername/{username}")
    public ResponseEntity<Admin> getUserByUsername(@PathVariable String username) {
        Admin admin = adminRepository.findByUsername(username);

        return admin != null ? new ResponseEntity<>(admin, HttpStatus.OK) :
                new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // find user by email
    @GetMapping("/getUserByEmail/{email}")
    public ResponseEntity<Admin> getUserByEmail(@PathVariable String email) {
        Admin admin = adminRepository.findByEmail(email);

        return admin != null ? new ResponseEntity<>(admin, HttpStatus.OK) :
                new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/deleteUserById/{id}")
    public ResponseEntity<HttpStatus> deleteUserById(@PathVariable Long id) {
        try {
            if (adminRepository.existsById(id)) {
                adminRepository.deleteById(id);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody Admin updatedAdmin) {
        // Check if admin exists with the provided username
        Admin admin = adminRepository.findByUsername(updatedAdmin.getUsername());
        if (admin == null) {
            return ResponseEntity.notFound().build();
        }

        // Encode the new password and update the admin
        String encodedPassword = Base64.getEncoder().encodeToString(updatedAdmin.getPassword().getBytes());
        admin.setPassword(encodedPassword);
        adminRepository.save(admin);

        return ResponseEntity.ok().build();
    }
}

