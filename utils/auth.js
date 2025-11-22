import JWT from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();
const secret = process.env.JWT_SECRET;



// Create JWT tokenrs
export function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };

  const token = JWT.sign(payload, secret);
  return token;
}

// Validate JWT token
export function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}
