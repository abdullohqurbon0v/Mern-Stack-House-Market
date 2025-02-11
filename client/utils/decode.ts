import { jwtDecode, JwtPayload } from "jwt-decode";

/**
 * @param token The JWT token to decode
 * @returns The decoded payload
 */
export function decodeJwt<T = JwtPayload>(token: string): T {
  try {
    return jwtDecode<T>(token);
  } catch (error) {
    console.error("Invalid JWT token:", error);
    throw new Error("Failed to decode JWT token");
  }
}
