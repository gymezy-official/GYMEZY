import { test, expect } from '@playwright/test';
import { getMemberToken, getGymOwnerToken } from '../../../../fixtures/authHelper.js';

test.describe('Security & RBAC API - Member Blocked From Admin Routes', () => {
  test('AUT_API_SEC_001: [P1|Security/RBAC] authorizeRoles blocks Member from admin routes @P1 @Security', async ({ request }) => {
    // 1. Call GET /api/v1/admin/gyms with Member token
    const memberToken = getMemberToken();
    const response = await request.get('/api/v1/admin/gyms', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${memberToken}`,
      },
    });

    // Expected: 403 Forbidden
    expect(response.status()).toBe(403);

    const body = await response.json();

    // • body.message indicates insufficient role / forbidden
    expect(body.message).toMatch(/forbidden|insufficient role|not authorized|access denied/i);

    // • No gym list returned
    expect(body.data).toBeUndefined();

    // 2. Same call with GymOwner token also returns 403
    const gymOwnerToken = getGymOwnerToken();
    const ownerResponse = await request.get('/api/v1/admin/gyms', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${gymOwnerToken}`,
      },
    });

    expect(ownerResponse.status()).toBe(403);
    const ownerBody = await ownerResponse.json();
    expect(ownerBody.message).toMatch(/forbidden|insufficient role|not authorized|access denied/i);
    expect(ownerBody.data).toBeUndefined();
  });
});

