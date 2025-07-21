package com.NextGenSmartShoppingPlatformApiApplication.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.NextGenSmartShoppingPlatformApiApplication.api.model.StockKeepingUnit;
import com.NextGenSmartShoppingPlatformApiApplication.api.repo.StockKeepingUnitRepo;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
public class StockKeepingUnitController {

    @Autowired
    private StockKeepingUnitRepo stockRepository; // Adjust repository type as per your actual repository

    @GetMapping("/getAllStocks")
    public ResponseEntity<List<StockKeepingUnit>> getAllStock() {
        try {
            List<StockKeepingUnit> stockList = stockRepository.findAll();

            if (stockList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(stockList, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getStockById/{id}")
    public ResponseEntity<StockKeepingUnit> getStockById(@PathVariable Long id) {
        Optional<StockKeepingUnit> stockData = stockRepository.findById(id);

        return stockData.map(stock ->
                        new ResponseEntity<>(stock, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/addStock")
    public ResponseEntity<StockKeepingUnit> addStock(@RequestBody StockKeepingUnit stock) {
        try {
            StockKeepingUnit savedStock = stockRepository.save(stock);
            return new ResponseEntity<>(savedStock, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateStockById/{id}")
    public ResponseEntity<StockKeepingUnit> updateStockById(@PathVariable Long id, @RequestBody StockKeepingUnit stock) {
        Optional<StockKeepingUnit> oldStockData = stockRepository.findById(id);

        if (oldStockData.isPresent()) {
            StockKeepingUnit updatedStock = oldStockData.get();
            updatedStock.setStockName(stock.getStockName());
            updatedStock.setDescription(stock.getDescription());
            updatedStock.setPrice(stock.getPrice());
            updatedStock.setStockQuantity(stock.getStockQuantity());

            StockKeepingUnit savedStock = stockRepository.save(updatedStock);
            return new ResponseEntity<>(savedStock, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/deleteStockById/{id}")
    public ResponseEntity<HttpStatus> deleteStockById(@PathVariable Long id) {
        try {
            stockRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
