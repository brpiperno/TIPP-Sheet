import crypto from "node:crypto";

export function generateJWT(userId) {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const expiresAt = nowInSeconds + 60 * 60 * 24;

  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" }),
  ).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({ userId: userId, iat: nowInSeconds, exp: expiresAt }),
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", process.env.JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");

  const jwt = `${header}.${payload}.${signature}`;
  return jwt;
}

export function verifyJWT(token) {
  try {
    const [headerB64, payloadB64, signature] = token.split(".");

    const expectedSignature = crypto
      .createHmac("sha256", process.env.JWT_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest("base64url");

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString());
    const nowInSeconds = Math.floor(Date.now() / 1000);

    if (payload.exp && nowInSeconds > payload.exp) {
      console.log("Token expired");
      return null;
    }

    return payload;
  } catch (error) {
    console.error(error);
    return null;
  }
}