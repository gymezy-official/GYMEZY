import { test, expect } from '@playwright/test';
import { getMemberToken, getTamperedToken, tamperRoleWithoutResigning } from '../../../../fixtures/authHelper.js';

test.describe('Authentication API - Tampered JWT Signature', () => {
  test('AUT_API_AUTH_002: [P1|Security/RBAC] Tampered JWT signature @P1 @Security', async ({ request }) => {
    const validToken = getMemberToken();
    const tamperedSigToken = getTamperedToken(validToken);

    // 1. Send request with flipped signature character
    const response = await request.get('/api/v1/memberships/my', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tamperedSigToken}`,
      },
    });

    // Expected: 401 Unauthorized
    expect(response.status()).toBe(401);

    const body = await response.json();

    // Assertions from test documentation:
    // • body.message indicates invalid token
    expect(body.message).toMatch(/invalid.*token|token signature/i);

    // • No stack trace in the response
    expect(body.stack).toBeUndefined();

    // 2. Change role claim to SUPER_ADMIN without re-signing and expect 401
    const tamperedRoleToken = tamperRoleWithoutResigning(validToken, 'SUPER_ADMIN');
    const roleTamperResponse = await request.get('/api/v1/memberships/my', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tamperedRoleToken}`,
      },
    });

    expect(roleTamperResponse.status()).toBe(401);
    const roleTamperBody = await roleTamperResponse.json();
    expect(roleTamperBody.message).toMatch(/invalid.*token|token signature/i);
    expect(roleTamperBody.stack).toBeUndefined();
  });
});

