import { test, expect } from '@playwright/test';
import { getMemberToken, getTrainerToken } from '../../../../fixtures/authHelper.js';

test.describe('Security & RBAC API - Member Blocked From Owner Routes', () => {
  test('AUT_API_SEC_002: [P1|Security/RBAC] authorizeRoles blocks Member from owner routes @P1 @Security', async ({ request }) => {
    // 1. Call GET /api/v1/owner/staff with Member token
    const memberToken = getMemberToken();
    const response = await request.get('/api/v1/owner/staff', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${memberToken}`,
      },
    });

    // Expected: 403 Forbidden
    expect(response.status()).toBe(403);

    const body = await response.json();

    // • body.message indicates forbidden
    expect(body.message).toMatch(/forbidden|access denied|not authorized|insufficient role/i);

    // • No staff data returned
    expect(body.data).toBeUndefined();

    // 2. Trainer token on the same route also returns 403
    const trainerToken = getTrainerToken();
    const trainerResponse = await request.get('/api/v1/owner/staff', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${trainerToken}`,
      },
    });

    expect(trainerResponse.status()).toBe(403);
    const trainerBody = await trainerResponse.json();
    expect(trainerBody.message).toMatch(/forbidden|access denied|not authorized|insufficient role/i);
    expect(trainerBody.data).toBeUndefined();
  });
});

