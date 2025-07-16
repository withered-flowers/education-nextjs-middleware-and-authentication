// Karena ini menggunakan server actions, maka harus dideklarasikan bahwa ini hanya berjalan di server saja, maka dari itu, gunakan "use server"
"use server";

import { getUserByEmail } from "@/db/models/user";
import { compareTextWithHash } from "@/utils/hash";
import { createToken } from "@/utils/jwt";

import { redirect } from "next/navigation";

// Di sini kita akan membuat schema inputan login, maka dari itu, sekalian kita validasi dengan zod
import * as z from "zod";

// Di sini kita akan menyimpan data token pada cookies, maka dari itu, kita akan menggunakan cookies dari next/headers
// !! cookies tidak bisa di-import secara otomatis, jadi harus diketik manual yah
import { cookies } from "next/headers";

// Pada action ini kita akan melakukan request ke server untuk login
// Karena kita di sini belum memiliki backend yang bisa di-call, kita akan membuat logicnya di sini (asumsikan di sini se-akan-akan kita sedang berada di server)
export const doLogin = async (formData: FormData) => {
  const loginInputSchema = z.object({
    email: z.email(),
    password: z.string(),
  });

  // Mengambil data dari form
  const email = formData.get("email");
  const password = formData.get("password");

  // Memvalidasi data input dengan zod
  const parsedData = loginInputSchema.safeParse({
    email,
    password,
  });

  if (!parsedData.success) {
    // !! Ingat, jangan di-throw kecuali ingin menghandle error di sisi client via error.tsx !
    const errPath = parsedData.error.issues[0].path[0];
    const errMessage = parsedData.error.issues[0].message;
    const errFinalMessage = `${String(errPath)} - ${errMessage}`;

    // Mengembalikan error via redirect
    return redirect(`http://localhost:3000/login?error=${errFinalMessage}`);
  }

  // Memvalidasi data terhadap database
  const user = await getUserByEmail(parsedData.data.email);

  if (!user || !compareTextWithHash(parsedData.data.password, user.password)) {
    return redirect("http://localhost:3000/login?error=Invalid%20credentials");
  }

  // Membuat Payload dan Token
  const payload = {
    id: user._id,
    email: user.email,
  };

  const token = createToken(payload);

  // Menggunakan cookies storage
  // ? Sejak NextJS v15, cookies harus dynamic (Promise)
  // ? Sehingga harus di await terlebih dahulu
  const cookieStorage = await cookies();
  // Menyimpan token dengan menggunakan cookies
  cookieStorage.set("token", token, {
    // Meng-set cookie agar hanya bisa diakses melalui HTTP(S)
    httpOnly: true,
    // Meng-set cookie agar hanya bisa diakses melalui HTTPS, karena ini hanya untuk development, maka kita akan set false
    secure: false,
    // Meng-set expiration time dari cookies
    expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    // Meng-set cookie agar hanya bisa diakses melalui domain yang sama
    sameSite: "strict",
  });

  // Melakukan redirect ke halaman "/dashboard/jokes"
  return redirect("http://localhost:3000/dashboard/jokes");
};
