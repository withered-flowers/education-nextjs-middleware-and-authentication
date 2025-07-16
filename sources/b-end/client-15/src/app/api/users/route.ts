import { createUser, getUsers } from "@/db/models/user";
import { type NextRequest, NextResponse } from "next/server";
import * as z from "zod";

// Type definitions untuk Response yang akan dikembalikan
// Asumsi dari data yang dikembalikan:
// (Dibuat menjadi umum agar bisa digunakan di berbagai Response)
/*
  statusCode: number; <--- harus selalu ada statusCode
  message?: string; <--- optional
  data?: T; <--- optoinal dan berupa Generic Type
  error?: string; <--- optional
*/
type MyResponse<T> = {
  statusCode: number;
  message?: string;
  data?: T;
  error?: string;
};

// Membuat schema untuk validasi input dari client
/*
	Harapan dari input client adalah:

	{
		"username": string, required;
		"email": string, required, email;
		"password": string, required, min 6 karakter;
		"super_admin": boolean, optional;
		"original_name": string, optional;
	}
*/
const UserInputSchema = z
  // Awalnya adalah sebuah object
  .object({
    // Key "username" harus ada dan bertipe string
    // Bila tidak ada, maka akan error
    username: z.string(),
    // Key "email" harus ada dan bertipe string dan harus berformat email
    // Bila bukan email, kita akan berikan error message "Email tidak valid"
    email: z.email({
      message: "Email tidak valid",
    }),
    // Key "password" harus ada dan bertipe string dan minimal 6 karakter
    // Bila bukan string, kita akan berikan error message "Password harus berupa string"
    // Bila kurang dari 6 karakter, kita akan berikan error message "Password minimal 6 karakter"
    password: z
      .string({
        message: "Password harus berupa string",
      })
      .min(6, {
        message: "Password minimal 6 karakter",
      }),
    // Key "super_admin" adalah optional dan bertipe boolean
    // Bila bukan boolean, kita akan berikan error message "Super Admin harus berupa boolean"
    super_admin: z
      .boolean({
        message: "Super Admin harus berupa boolean",
      })
      .optional(),
    // Key "original_name" adalah optional dan bertipe string
    // Bila bukan string, kita akan berikan error message "Original Name harus berupa string"
    original_name: z
      .string({
        message: "Original Name harus berupa string",
      })
      .optional(),
  });

// GET /api/users
// ?? Di sini kita akan menggunakan NextRequest
export const GET = async (request: NextRequest) => {
  // Di sini kita akan menggunakan fungsi getUsers() yang sudah kita buat sebelumnya
  const users = await getUsers();

  // ?? Kita akan membaca headers yang ada di dalam request
  console.log("INSIDE GET /api/users");
  console.log("x-user-id", request.headers.get("x-user-id"));
  console.log("x-user-email", request.headers.get("x-user-email"));
  console.log("x-custom-value", request.headers.get("x-custom-value"));

  // Di sini yang akan dikembalikan adalah Response dari Web API
  // (Standard Web API: Request untuk mendapatkan data dan Request untuk mengirimkan data)
  // https://developer.mozilla.org/en-US/docs/Web/API/Request
  // https://developer.mozilla.org/en-US/docs/Web/API/Response
  return Response.json(
    // Data yang akan dikirimkan ke client
    {
      statusCode: 200,
      message: "Pong from GET /api/users !",
      // Di sini kita akan mengirimkan data users
      data: users,
    },
    // Object informasi tambahan (status code, headers, dll)
    {
      // Default status adalah 200
      status: 200,
    }
  );
};

// POST /api/users
// Menambahkan parameter request: Request pada POST
export const POST = async (request: Request) => {
  // Membungkus logic dalam try-catch
  try {
    // Di sini kita akan menggunakan NextResponse yang merupakan extend dari Response
    // Keuntungan dengan menggunakan NextResponse adalah kita bisa menuliskan kembalian dari Response dengan lebih presisi dengan Generic Type dan memiliki beberapa method yang tidak ada di Response.
    // https://nextjs.org/docs/pages/api-reference/functions/next-server#nextresponse
    // Misalnya di sini kita menuliskan bahwa Response yang akan dikembalikan adalah MyResponse yang mana memiliki Generic Type never (tidak ada data yang dikembalikan) untuk key "data"

    /*
    {
      statusCode: number; <--- harus selalu ada statusCode
      message?: string; <--- bisa ada "message" bisa tidak
      data?: never; <--- menjadi tidak ada "data" yang dikembalikan
      error?: string; <--- bisa ada "error" bisa tidak
    }
  */

    // Di sini kita akan mengambil data yang dikirimkan oleh client
    // Asumsi: data yang dikirimkan oleh client adalah JSON
    // Perhatikan bahwa tipe data ini akan selalu menjadi "any"
    const data = await request.json();

    // Sebelum data akan digunakan, kita akan melakukan validasi terlebih dahulu
    // Di sini kita akan menggunakan fungsi safeParse() dari zod
    const parsedData = UserInputSchema.safeParse(data);

    // parsedData akan mengembalikan object dengan tipe data berikut:
    /*
      {
        success: boolean;
        data: unknown;
        error: z.ZodError | null;
      }
    */

    // Sehingga di sini kita akan melakukan pengecekan terlebih dahulu
    if (!parsedData.success) {
      // Kita akan throw error yang merupakan ZodError
      throw parsedData.error;
    }

    // Bila tidak ingin melakukan asumsi, maka kita bisa mengeceknya berdasarkan header "Content-Type"
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
    // const contentType = request.headers.get("Content-Type");
    // if (contentType !== "application/json") { ... }

    // Di sini kita akan menggunakan fungsi createUser() yang sudah kita buat sebelumnya
    // const user = await createUser(data);

    // Di sini kita akan mengirimkan parsedData, bukan data
    const user = await createUser(parsedData.data);

    // Mengubah tipe kembalian menjadi unknown
    return NextResponse.json<MyResponse<unknown>>(
      // Data yang akan dikirimkan ke client
      {
        statusCode: 201,
        message: "Pong from POST /api/users !",
        // Di sini kita akan mengirimkan data user
        data: user,
      },
      // Object informasi tambahan (status code, headers, dll)
      {
        // Karena di sini menggunakan non-default status (bukan 200)
        // maka di sini kita menuliskan status: 201
        status: 201,
      }
    );
  } catch (err) {
    // Perhatikan tipe data dari err adalah unknown dan kita akan menangkap error dari zod yang merupakan ZodError
    // Sehingga di sini kita harus melakukan pengecekan terlebih dahulu
    if (err instanceof z.ZodError) {
      console.log(err);

      // Di sini kita akan mengambil path dan message dari error yang terjadi
      // path = key dari object yang tidak sesuai dengan schema
      // message = pesan error yang terjadi
      const errPath = err.issues[0].path[0];
      const errMessage = err.issues[0].message;

      // Di sini kita akan mengembalikan NextResponse dengan status 400
      // karena client mengirimkan data yang tidak sesuai dengan schema yang kita buat
      return NextResponse.json<MyResponse<never>>(
        // Data yang akan dikirimkan ke client
        {
          statusCode: 400,
          error: `${String(errPath)} - ${errMessage}`,
        },
        {
          status: 400,
        }
      );
    }

    // Di sini kita akan mengembalikan NextResponse dengan status 500
    // karena terjadi error yang tidak terduga
    return NextResponse.json<MyResponse<never>>(
      {
        statusCode: 500,
        message: "Internal Server Error !",
      },
      {
        status: 500,
      }
    );
  }
};
