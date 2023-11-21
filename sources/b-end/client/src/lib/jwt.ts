import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "this-is-not-a-safe-key";

// Di sini kita menerima payload dalam bentuk suatu object
export const createToken = (payload: object) => jwt.sign(payload, SECRET_KEY);

// Di sini kita menerima token berupa string yang berisi token yang akan dibaca.
export const readPayload = (token: string) => jwt.verify(token, SECRET_KEY);
