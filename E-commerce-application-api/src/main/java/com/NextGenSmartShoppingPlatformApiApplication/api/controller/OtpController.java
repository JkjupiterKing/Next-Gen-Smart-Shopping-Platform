package com.NextGenSmartShoppingPlatformApiApplication.api.controller;

import com.NextGenSmartShoppingPlatformApiApplication.api.service.OTPService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/otp")
public class OtpController {

    @Autowired
    private OTPService otpService;

    // Endpoint to request OTP
    @PostMapping("/send")
    public String sendOTP(@RequestParam String email) {
        otpService.sendOTP(email);
        return "OTP sent to your email";
    }

    // Endpoint to verify OTP
    @PostMapping("/verify")
    public String verifyOTP(@RequestParam String email, @RequestParam String otp) {
        boolean isVerified = otpService.verifyOTP(email, otp);
        return isVerified ? "OTP verified successfully" : "Invalid or expired OTP";
    }

    @PostMapping("/sendOrderConfirmation")
    public String sendOrderConfirmationEmail(@RequestParam String email, @RequestParam String orderDetails) {
        try {
            // Log the order details received (for debugging)
            System.out.println("Received orderDetails: " + orderDetails);

            // Parse the orderDetails JSON string into a Java object (Map or custom POJO)
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> order = objectMapper.readValue(orderDetails, Map.class);

            // Extract and log the parsed data (for debugging)
            System.out.println("Parsed orderDetails: " + order);

            // Prepare the order details in a clean, readable text format (instead of HTML)
            StringBuilder emailContent = new StringBuilder();
            emailContent.append("Thank you for your order. Below are the details:\n\n");

            // Add the cart items to the email content
            emailContent.append("Items:\n");
            List<Map<String, Object>> cartItems = (List<Map<String, Object>>) order.get("cartItems");
            for (Map<String, Object> item : cartItems) {
                emailContent.append("- " + item.get("title") + " (Quantity: " + item.get("quantity") + ", Price: " + item.get("price") + ")\n");
            }
            emailContent.append("\n");

            // Add the payment method and customer details
            emailContent.append("Payment Method: " + order.get("paymentMethod") + "\n");
            emailContent.append("Full Name: " + order.get("fullName") + "\n");
            emailContent.append("Address: " + order.get("address") + ", " + order.get("city") + ", " + order.get("state") + " " + order.get("zip") + "\n");

            // Send the email with the formatted text (assuming otpService.sendOrderConfirmationEmail is implemented correctly)
            otpService.sendOrderConfirmationEmail(email, emailContent.toString());

            return "Order confirmation email sent successfully!";
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "Error parsing order details.";
        }
    }

}

