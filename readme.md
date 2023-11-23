# Education NextJS - Middleware & Authentication

## Table of Content

- [Scope Pembelajaran](#scope-pembelajaran)
- [Disclaimer](#disclaimer)
- [Demo](#demo)
  - [Step 1 - Membuat fungsi yang menggunakan `jsonwebtoken`](#step-1---membuat-fungsi-yang-menggunakan-jsonwebtoken)
  - [Step 2 - Membuat Halaman `/login` dan `/register`](#step-2---membuat-halaman-login-dan-register)
  - [Step 3 - Mengimplementasikan `/register`](#step-3---mengimplementasikan-register)
  - [Step 4 - Mengimplementasikan `/login`](#step-4---mengimplementasikan-login)
  - [Step 5 - Mengimplementasikan Logout pada `DashboardSidebar`](#step-5---mengimplementasikan-logout-pada-dashboardsidebar)
- [References](#references)

## Scope Pembelajaran

- Review Server Actions dan Client Components
- Middleware
- Authentication

## Disclaimer

- Pembelajaran ini menggunakan kode dari pembelajaran sebelumnya.
- Pembelajaran ini menggunakan package untuk membuat jwt dengan nama `jsonwebtoken`, apabila menggunakan Vercel sebagai tempat deployment, maka package ini tidak bisa digunakan, harap menggantinya dengan package `jose`
- Pembelajaran ini merupakan bagian **keempat** dari pembelajaran NextJS, Garis Besar pembelajarannya dapat dilihat di bawah ini:
  - [Part 1 - NextJS - Intro](https://github.com/withered-flowers/education-nextjs-intro)
  - [Part 2 - NextJS - Client Component & Server Actions](https://github.com/withered-flowers/education-nextjs-client-component-server-actions)
  - [Part 3 - NextJS - Route Handler & Input Validation](https://github.com/withered-flowers/education-nextjs-route-handler-and-input-validation)
  - [Part 4 - NextJS - Middleware & Authentication](https://github.com/withered-flowers/education-nextjs-middleware-and-authentication)

## Demo

Pada demo ini kita akan mencoba untuk:

- Mengimplementasikan Login dan Register
- Memaksa user untuk login terlebih dahulu sebelum dapat mengakses halaman tertentu
- Memaksa user untuk memiliki "kemampuan" tertentu sebelum dapat mengakses halaman tertentu

Untuk itu kita akan membagi langkah langkahnya menjadi beberapa bagian, yuk kita mulai !

### Step 1 - Membuat fungsi yang menggunakan `jsonwebtoken`

Pada langkah ini kita akan mencoba untuk membuat fungsi yang dapat digunakan untuk membuat token dan juga untuk memverifikasi token.

Adapun langkah langkahnya adalah sebagai berikut:

1. Membuka folder client (`sources/a-start/client`)
1. Meng-copy file `.env.example` menjadi `.env`
1. Membuka file `.env` dan mengisi value `MONGODB_CONNECTION_STRING` dengan value yang didapat dari MongoDB Atlas dan `MONGODB_DB_NAME` dengan value `pengembangan` (bila mengikuti pembelajaran sebelumnya)
1. Masih pada file `.env`, menambahkan sebuah key yang baru dengan nama `JWT_SECRET` dan memberikan value bebas sebanyak minimal 16 karakter
1. Menginstall package `jsonwebtoken`
1. Membuat sebuah folder baru pada `src` dengan nama `lib` (`src/lib`)
1. Membuat sebuah file baru dengan nama `jwt.js` pada folder tersebut (`src/lib/jwt.ts`) dan menuliskan kode sebagai berikut:

   ```ts
   import jwt, { JwtPayload } from "jsonwebtoken";

   const SECRET_KEY = process.env.JWT_SECRET || "this-is-not-a-safe-key";

   // Di sini kita menerima payload berupa object (JwtPayload) yang berisi data yang akan disimpan di dalam token.
   export const createToken = (payload: JwtPayload) =>
     jwt.sign(payload, SECRET_KEY);

   // Di sini kita menerima token berupa string yang berisi token yang akan dibaca.
   export const readPayload = (token: string) => jwt.verify(token, SECRET_KEY);
   ```

Selanjutnya kita akan mencoba untuk membuat halaman `/login` dan `/register` yang akan digunakan untuk login dan register, terlebih dahulu

### Step 2 - Membuat Halaman `/login` dan `/register`

Pada langkah ini kita akan membuat halaman `/login` dan `/register` yang akan digunakan untuk login dan register.

Langkah ini hanya sebatas "membuat tampilan" saja yah, belum ada wiring / logic yang terkait dengan login dan register.

Adapun langkah langkahnya adalah sebagai berikut:

1. Membuat sebuah folder baru pada `src` dengan nama `login` (`src/app/login`)
1. Membuat sebuah file baru dengan nama `page.tsx` pada folder tersebut (`src/app/login/page.tsx`) dan menuliskan kode berikut:

   ```tsx
   import Link from "next/link";

   const LoginPage = () => {
     return (
       <section className="flex h-screen w-full flex-col items-center justify-center gap-4">
         <form action="" className="flex min-w-[25vw] flex-col gap-2">
           <h1 className="text-center text-3xl font-semibold text-slate-700">
             Login Page
           </h1>
           <input
             className="rounded px-4 py-2"
             type="email"
             id="email"
             name="email"
             placeholder="Email"
           />
           <input
             className="rounded px-4 py-2"
             type="password"
             id="password"
             name="password"
             placeholder="Password"
           />
           <button
             type="submit"
             className="rounded bg-emerald-300 px-4 py-2 transition-colors duration-300 hover:bg-emerald-500 hover:text-white/90"
           >
             Login
           </button>
         </form>
         <Link
           href="/register"
           className="text-blue-400 underline underline-offset-4 transition-colors duration-300 hover:text-blue-600"
         >
           or do you want to register ... ?
         </Link>
       </section>
     );
   };

   export default LoginPage;
   ```

1. Membuat sebuah folder baru pada `app` dengan nama `register` (`src/app/register`)
1. Membuat sebuah file baru dengan nama `page.tsx` pada folder tersebut (`src/app/register/page.tsx`) dan menuliskan kode berikut:

   ```tsx
   import Link from "next/link";

   const RegisterPage = () => {
     return (
       <section className="flex h-screen w-full flex-col items-center justify-center gap-4">
         <form action="" className="flex min-w-[25vw] flex-col gap-2">
           <h1 className="text-center text-3xl font-semibold text-slate-700">
             Register Page
           </h1>
           <input
             className="rounded px-4 py-2"
             type="text"
             id="username"
             name="username"
             placeholder="Username"
           />
           <input
             className="rounded px-4 py-2"
             type="email"
             id="email"
             name="email"
             placeholder="Email"
           />
           <input
             className="rounded px-4 py-2"
             type="password"
             id="password"
             name="password"
             placeholder="Password"
           />
           <button
             type="submit"
             className="rounded bg-emerald-300 px-4 py-2 transition-colors duration-300 hover:bg-emerald-500 hover:text-white/90"
           >
             Register
           </button>
         </form>
         <Link
           href="/login"
           className="text-blue-400 underline underline-offset-4 transition-colors duration-300 hover:text-blue-600"
         >
           or do you want to login ... ?
         </Link>
       </section>
     );
   };

   export default RegisterPage;
   ```

1. Membuka browser dan buka tautan `http://localhost:3000/login` dan `http://localhost:3000/register` untuk melihat hasilnya

### Step 3 - Mengimplementasikan `/register`

Pada langkah ini kita akan mencoba untuk mengimplementasikan register dengan menggunakan suatu `server actions` yang akan mengirimkan form input ke backend yang sudah disiapkan, yaitu `POST /api/register` dan akan melakukan:

- [BERHASIL] Redirect ke halaman `/login` bila register berhasil
- [GAGAL] Menampilkan pesan error bila register gagal

Adapun langkah langkahnya adalah sebagai berikut:

1. Membuat sebuah Component baru dengan nama `ClientFlashComponent.tsx` (`src/components/ClientFlashComponent.tsx`) dan menuliskan kode berikut:

   ```tsx
   // Ini adalah suatu Component yang akan menerima error dari URLSearchParams
   // Dan menampilkan error tersebut ke client (browser)

   // Di sini kita akan menggunakan hooks, karena itu, HARUS CLIENT COMPONENT
   "use client";

   // Kita akan menggunakan useSearchParams untuk mengambil URLSearchParams yang didefinisikan
   import { useSearchParams } from "next/navigation";

   const ClientFlashComponent = () => {
     const searchParams = useSearchParams();
     const errorMessage = searchParams.get("error");

     return (
       <>
         {errorMessage && (
           <p className="animate-pulse rounded bg-red-400 px-4 py-2 text-center text-white">
             {errorMessage}
           </p>
         )}
       </>
     );
   };

   export default ClientFlashComponent;
   ```

   Kegunaan dari ClientFlashComponent ini adalah untuk menerima error yang diterima pada halaman yang di-redirect dari server, dan menampilkannya ke client (browser)

   Karena harus menggunakan hooks dengan nama useSearchParams, maka component ini harus berupa `client component`.

1. Membuka file `page.tsx` yang terdapat pada folder `register` (`src/app/register/page.tsx`)

1. Memodifikasi kode pada file menjadi sebagai berikut:

   ```tsx
   import Link from "next/link";

   import { redirect } from "next/navigation";
   import ClientFlashComponent from "../../components/ClientFlashComponent";

   const RegisterPage = () => {
     // Kita akan membuat suatu "server actions" untuk menghandle register.
     // "server actions" ini akan melakukan fetch ke backend, dan melakukan redirect ke "/login" apabila berhasil melakukan register. Apabila gagal pada saat fetch ke backend dan diberikan kembalian berupa error, maka kita akan redirect ke halaman register dengan URLSearchParams yang berisi error-nya.
     const handleFormAction = async (formData: FormData) => {
       "use server";

       // Sebenarnya ini sudah dipakai di beberapa tempat
       // sehingga ada baiknya ini dibuat menjadi satu definition tersendiri...
       type MyResponse<T> = {
         statusCode: number;
         message?: string;
         data?: T;
         error?: string;
       };

       const response = await fetch("http://localhost:3000/api/users", {
         method: "POST",
         // Karena backendnya menerima tipe data "json" (lihat function POST pada /src/routes/users/route.ts), maka kita harus menerima bodynya dalam bentuk json juga.
         body: JSON.stringify({
           username: formData.get("username"),
           email: formData.get("email"),
           password: formData.get("password"),
         }),
         headers: {
           "Content-Type": "application/json",
         },
       });

       const responseJson: MyResponse<unknown> = await response.json();

       // !! WARNING: Bila menggunakan redirect, tidak boleh menggunakan try-catch block. Hal ini dikarenakan di dalam NextJS, redirect akan meng-throw error bernama "NEXT_REDIRECT"
       if (!response.ok) {
         let message = responseJson.error ?? "Something went wrong!";

         // Harapannya di sini adalah ketika ada error, maka kita akan redirect ke halaman register dengan URLSearchParams dengan key "error" yang berisi pesan errornya, dengan asumsi bahwa error SELALU string
         return redirect(`/register?error=${message}`);
       }

       // Setelah berhasil melakukan register, maka kita redirect ke halaman login
       return redirect("/login");
     };

     return (
       <section className="flex h-screen w-full flex-col items-center justify-center gap-4">
         {/* Di sini kita akan menyelipkan ClientFlashComponent yang akan menampilkan error */}
         {/* error yang ada pada URLSearchParams akan diterima oleh component ini dan ditampilkan error messagenya */}
         <ClientFlashComponent />
         <form
           action={handleFormAction}
           className="flex min-w-[25vw] flex-col gap-2"
         >
           <h1 className="text-center text-3xl font-semibold text-slate-700">
             Register Page
           </h1>
           <input
             className="rounded px-4 py-2"
             type="text"
             id="username"
             name="username"
             placeholder="Username"
           />
           <input
             className="rounded px-4 py-2"
             type="email"
             id="email"
             name="email"
             placeholder="Email"
           />
           <input
             className="rounded px-4 py-2"
             type="password"
             id="password"
             name="password"
             placeholder="Password"
           />
           <button
             type="submit"
             className="rounded bg-emerald-300 px-4 py-2 transition-colors duration-300 hover:bg-emerald-500 hover:text-white/90"
           >
             Register
           </button>
         </form>
         <Link
           href="/login"
           className="text-blue-400 underline underline-offset-4 transition-colors duration-300 hover:text-blue-600"
         >
           or do you want to login ... ?
         </Link>
       </section>
     );
   };

   export default RegisterPage;
   ```

1. Membuka kembali browser dan buka tautan `http://localhost:3000/register` untuk melihat hasilnya.

   Apakah sudah berhasil melakukan register dan bisa berpindah ke halaman `/login`?

   Untuk melihat pembuktian bahwa data sudah masuk atau belum, bisa dengan membuka MongoDB Atlas secara langsung dan melihat collection-nya yah !

### Step 4 - Mengimplementasikan `/login`

Pada langkah ini kita akan mencoba untuk mengimplementasikan `/login` dengan membuat suatu `server actions` pada file yang terpisah `action.ts` yang akan membuat sebuah logic untuk:

- Mencari email berdasarkan inputan yang ada
- Membandingkan inputan password dengan hash password dari data user yang ditemukan
- Membuat JSON Web Token yang akan digunakan untuk autentikasi nantinya
- Menyimpan JSON Web Token di suatu tempat yang aman
- Me-redirect ke halaman `/dashboard/jokes` apabila sudah selesai melakukan login

Adapun langkah-langkahnya adalah sebagai berikut:

1. Membuat sebuah file baru dengan nama `action.ts` pada folder `login` (`src/app/login/action.ts`) dan menuliskan kode sebagai berikut:

   ```ts
   // Karena ini menggunakan server actions, maka harus dideklarasikan bahwa ini hanya berjalan di server saja, maka dari itu, gunakan "use server"
   "use server";

   import { getUserByEmail } from "@/db/models/user";
   import { compareTextWithHash } from "@/db/utils/hash";
   import { createToken } from "@/lib/jwt";

   import { redirect } from "next/navigation";

   // Di sini kita akan membuat schema inputan login, maka dari itu, sekalian kita validasi dengan zod
   import { z } from "zod";

   // Di sini kita akan menyimpan data token pada cookies, maka dari itu, kita akan menggunakan cookies dari next/headers
   // !! cookies tidak bisa di-import secara otomatis, jadi harus diketik manual yah
   import { cookies } from "next/headers";

   // Pada action ini kita akan melakukan request ke server untuk login
   // Karena kita di sini belum memiliki backend yang bisa di-call, kita akan membuat logicnya di sini (asumsikan di sini se-akan-akan kita sedang berada di server)
   export const doLogin = async (formData: FormData) => {
     const loginInputSchema = z.object({
       email: z.string().email(),
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
       const errFinalMessage = `${errPath} - ${errMessage}`;

       // Mengembalikan error via redirect
       return redirect(`http://localhost:3000/login?error=${errFinalMessage}`);
     }

     // Memvalidasi data terhadap database
     const user = await getUserByEmail(parsedData.data.email);

     if (
       !user ||
       !compareTextWithHash(parsedData.data.password, user.password)
     ) {
       return redirect(
         `http://localhost:3000/login?error=Invalid%20credentials`
       );
     }

     // Membuat Payload dan Token
     const payload = {
       id: user._id,
       email: user.email,
     };

     const token = createToken(payload);

     // Menyimpan token dengan menggunakan cookies
     cookies().set("token", token, {
       httpOnly: true,
       secure: true,
       // Meng-set expiration time dari cookies
       expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
     });

     // Melakukan redirect ke halaman "/dashboard/jokes"
     return redirect(`http://localhost:3000/dashboard/jokes`);
   };
   ```

1. Membuka file `page.tsx` pada folder `login` (`/src/app/login/page.tsx`) dan modifikasi filenya menjadi sebagai berikut:

   ```tsx
   import Link from "next/link";

   // Mengimport komponen ClientFlashComponent
   import ClientFlashComponent from "@/components/ClientFlashComponent";
   // Mengimport server action doLogin
   import { doLogin } from "./action";

   const LoginPage = () => {
     return (
       <section className="flex h-screen w-full flex-col items-center justify-center gap-4">
         {/* Menggunakan ClientFlashComponent di sini */}
         <ClientFlashComponent />
         {/* Menggunakan action doLogin di sini */}
         <form action={doLogin} className="flex min-w-[25vw] flex-col gap-2">
           <h1 className="text-center text-3xl font-semibold text-slate-700">
             Login Page
           </h1>
           <input
             className="rounded px-4 py-2"
             type="email"
             id="email"
             name="email"
             placeholder="Email"
           />
           <input
             className="rounded px-4 py-2"
             type="password"
             id="password"
             name="password"
             placeholder="Password"
           />
           <button
             type="submit"
             className="rounded bg-emerald-300 px-4 py-2 transition-colors duration-300 hover:bg-emerald-500 hover:text-white/90"
           >
             Login
           </button>
         </form>
         <Link
           href="/register"
           className="text-blue-400 underline underline-offset-4 transition-colors duration-300 hover:text-blue-600"
         >
           or do you want to register ... ?
         </Link>
       </section>
     );
   };

   export default LoginPage;
   ```

1. Membuka kembali browser dan buka tautan `http://localhost:3000/login` untuk melihat hasilnya.

   Apakah sudah berhasil melakukan login dan bisa berpindah ke halaman `/dashboard/jokes`?

   Untuk melihat pembuktian bahwa `cookies` sudah terbuat atau belum, bisa dengan membuka `Developer Tools` pada browser kemudian lihat pada bagian `Application` (pada Chrome) atau `Storage` (pada Firefox)

### Step 5 - Mengimplementasikan Logout pada `DashboardSidebar`

Pada langkah ini kita akan mengimplementasikan Logout pada `DashboardSidebar` yang akan menghapus `cookies` yang sudah dibuat sebelumnya, dan akan melakukan redirect ke halaman `/login`.

Adapun langkah-langkahnya adalah sebagai berikut:

1. Membuka file `DashboardSidebar.tsx` (`src/components/DashboardSidebar.tsx`) dan memodifikasi filenya menjadi berikut:

   ```tsx
   import Link from "next/link";

   // Import cookies dari next/headers
   import { cookies } from "next/headers";

   // Import redirect dari next/navigation
   import { redirect } from "next/navigation";

   const DashboardSidebar = () => {
     return (
       <aside className="h-full w-64 bg-gray-100 p-4 dark:bg-zinc-800/30">
         <h2 className="mb-4 text-2xl font-semibold">Navigation</h2>
         {/* Sidebar */}
         <ul>
           <li>
             <Link
               className="text-blue-400 underline underline-offset-4 transition-colors duration-300 hover:text-blue-600"
               href="/"
             >
               Home
             </Link>
           </li>
           <li>
             <Link
               className="text-blue-400 underline underline-offset-4 transition-colors duration-300 hover:text-blue-600"
               href="/about"
             >
               About
             </Link>
           </li>
           <li>
             <Link
               className="text-blue-400 underline underline-offset-4 transition-colors duration-300 hover:text-blue-600"
               href="/dashboard"
             >
               Dashboard
             </Link>
           </li>
           <li className="ml-4">
             <Link
               className="text-blue-400 underline underline-offset-4 transition-colors duration-300 hover:text-blue-600"
               href="/dashboard/jokes"
             >
               Dashboard - Jokes
             </Link>
           </li>
         </ul>
         {/* Membuat tombol Logout "ala" server (non-interactive) dengan menggunakan Form */}
         <form
           className="mt-8 text-center"
           // Karena SideBar ini merupakan Server Component, maka tidak bisa menggunakan onSubmit, oleh karena itu, solusinya adalah menggunakan server action
           action={async () => {
             "use server";

             // Menghapus cookie token
             cookies().delete("token");

             // Redirect ke halaman login
             redirect("/login");
           }}
         >
           <button
             type="submit"
             className="rounded bg-blue-200 px-4 py-2 transition-colors duration-300 hover:bg-blue-400 hover:text-white"
           >
             Logout
           </button>
         </form>
       </aside>
     );
   };

   export default DashboardSidebar;
   ```

1. Membuka browser dan melakukan login, kemudian tekan tombol `Logout`, apakah akan berpindah ke halaman `/login` dan cookies sudah terhapus?

Sampai pada titik ini, kita sudah berhasil membuat implementasi untu `register` dan `login` serta `logout`. Namun masih ada kelemahannya, yaitu, masih belum bisa membatasi halaman tertentu (`Guarding`) untuk hanya bisa diakses oleh user yang sudah login atau yang belum login:

- `User` yang sudah melakukan login, tidak bisa masuk ke halaman `/login` dan `/register`
- `User` yang belum melakukan login, tidak bisa masuk ke halaman `/dashboard` dan turunannya

Nah untuk itu kita harus mempelajari apa itu `middleware` pada NextJS terlebih dahulu.

### Intermezzo - Middleware NextJS

Middleware, Middle = Tengah, Ware = Sesuatu. Jadi, Middleware adalah sesuatu yang diselipkan di tengah-tengah.

Di tengah-tengah apa pada NextJS ini? Ya, di tengah-tengah menuju halaman / routing / endpoint tertentu pada NextJS ini, dan bisa memanipulasi request (dengan tipe data `Request` ataupun `NextRequest`) serta response (dengan tipe data `Response` ataupun `NextResponse`).

Namun sedikit berbeda dengan `express` yang bisa membuat middleware untuk dimanapun dan kapanpun di routingnya bisa diselipkan, pada NextJS ini middleware hanya bisa didefinisikan pada satu tempat saja, yaitu pada `src/middleware.ts`

> Apabila didefinisikan pada folder yang lainnya, maka middleware tidak akan berjalan !

Middleware ini akan dijalankan **untuk setiap route yang ada di dalam proyek yang sedang dibuat**.

Nah karena ini cukup sulit, NextJS menyediakan cara untuk mendefinisikan `path` / `route` mana saja yang akan dijalankan middleware, yaitu dengan menggunakan 2 cara:

- `Custom Matcher Config` (auto)

  ```ts
  // File: middleware.ts, paling bawahnya

  export const config = {
    matcher: "hanya/akan/berjalan/di/route/ini/saja",
    // atau dengan menggunakan array bila lebih dari satu route
    matcher: ["ini/route/pertama", "ini/route/kedua", "dan/route/seterusnya"],
    // bisa juga dengan menggunakan regex
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  };
  ```

- `Conditional Statement` (manual)

  Gunakan cara ini bila kita ingin lebih memilih url ataupun method apa saja yang akan diatur oleh middleware

  ```ts
  import { NextResponse } from "next/server";
  import type { NextRequest } from "next/server";

  export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/about")) {
      return NextResponse.rewrite(new URL("/about-2", request.url));
    }

    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.rewrite(new URL("/dashboard/user", request.url));
    }
  }
  ```

Nah sekarang kita sudah siap untuk mencoba membuat Middleware paling sederhana yaitu untuk melakukan console log tiap path mana saja yang dijalankan oleh NextJS ini yah !

### Step 6 - Membuat Middleware untuk mencetak route yang dijalankan

```ts
// File: middleware.ts
import { NextRequest, NextResponse } from "next/server";

export const middleware = (request: NextRequest) => {
  console.log(request.method, request.url);

  // Seperti pada Express, karena ini middleware, kita harus meng-"sliding" supaya request bisa dilanjutkan ke handler berikutnya dengan menggunakan "next()"
  return NextResponse.next();
};
```

## References
