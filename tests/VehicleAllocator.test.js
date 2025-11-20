/**
 * Tests for VehicleAllocator
 */
const VehicleAllocator = require('../src/services/VehicleAllocator');

describe('VehicleAllocator', () => {
  test('should initialize with correct parameters', () => {
    const allocator = new VehicleAllocator(3, 100, 500);

    expect(allocator.numVehicles).toBe(3);
    expect(allocator.maxSpeed).toBe(100);
    expect(allocator.capacity).toBe(500);
  });

  test('should find next available vehicle', () => {
    const allocator = new VehicleAllocator(3, 100, 500);
    const { index, currentTime } = allocator.findNextAvailableVehicle();

    expect(index).toBe(0);
    expect(currentTime).toBe(0);
  });

  test('should dispatch shipment to available vehicle', () => {
    const allocator = new VehicleAllocator(2, 100, 500);
    const shipment = [
      { id: 'P1', weight: 50, distance: 100, deliveryCost: 100, discount: 10, totalCost: 90 }
    ];

    const result = allocator.dispatchShipment(shipment);

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('eta');
  });

  test('should calculate ETA correctly', () => {
    const allocator = new VehicleAllocator(1, 100, 500);
    const shipment = [
      { id: 'P1', weight: 50, distance: 100, deliveryCost: 100, discount: 10, totalCost: 90 }
    ];

    const result = allocator.dispatchShipment(shipment);

    expect(result[0].eta).toBe(1); // 100 distance / 100 speed
  });
});

// Export for test runner
module.exports = {};
