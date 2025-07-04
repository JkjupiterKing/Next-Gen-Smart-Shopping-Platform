package com.NextGenSmartShoppingPlatformApiApplication.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.NextGenSmartShoppingPlatformApiApplication.api.model.CustomerOrders;
import com.NextGenSmartShoppingPlatformApiApplication.api.repo.CustomerOrdersRepo;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
public class CustomerOrdersController {

    @Autowired
    private CustomerOrdersRepo customerOrdersRepo;

    @GetMapping("/getAllCustomerOrders")
    public ResponseEntity<List<CustomerOrders>> getAllCustomerOrders() {
        try {
            List<CustomerOrders> customerOrdersList = customerOrdersRepo.findAll();

            if (customerOrdersList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(customerOrdersList, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getCustomerOrderById/{id}")
    public ResponseEntity<CustomerOrders> getCustomerOrderById(@PathVariable int id) {
        Optional<CustomerOrders> customerOrderData = customerOrdersRepo.findById(id);

        return customerOrderData.map(customerOrder ->
                        new ResponseEntity<>(customerOrder, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/addCustomerOrder")
    public ResponseEntity<CustomerOrders> addCustomerOrder(@RequestBody CustomerOrders customerOrder) {
        try {
            CustomerOrders savedCustomerOrder = customerOrdersRepo.save(customerOrder);
            return new ResponseEntity<>(savedCustomerOrder, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateCustomerOrderById/{id}")
    public ResponseEntity<CustomerOrders> updateCustomerOrderById(@PathVariable Integer id, @RequestBody CustomerOrders customerOrder) {
        Optional<CustomerOrders> oldCustomerOrderData = customerOrdersRepo.findById(id);

        if (oldCustomerOrderData.isPresent()) {
            CustomerOrders updatedCustomerOrder = oldCustomerOrderData.get();
            updatedCustomerOrder.setCustomerName(customerOrder.getCustomerName());
            updatedCustomerOrder.setProductName(customerOrder.getProductName());
            updatedCustomerOrder.setPaymentMethod(customerOrder.getPaymentMethod());
            updatedCustomerOrder.setEmail(customerOrder.getEmail());
            updatedCustomerOrder.setAddress(customerOrder.getAddress());
            updatedCustomerOrder.setCity(customerOrder.getCity());
            updatedCustomerOrder.setState(customerOrder.getState());

            CustomerOrders savedCustomerOrder = customerOrdersRepo.save(updatedCustomerOrder);
            return new ResponseEntity<>(savedCustomerOrder, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/deleteCustomerOrderById/{id}")
    public ResponseEntity<HttpStatus> deleteCustomerOrderById(@PathVariable Integer id) {
        try {
            customerOrdersRepo.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    
    @GetMapping("/getCustomerOrderByCustomerName/{customerName}")
    public ResponseEntity<List<CustomerOrders>> getCustomerOrderByCustomerName(@PathVariable String customerName) {
        try{
            List<CustomerOrders> customerOrderData = customerOrdersRepo.findByCustomerName(customerName);

        if (customerOrderData.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(customerOrderData, HttpStatus.OK);
    } catch (Exception ex) {
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
}
