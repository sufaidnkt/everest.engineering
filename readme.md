# Delivery Cost & Time Estimation System

## Overview

This project has two solutions:
- **Problem 1**: Calculate delivery costs with discount offers
- **Problem 2**: Optimize deliveries across multiple vehicles with time estimation

## What's Inside

### Problem 1: Delivery Cost Estimation

Calculates the delivery cost using: `Base + (Weight × 10) + (Distance × 5)`

**How to run:**
```bash
node problem-01.js
```

**Input format:**
```
100 3
PKG1 5 5 OFR001
PKG2 15 5 OFR002
PKG3 10 100 OFR003
```

**Output:**
```
PKG_ID    DISCOUNT    TOTAL_COST
PKG1      0           175
PKG2      0           275
PKG3      35          665
```

### Problem 2: Delivery Time Estimation

Optimizes package assignments to vehicles and calculates delivery times.

**How to run:**
```bash
node problem-02.js
```

**Input format:**
```
100 5
PKG1 50 30 OFR001
PKG2 75 125 OFR008
PKG3 175 100 OFR003
PKG4 110 60 OFR002
PKG5 155 95 NA
2 70 200
```

**Output:**
```
PKG_ID    DISCOUNT    TOTAL_COST    DELIVERY_TIME (hrs)
PKG1      -           750          3.98
PKG2      -           1475         1.78
PKG3      -           2350         1.42
PKG4      105         1395         0.85
PKG5      -           2125         4.19
```

## Features

- Cost calculation with multiple discount offers
- Input validation with error handling
- Optimal package-to-vehicle assignment
- Accurate delivery time estimation
- Clean, well-organized code

## Files

- `problem-01.js` - Delivery cost calculator
- `problem-02.js` - Delivery time optimizer
- `README.md` - This file
- `ALGORITHM.txt` - Algorithm explanation
