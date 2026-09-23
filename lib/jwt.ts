"use server";

import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

// 1. Create Token Helper Function


// 2. Verify Token Helper Function
 const verifyToken = (
  token: string,
  secret: string
): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return null;
  }
};


export const jwtUtils ={
    verifyToken
}