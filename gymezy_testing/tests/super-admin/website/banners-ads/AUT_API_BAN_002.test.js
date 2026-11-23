import { test, expect } from '@playwright/test';

test.describe('Banners & Ads API - Missing or Invalid Coordinates', () => {
  test('AUT_API_BAN_002: [P2|Negative] Missing or invalid coordinates @P2 @Negative', async ({ request }) => {
    // 1. Call GET /api/v1/banners?lat=abc&lng=78.1198
    const response = await request.get('/api/v1/banners?lat=abc&lng=78.1198');

    // Expected Status: 400 Bad Request
    expect(response.status()).toBe(400);

    const body = await response.json();

    // • body.message indicates invalid coordinates
    expect(body.message).toMatch(/invalid.*coordinate|invalid.*lat|invalid.*location/i);

    // 2. Call with invalid out-of-range latitude: lat=91 returns 400
    const outOfRangeResponse = await request.get('/api/v1/banners?lat=91&lng=78.1198');
    expect(outOfRangeResponse.status()).toBe(400);

    // 3. Without lat and lng the API returns 200 with priority first and no distance field
    const noCoordResponse = await request.get('/api/v1/banners');
    expect(noCoordResponse.status()).toBe(200);
    const noCoordBody = await noCoordResponse.json();
    expect(noCoordBody.success).toBe(true);
    if (noCoordBody.data && noCoordBody.data.length > 0) {
      expect(noCoordBody.data[0].isPriority).toBe(true);
      expect(noCoordBody.data[0].distanceKm).toBeNull();
    }
  });
});

