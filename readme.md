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

## Documentation

- `ALGORITHM.txt` - Step-by-step algorithms
