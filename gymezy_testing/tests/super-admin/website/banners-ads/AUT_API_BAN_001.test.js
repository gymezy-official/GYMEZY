import { test, expect } from '@playwright/test';

test.describe('Banners & Ads API - Public Banner List', () => {
  test('AUT_API_BAN_001: [P1|Functional] Public banner list: priority first then Haversine distance @P1 @Functional', async ({ request }) => {
    // 1. Call GET /api/v1/banners?lat=9.9252&lng=78.1198 without auth
    const response = await request.get('/api/v1/banners?lat=9.9252&lng=78.1198');

    // Expected Status: 200 OK
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    const data = body.data;

    // • data[0].isPriority=true even though it is about 420 km away
    expect(data[0].isPriority).toBe(true);

    // Find where the priority block ends and the normal items begin
    let firstNonPriorityIndex = -1;
    for (let i = 0; i < data.length; i++) {
      if (!data[i].isPriority) {
        firstNonPriorityIndex = i;
        break;
      }
    }

    // Verify distance values for the nearest non-priority banners
    if (firstNonPriorityIndex !== -1) {
      expect(data[firstNonPriorityIndex].distanceKm).toBeGreaterThan(0);
    }

    // • distanceKm is non-decreasing after the priority block
    if (firstNonPriorityIndex !== -1) {
      for (let i = firstNonPriorityIndex; i < data.length - 1; i++) {
        if (data[i].distanceKm !== null && data[i + 1].distanceKm !== null) {
          expect(data[i].distanceKm).toBeLessThanOrEqual(data[i + 1].distanceKm);
        }
      }
    }
  });
});

