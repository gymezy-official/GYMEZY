import { test, expect } from '@playwright/test';
import { getExpiredToken, getExpiringBoundaryToken } from '../../../../fixtures/authHelper.js';

test.describe('Authentication API - Expired JWT', () => {
  test('AUT_API_AUTH_003: [P1|Boundary Value] Expired JWT @P1 @Security', async ({ request }) => {
    // 1. Send request with expired token (exp = now - 3600)
    const expiredToken = getExpiredToken(3600);
    const response = await request.get('/api/v1/memberships/my', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${expiredToken}`,
      },
    });

    // Expected: 401 Unauthorized
    expect(response.status()).toBe(401);

    const body = await response.json();

    // • body.message indicates token expired
    expect(body.message).toMatch(/expired|token expired|session expired/i);

    // 2. Boundary: Token one second before expiry returns 200
    const boundaryToken = getExpiringBoundaryToken();
    const boundaryResponse = await request.get('/api/v1/memberships/my', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${boundaryToken}`,
      },
    });

    expect(boundaryResponse.status()).toBe(200);
  });
});

