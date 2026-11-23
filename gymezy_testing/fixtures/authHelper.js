import crypto from 'crypto';

const DEFAULT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_dev_key';

/**
 * Creates a standard base64url encoded string
 */
function base64url(input) {
  return Buffer.from(typeof input === 'string' ? input : JSON.stringify(input))
    .toString('base64url');
}

/**
 * Sign a payload with HMAC SHA256
 */
export function createJwt(payload, secret = DEFAULT_SECRET) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const h = base64url(header);
  const p = base64url(payload);
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${h}.${p}`)
    .digest('base64url');
  return `${h}.${p}.${signature}`;
}

/**
 * Get a valid member/customer JWT token
 */
export function getMemberToken(overrides = {}) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    userId: '6ac383e137fe6d51b1cea450',
    email: 'customer.fitzone@example.com',
    role: 'CUSTOMER',
    fullName: 'Yovel R',
    iat: now,
    exp: now + 3600,
    ...overrides,
  };
  return createJwt(payload);
}

/**
 * Get a trainer JWT token
 */
export function getTrainerToken(overrides = {}) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    userId: '6ac383e137fe6d51b1cea450',
    email: 'trainer@example.com',
    role: 'TRAINER',
    fullName: 'Trainer Test',
    iat: now,
    exp: now + 3600,
    ...overrides,
  };
  return createJwt(payload);
}

/**
 * Get a valid Gym Owner JWT token
 */
export function getGymOwnerToken(overrides = {}) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    userId: '6ac328b7651acef3f407f505',
    email: process.env.OWNER_PORTAL_EMAIL || 'super@gmail.com',
    role: 'GYM_OWNER',
    fullName: 'Thaingasaami',
    gymId: '6ac328b6651acef3f407f504',
    iat: now,
    exp: now + 3600,
    ...overrides,
  };
  return createJwt(payload);
}

/**
 * Get a token with a tampered signature (flips last character)
 */
export function getTamperedToken(token) {
  const parts = token.split('.');
  if (parts.length !== 3) return token + 'tampered';
  const sig = parts[2];
  const lastChar = sig[sig.length - 1];
  const replacement = lastChar === 'A' ? 'B' : 'A';
  parts[2] = sig.substring(0, sig.length - 1) + replacement;
  return parts.join('.');
}

/**
 * Change role claim without re-signing
 */
export function tamperRoleWithoutResigning(token, newRole = 'SUPER_ADMIN') {
  const parts = token.split('.');
  if (parts.length !== 3) return token;
  const decodedPayload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  decodedPayload.role = newRole;
  parts[1] = base64url(decodedPayload);
  return parts.join('.');
}

/**
 * Get an expired JWT token
 */
export function getExpiredToken(secondsAgo = 3600) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    userId: '6ac383e137fe6d51b1cea450',
    email: 'customer.fitzone@example.com',
    role: 'CUSTOMER',
    fullName: 'Yovel R',
    iat: now - secondsAgo - 3600,
    exp: now - secondsAgo,
  };
  return createJwt(payload);
}

/**
 * Get a token that is right at the boundary (1 second before expiry)
 */
export function getExpiringBoundaryToken() {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    userId: '6ac383e137fe6d51b1cea450',
    email: 'customer.fitzone@example.com',
    role: 'CUSTOMER',
    fullName: 'Yovel R',
    iat: now - 3599,
    exp: now + 1,
  };
  return createJwt(payload);
}

