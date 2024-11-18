import jwt, { type JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "this-is-not-a-safe-key";

// Di sini kita menerima payload berupa object (JwtPayload) yang berisi data yang akan disimpan di dalam token.
export const createToken = (payload: JwtPayload) =>
	jwt.sign(payload, SECRET_KEY);

// Di sini kita menerima token berupa string yang berisi token yang akan dibaca.
export const readPayload = (token: string) => jwt.verify(token, SECRET_KEY);
