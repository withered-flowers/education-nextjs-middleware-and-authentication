import jwt from "jsonwebtoken";

// ?? Di sini kita akan menggunakan jose
import * as jose from "jose";

const SECRET_KEY = process.env.JWT_SECRET || "this-is-not-a-safe-key";

// Di sini kita menerima payload dalam bentuk suatu object
export const createToken = (payload: object) => jwt.sign(payload, SECRET_KEY);

// Di sini kita menerima token berupa string yang berisi token yang akan dibaca.
export const readPayload = (token: string) => jwt.verify(token, SECRET_KEY);

// ?? Di sini kita akan menambahkan fungsi untuk membaca payload dengan jose, karena di sini kita membutuhkan tipe data kembalian, maka kita akan menambahkan generic
export const readPayloadJose = async <T>(token: string) => {
  const secretKey = new TextEncoder().encode(SECRET_KEY);
  const payloadJose = await jose.jwtVerify<T>(token, secretKey);

  return payloadJose.payload;
};
