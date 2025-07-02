package com.NextGenSmartShoppingPlatformApiApplication.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.sql.SQLOutput;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class OTPService {

    @Autowired
    private JavaMailSender emailSender;

    // Temporary storage for OTPs (could use Redis or database in real-world apps)
    private static final Map<String, String> otpCache = new HashMap<>();
    private static final Map<String, Long> otpExpiry = new HashMap<>();

    // OTP Generation Logic
    public String generateOTP() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000); // 6-digit OTP
        return String.valueOf(otp);
    }

    // Send OTP Email
    public void sendOTP(String email) {
        String otp = generateOTP();
        otpCache.put(email, otp);
        System.out.println("generated new otp");
        System.out.println(otpCache);
        otpExpiry.put(email, System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(5)); // OTP expiry time (5 mins)

        // Send email with OTP
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP code is: " + otp);
        emailSender.send(message);
    }

    // OTP Verification Logic
    public boolean verifyOTP(String email, String otpInput) {
        System.out.println("Inside verify service");
        System.out.println(otpCache);
        String storedOtp = otpCache.get(email);
        Long expiryTime = otpExpiry.get(email);

        if (storedOtp == null || expiryTime == null || System.currentTimeMillis() > expiryTime) {
            return false; // OTP expired or doesn't exist
        }

        return storedOtp.equals(otpInput); // Check if the OTP matches
    }
    // Send Order Confirmation Email
    public void sendOrderConfirmationEmail(String email, String orderDetails) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Order Confirmation");
        message.setText("Thank you for your order. Here are your order details:\n" + orderDetails);
        emailSender.send(message);
    }
}

