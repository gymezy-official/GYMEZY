import { test, expect } from '@playwright/test';

test.describe('Authentication API - Protected Route Without Token', () => {
  test('AUT_API_AUTH_001: [P1|Security/RBAC] Protected route without a token @P1 @Security', async ({ request }) => {
    // 1. Send request without any Authorization header
    const response = await request.get('/api/v1/memberships/my', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Expected: 401 Unauthorized
    expect(response.status()).toBe(401);

    const body = await response.json();

    // Assertions from test documentation:
    // • body.success=false
    expect(body.success).toBe(false);

    // • body.message='Not authorized, token missing'
    expect(body.message).toBe('Not authorized, token missing');

    // • No data array in the response
    expect(body.data).toBeUndefined();

    // Repeat with an empty 'Bearer ' header; still 401
    const emptyBearerResponse = await request.get('/api/v1/memberships/my', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ',
      },
    });
    expect(emptyBearerResponse.status()).toBe(401);
  });
});

