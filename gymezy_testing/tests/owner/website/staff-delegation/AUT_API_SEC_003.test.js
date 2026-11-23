import { test, expect } from '@playwright/test';
import { getGymOwnerToken } from '../../../../fixtures/authHelper.js';

test.describe('Security & RBAC API - Cross-Tenant GymId Injection', () => {
  test('AUT_API_SEC_003: [P1|Security/RBAC] Cross-tenant: owner of Gym A cannot read Gym B staff by injecting gymId @P1 @Security', async ({ request }) => {
    // Owner of Gym A (Super Max Gym - 6ac328b6651acef3f407f504)
    const gymAOwnerToken = getGymOwnerToken({
      gymId: '6ac328b6651acef3f407f504',
    });

    // Foreign gym ID (Gym B - FitZone Luxury Gym - 6ac3818dbf09d1169f70e6cc)
    const gymBId = '6ac3818dbf09d1169f70e6cc';

    // 1. Injected via query parameter
    const response = await request.get(`/api/v1/owner/staff?gymId=${gymBId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${gymAOwnerToken}`,
      },
    });

    // Documentation expects 403 Forbidden
    expect(response.status()).toBe(403);

    const body = await response.json();

    // • No Gym B staff in the response
    if (body.data) {
      const containsGymB = JSON.stringify(body.data).includes(gymBId);
      expect(containsGymB).toBe(false);
    }

    // • body.message indicates not the owner of this gym
    expect(body.message).toMatch(/not the owner|forbidden|access denied|cross-tenant/i);

    // 2. Repeat with gymId in query/body/path: all return 403 or ignore injected id
    const pathResponse = await request.get(`/api/v1/owner/staff/${gymBId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${gymAOwnerToken}`,
      },
    });
    expect([403, 404]).toContain(pathResponse.status());
  });
});

