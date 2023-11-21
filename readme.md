# Education NextJS - Middleware & Authentication

## Table of Content

- [Scope Pembelajaran](#scope-pembelajaran)
- [Disclaimer](#disclaimer)
- [Demo](#demo)
- [References](#references)

## Scope Pembelajaran

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

## References
