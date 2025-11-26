# Delivery Cost & Time Estimation System

A Node.js application for calculating delivery costs and optimizing package deliveries across multiple vehicles.

## Project Structure

```
src/
├── models/          # Data models for coupon codes and details
│   └── OfferRegistry.js
├── services/        # Service files for calculations and optimizations/ Business logic
│   ├── DeliveryCalculator.js
│   ├── CostEstimationService.js
│   ├── DeliverySchedulingService.js
│   ├── ShipmentOptimizer.js
│   ├── VehicleAllocator.js
│   └── DeliveryTimeCalculator.js
└── utils/          # Utility functions for I/O and formatting
    ├── InputParser.js
    └── OutputFormatter.js
problem-01.js       # Entry point for Delivery Cost Estimation
problem-02.js       # Entry point for Delivery Time Estimation
ALGORITHM.txt       # Algorithm explanations and steps
```

## Quick Start

### Problem 1: Delivery Cost Estimation
Calculate delivery costs with discount offers.

```bash
node problem-01.js
```

**Input Example:**
```
100 3
PKG1 5 5 OFR001
PKG2 15 5 OFR002
PKG3 10 100 OFR003
```

### Problem 2: Delivery Time Estimation
Optimize deliveries across vehicles and calculate estimated delivery times.
```bash
node problem-02.js
```

**Input Example:**
```
100 5
PKG1 50 30 OFR001
PKG2 75 125 OFR008
PKG3 175 100 OFR003
PKG4 110 60 OFR002
PKG5 155 95 NA
2 70 200
```

## Features

✅ Cost calculation with discounts  

✅ Delivery scheduling across vehicles

✅ Calculate estimated delivery times

✅ Input validation & error handling  

✅ Clean, modular architecture  

## How It Works

**Cost Formula:** `Base + (Weight × 10) + (Distance × 5)`

**Discount Offers:**
- OFR001: 10% off on weight ≥ 50kg
- OFR002: 7% off on weight ≥ 100kg  
- OFR003: 5% off on weight ≥ 150kg

**Delivery Optimization:**
- Greedy algorithm to maximize packages per shipment
- Minimize vehicle return time
- Round-robin vehicle dispatch

## Technologies

- Node.js
- CommonJS modules

## Running Tests

### Prerequisites
Ensure dependencies are installed:
```bash
npm install
```

### Execute Test Suite
Run all test cases:
```bash
npm test
```

### Test Suite Overview
- **Total Tests:** 24 comprehensive test cases
- **Test Framework:** Jest
- **Coverage:** All services and inputs validated

**Test Files:**
- `tests/InputParser.test.js` - Input validation tests
- `tests/DeliveryCalculator.test.js` - Cost and discount calculations
- `tests/CostEstimationService.test.js` - Problem 1 service tests
- `tests/DeliverySchedulingService.test.js` - Problem 2 service tests
- `tests/ShipmentOptimizer.test.js` - Shipment optimization tests
- `tests/VehicleAllocator.test.js` - Vehicle dispatch tests
- `tests/DeliveryTimeCalculator.test.js` - Time calculation tests

### Example Test Output
```
Test Suites: 7 passed, 7 total
Tests:       24 passed, 24 total
Time:        ~0.25s
```

### Additional Test Commands
```bash
npm run test:watch      # Run tests in watch mode
npm run test:verbose    # Run tests with detailed output
```

## Documentation

- `ALGORITHM.txt` - Step-by-step algorithms



We have an OfferRegistry where all offers are initialized in the constructor. In Problem 1 and Problem 2, you both initialize and use the same OfferRegistry. Now suppose there is a function that removes an offer. If Problem 1 calls this remove function, Problem 2 won’t know that the offer was removed. How would you solve this issue?