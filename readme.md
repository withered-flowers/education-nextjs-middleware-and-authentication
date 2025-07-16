# Education NextJS - Middleware & Authentication

## Table of Content

- [Education NextJS - Middleware \& Authentication](#education-nextjs---middleware--authentication)
  - [Table of Content](#table-of-content)
  - [Scope Pembelajaran](#scope-pembelajaran)
  - [Disclaimer](#disclaimer)
  - [Demo](#demo)
    - [Step 1 - Membuat fungsi yang menggunakan `jsonwebtoken`](#step-1---membuat-fungsi-yang-menggunakan-jsonwebtoken)
    - [Step 2 - Membuat Halaman `/login` dan `/register`](#step-2---membuat-halaman-login-dan-register)
    - [Step 3 - Mengimplementasikan `/register`](#step-3---mengimplementasikan-register)
    - [Step 4 - Mengimplementasikan `/login`](#step-4---mengimplementasikan-login)
    - [Step 5 - Mengimplementasikan Logout pada `DashboardSidebar`](#step-5---mengimplementasikan-logout-pada-dashboardsidebar)
    - [Intermezzo - Middleware NextJS](#intermezzo---middleware-nextjs)
    - [Step 6 - Membuat Middleware untuk mencetak route yang dijalankan](#step-6---membuat-middleware-untuk-mencetak-route-yang-dijalankan)
    - [Step 7 - Mengimplementasikan Middleware Authentication (BackEnd)](#step-7---mengimplementasikan-middleware-authentication-backend)
    - [Step 8 - Mengimplementasikan Middleware Authentication (FrontEnd)](#step-8---mengimplementasikan-middleware-authentication-frontend)
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
1. Meng-copy file `dotenv.example` menjadi `.env.local`
1. Membuka file `.env` dan mengisi value `MONGODB_CONNECTION_STRING` dengan value yang didapat dari MongoDB Atlas dan `MONGODB_DB_NAME` dengan value `pengembangan` (bila mengikuti pembelajaran sebelumnya)
1. Masih pada file `.env.local`, menambahkan sebuah key yang baru dengan nama `JWT_SECRET` dan memberikan value bebas sebanyak minimal 16 karakter
1. Menginstall package `jsonwebtoken` dengan perintah:

   - `npm install jsonwebtoken`
   - `npm install -D @types/jsonwebtoken`

1. Membuat sebuah file baru dengan nama `jwt.ts` pada folder `utils` (`src/utils/jwt.ts`) dan menuliskan kode sebagai berikut:

   ```ts
   import jwt, { type JwtPayload } from "jsonwebtoken";

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
             className="rounded px-4 py-2 border border-gray-300"
             type="email"
             id="email"
             name="email"
             placeholder="Email"
           />
           <input
             className="rounded px-4 py-2 border border-gray-300"
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
             className="rounded px-4 py-2 border border-gray-300"
             type="text"
             id="username"
             name="username"
             placeholder="Username"
           />
           <input
             className="rounded px-4 py-2 border border-gray-300"
             type="email"
             id="email"
             name="email"
             placeholder="Email"
           />
           <input
             className="rounded px-4 py-2 border border-gray-300"
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
         const message = responseJson.error ?? "Something went wrong!";

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

     if (
       !user ||
       !compareTextWithHash(parsedData.data.password, user.password)
     ) {
       return redirect(
         "http://localhost:3000/login?error=Invalid%20credentials"
       );
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

             // Menggunakan cookies storage
             const cookieStorage = await cookies();

             // Menghapus cookie token bila exists
             cookieStorage.get("token") && cookieStorage.delete("token");

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

Pada langkah ini kita akan mencoba untuk menggunakan middleware sederhana untuk mencetak routing yang sedang dijalankan / dibuka oleh NextJS yah.

1. Membuat sebuah file baru dengan nama `middleware.ts` pada folder `src` (`/src/middleware.ts`)
1. Menuliskan kode sebagai berikut:

   ```ts
   import { type NextRequest, NextResponse } from "next/server";

   // Ingat: middleware hanya bisa ada satu
   export const middleware = (request: NextRequest) => {
     // Di sini harapannya kita hanya ingin menuliskan HTTP method apa yang sedang digunakan dan url apa yang sedang dituju
     console.log(request.method, request.url);

     // Seperti pada Express, karena ini middleware, kita harus meng-"sliding" supaya request bisa dilanjutkan ke handler berikutnya dengan menggunakan "next()"
     return NextResponse.next();
   };
   ```

1. Membuka pada browser dan buka halaman / routing apapun kemudian lihat hasilnya pada terminal

   Apakah sudah berhasil mencetak routing yang sedang dijalankan?

   Tapi ternyata pada routingan ini masih sangat "bar-bar" yah karena semua routing akan dijalankan, termasuk pada saat membuka `_next/static` yang seharusnya tidak ingin kita tampilkan.

   Oleh karena itu pada langkah selanjutnya kita akan mencoba untuk melakukan filtering pada routing yang akan dijalankan oleh middleware dengan menggunakan matcher yah !

1. Membuka kembali file `middleware.ts` dan memodifikasi filenya menjadi sebagai berikut:

   ```ts
   import { type NextRequest, NextResponse } from "next/server";

   // Ingat: middleware hanya bisa ada satu
   export const middleware = (request: NextRequest) => {
     // Di sini harapannya kita hanya ingin menuliskan HTTP method apa yang sedang digunakan dan url apa yang sedang dituju
     console.log(request.method, request.url);

     // Seperti pada Express, karena ini middleware, kita harus meng-"sliding" supaya request bisa dilanjutkan ke handler berikutnya dengan menggunakan "next()"
     return NextResponse.next();
   };

   // References:
   // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
   export const config = {
     // Kita akan menggunakan regex untuk melakukan filtering
     // Pada filtering ini akan meng-exclude semua url yang mengandung kata "api", "_next/static", "_next/image", dan "favicon.ico" (perhatikan tanda "!" pada regex)
     matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],

     // !! Warning: pada matcher ini sekalipun regex, wajib bersifat constant (tidak boleh ada variabel di dalamnya. apabila ada variabel, maka akan di-ignore !)
   };
   ```

1. Membuka kembali pada browser halaman manapun pada `http://localhost:3000` kemudian lihat hasilnya pada terminal, apakah masih memunculkan `_next/blablabla` ?

   Sampai pada titik ini kita sudah berhasil membuat middleware yang sederhana yah !

### Step 7 - Mengimplementasikan Middleware Authentication (BackEnd)

**Disclaimer**:

- Pada langkah ini secara efektif kita akan mematikan user untuk tidak bisa melakukan `register` yah !
- Untuk `login` masih bisa dilakukan karena kita tidak memanfaatkan `api/users` untuk melakukan login, melainkan secara direct via `server actions`

Pada langkah ini kita akan mencoba untuk mengimplementasikan Authentication pada backend dengan menggunakan `middleware` yang sudah kita buat sebelumnya.

BackEnd yang dimaksud di sini adalah `/api` yang sudah kita buat sebelumnya.

Harapan kita adalah, pada saat user mengakses `/api` user harus sudah ter-authentikasi via `cookies` yang sudah kita buat sebelumnya.

Adapun langkah-langkahnya adalah sebagai berikut:

1. Membuka file `middleware.ts` (`src/middleware.ts`) dan memodifikasi file menjadi sebagai berikut:

   ```ts
   import { type NextRequest, NextResponse } from "next/server";

   // ?? Di sini kita akan menggunakan cookies
   import { cookies } from "next/headers";
   import { readPayload } from "./utils/jwt";

   // Ingat: middleware hanya bisa ada satu
   // ?? Karena di sini kita akan menggunakan await, maka fungsi middleware ini akan dideklarasikan sebagai async
   export const middleware = async (request: NextRequest) => {
     // ?? Karena di sini kita akan menggunakan "logic middleware lebih dari satu", maka di sini kita akan menggunakan banyak perkondisian (menggunakan if / if-else)

     // ?? Karena ini fungsi yang akan dijalankan di semuanya, maka kita akan comment yah
     // // Di sini harapannya kita hanya ingin menuliskan HTTP method apa yang sedang digunakan dan url apa yang sedang dituju
     // console.log(request.method, request.url);

     // // Seperti pada Express, karena ini middleware, kita harus meng-"sliding" supaya request bisa dilanjutkan ke handler berikutnya dengan menggunakan "next()"
     // return NextResponse.next();

     // ?? Di sini kita akan menambahkan kondisi untuk meng-exclude semua url yang mengandung kata "api", "_next/static", "_next/image", dan "favicon.ico"
     if (
       !request.url.includes("/api") &&
       !request.url.includes("_next/static") &&
       !request.url.includes("_next/image") &&
       !request.url.includes("favicon.ico")
     ) {
       console.log(request.method, request.url);
     }

     // ?? Di sini kita akan melakukan "authentication" pada route `/api`
     // ?? Hal ini secara efektif akan membuat semua route `/api` menjadi "private", termasuk di dalamnya adalah untuk melakukan "register" (POST /users)
     if (request.url.includes("/api")) {
       console.log("API", request.method, request.url);

       // Di sini kita akan mengambil token yang ada di dalam cookies
       const cookieStorage = await cookies();
       const token = cookieStorage.get("token");

       // Mari kita coba baca apa isi dari token?
       console.log("token dari cookieStorage", token);

       // Di sini kita akan mengecek apakah token ada atau tidak, apabila tidak ada, maka kita akan mengembalikan response dengan status code 401 (Unauthorized)
       if (!token) {
         // Karena asumsi ini adalah DARI /api (route handler), maka kita akan menggunakan NextResponse.json()
         return NextResponse.json({
           statusCode: 401,
           error: "Unauthorized",
         });
       }

       // Umumnya setelah ini kita akan melakukan pengecekan apakah token yang ada di dalam cookies itu valid atau tidak, namun karena cookies ini awalnya diberikan dari server, maka kita akan langsung menganggap bahwa token yang ada di dalam cookies itu valid
       // (Walaupun ini umumnya tergantung konsiderasi dari developer, apakah ingin melakukan validasi lagi atau langsung percaya saja dengan token yang ada di dalam cookies)

       // Setelah itu kita akan membaca token yang ada di dalam cookies dan mengambil data user yang ada di dalamnya.
       // Ingat asumsinya tokenData itu berisi Object { id: string, email: string }
       const tokenData = readPayload(token.value) as {
         id: string;
         email: string;
       };

       // Setelah itu umumnya kita akan melakukan penambahan data ke dalam request yang kita miliki (request.user = tokenData), namun karena di sini kita tidak bisa memiliki data tambahan di dalam request, maka kita akan menggunakan antara cookies ATAU headers

       // Pada pembelajaran ini, maka kita akan menggunakan headers
       const requestHeaders = new Headers(request.headers);

       // Di sini kita akan menambahkan data user ke dalam headers
       requestHeaders.set("x-user-id", tokenData.id);
       requestHeaders.set("x-user-email", tokenData.email);
       requestHeaders.set("x-custom-value", "Ini untuk mencoba data tambahan");

       // Di sini kita akan mengembalikan response dengan headers yang sudah kita tambahkan
       return NextResponse.next({
         headers: requestHeaders,
       });
     }

     // Jangan lupa untuk meng-"sliding" supaya request bisa dilanjutkan ke handler berikutnya dengan menggunakan "next()"
     return NextResponse.next();
   };

   // ?? Karena di sini kita akan menggunakan middleware yang logic dan pathnya berbeda-beda, maka kita tidak akan menggunakan config.matcher
   // // References:
   // // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
   // export const config = {
   //   // Kita akan menggunakan regex untuk melakukan filtering
   //   // Pada filtering ini akan meng-exclude semua url yang mengandung kata "api", "_next/static", "_next/image", dan "favicon.ico" (perhatikan tanda "!" pada regex)
   //   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],

   //   // !! Warning: pada matcher ini sekalipun regex, wajib bersifat constant (tidak boleh ada variabel di dalamnya. apabila ada variabel, maka akan di-ignore !)
   // };
   ```

1. Sampai pada tahap ini, terlihat sepertinya untuk middleware ini sudah berhasil dibuat, namun belum ada pembuktian / penggunaannya.

   Oleh karena itu, kita akan mencoba untuk memodifikasi `/dashboard` (`src/app/dashboard/page.tsx`) untuk mencoba apakah sudah berhasil atau belum dengan menampilkan data user `GET /api/users` pada `/dashboard`.

   Membuka file `page.tsx` pada folder `dashboard` (`src/app/dashboard/page.tsx`) dan memodifikasi filenya menjadi sebagai berikut:

   ```tsx
   // ?? Untuk pembuktian penggunaan middleware, di sini kita akan membuat sebuah logic untuk mengambil data users dari server via GET /api/users.

   // ?? Sekarang kita akan menggunakan cookies
   import { cookies } from "next/headers";

   const fetchUsers = async () => {
     // Di sini kita akan menggunakan cookieStorage
     const cookieStorage = await cookies();

     const response = await fetch("http://localhost:3000/api/users", {
       headers: {
         // Spesifik hanya pada NextJS (server to server), kita harus menambahkan data berikut:
         // - key: Cookie
         // - value: cookieStorage.toString()
         Cookie: cookieStorage.toString(),
       },
       // Sebenarnya untuk kondisi umumnya, untuk melempar cookies yang sekarang ini sedang disimpan pada client ke server, kita bisa menggunakan credentials: "include" pada fetch. Namun pada NextJS, kita tidak bisa menggunakan credentials: "include" saja.
       // credentials: "include",
     });
     const data = await response.json();
     return data;
   };

   const DashboardPage = async () => {
     const users = await fetchUsers();

     return (
       <section>
         <h2 className="text-2xl font-semibold">Dashboard Page</h2>
         <pre>{JSON.stringify(users, null, 2)}</pre>
       </section>
     );
   };

   export default DashboardPage;
   ```

1. Membuka file `route.ts` di dalam folder `src/app/api/users` dan memodifikasi file menjadi sebagai berikut:

   ```ts
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
   ```

1. Pastikan pada browser user sudah melakukan login, kemudian buka tautan `http://localhost:3000/dashboard` dan lihat hasilnya, apakah data user sudah muncul?

   Ternyata _tydaque_ muncul yah 😭

   Walaupun pada terminal sudah terlihat bahwa token sudah berhasil dibaca oleh middlware pada saat mengakses `API GET http://localhost:3000/api/users`, namun terdapat error yang menyatakan:

   > ❌ Error: The edge runtime does not support Node.js 'crypto' module.

   Hal ini terjadi karena pada saat menggunakan fungsi `readPayload` yang merupakan `jsonwebtoken.verify`, menggunakan fungsi nodejs `crypto` yang tidak didukung oleh `edge runtime` yang digunakan oleh NextJS.

   Wah bagaimana solusinya yah?

1. Solusi dari permasalahan di atas adalah dengan menggunakan package lainnya selain `jsonwebtoken` untuk melakukan verify, yaitu sebuah package yang bernama `jose`.

   Mari kita pasang package `jose` dengan menggunakan perintah `npm i jose`

   Kemudian membuka kembali file `utils/jwt.ts` dan memodifikasinya menjadi sebagai berikut:

   ```ts
   import jwt, { type JwtPayload } from "jsonwebtoken";

   // ?? Di sini kita akan menggunakan jose
   import * as jose from "jose";

   const SECRET_KEY = process.env.JWT_SECRET || "this-is-not-a-safe-key";

   // Di sini kita menerima payload berupa object (JwtPayload) yang berisi data yang akan disimpan di dalam token.
   export const createToken = (payload: JwtPayload) =>
     jwt.sign(payload, SECRET_KEY);

   // Di sini kita menerima token berupa string yang berisi token yang akan dibaca.
   export const readPayload = (token: string) => jwt.verify(token, SECRET_KEY);

   // ?? Contoh penggunaan bisa dilihat di:
   // ?? - https://github.com/panva/jose/blob/main/docs/jwt/verify/functions/jwtVerify.md
   // ?? Di sini kita akan menambahkan fungsi untuk membaca payload dengan jose, karena di sini kita membutuhkan tipe data kembalian, maka kita akan menambahkan generic untuk function
   export const readPayloadJose = async <T>(token: string) => {
     const secretKey = new TextEncoder().encode(SECRET_KEY);
     const payloadJose = await jose.jwtVerify<T>(token, secretKey);

     return payloadJose.payload;
   };
   ```

1. Kemudian kita akan membuka kembali file `middleware.ts` (`src/middleware.ts`) dan memodifikasinya menjadi sebagai berikut:

   ```ts
   import { type NextRequest, NextResponse } from "next/server";

   // ?? Di sini kita akan menggunakan cookies
   import { cookies } from "next/headers";
   // ?? Jangan lupa untuk import readPayloadJose
   // import { readPayload } from "./utils/jwt";
   import { readPayloadJose } from "./utils/jwt";

   // Ingat: middleware hanya bisa ada satu
   // ?? Karena di sini kita akan menggunakan await, maka fungsi middleware ini akan dideklarasikan sebagai async
   export const middleware = async (request: NextRequest) => {
     // ?? Karena di sini kita akan menggunakan "logic middleware lebih dari satu", maka di sini kita akan menggunakan banyak perkondisian (menggunakan if / if-else)

     // ?? Karena ini fungsi yang akan dijalankan di semuanya, maka kita akan comment yah
     // // Di sini harapannya kita hanya ingin menuliskan HTTP method apa yang sedang digunakan dan url apa yang sedang dituju
     // console.log(request.method, request.url);

     // // Seperti pada Express, karena ini middleware, kita harus meng-"sliding" supaya request bisa dilanjutkan ke handler berikutnya dengan menggunakan "next()"
     // return NextResponse.next();

     // ?? Di sini kita akan menambahkan kondisi untuk meng-exclude semua url yang mengandung kata "api", "_next/static", "_next/image", dan "favicon.ico"
     if (
       !request.url.includes("/api") &&
       !request.url.includes("_next/static") &&
       !request.url.includes("_next/image") &&
       !request.url.includes("favicon.ico")
     ) {
       console.log(request.method, request.url);
     }

     // ?? Di sini kita akan melakukan "authentication" pada route `/api`
     // ?? Hal ini secara efektif akan membuat semua route `/api` menjadi "private", termasuk di dalamnya adalah untuk melakukan "register" (POST /users)
     if (request.url.includes("/api")) {
       console.log("API", request.method, request.url);

       // Di sini kita akan mengambil token yang ada di dalam cookies
       const cookieStorage = await cookies();
       const token = cookieStorage.get("token");

       // Mari kita coba baca apa isi dari token?
       console.log("token dari cookieStorage", token);

       // Di sini kita akan mengecek apakah token ada atau tidak, apabila tidak ada, maka kita akan mengembalikan response dengan status code 401 (Unauthorized)
       if (!token) {
         // Karena asumsi ini adalah DARI /api (route handler), maka kita akan menggunakan NextResponse.json()
         return NextResponse.json({
           statusCode: 401,
           error: "Unauthorized",
         });
       }

       // Umumnya setelah ini kita akan melakukan pengecekan apakah token yang ada di dalam cookies itu valid atau tidak, namun karena cookies ini awalnya diberikan dari server, maka kita akan langsung menganggap bahwa token yang ada di dalam cookies itu valid
       // (Walaupun ini umumnya tergantung konsiderasi dari developer, apakah ingin melakukan validasi lagi atau langsung percaya saja dengan token yang ada di dalam cookies)

       // Setelah itu kita akan membaca token yang ada di dalam cookies dan mengambil data user yang ada di dalamnya.
       // Ingat asumsinya tokenData itu berisi Object { id: string, email: string }
       // const tokenData = readPayload(token.value) as { id: string; email: string };
       const tokenData = await readPayloadJose<{ id: string; email: string }>(
         token.value
       );
       // !! Yang sebelumnya ini tidak digunakan lagi...
       // const tokenData = readPayload(token.value) as {
       //   id: string;
       //   email: string;
       // };

       // Setelah itu umumnya kita akan melakukan penambahan data ke dalam request yang kita miliki (request.user = tokenData), namun karena di sini kita tidak bisa memiliki data tambahan di dalam request, maka kita akan menggunakan antara cookies ATAU headers

       // Pada pembelajaran ini, maka kita akan menggunakan headers
       const requestHeaders = new Headers(request.headers);

       // Di sini kita akan menambahkan data user ke dalam headers
       requestHeaders.set("x-user-id", tokenData.id);
       requestHeaders.set("x-user-email", tokenData.email);
       requestHeaders.set("x-custom-value", "Ini untuk mencoba data tambahan");

       // Di sini kita akan mengembalikan response dengan headers yang sudah kita tambahkan
       return NextResponse.next({
         headers: requestHeaders,
       });
     }

     // Jangan lupa untuk meng-"sliding" supaya request bisa dilanjutkan ke handler berikutnya dengan menggunakan "next()"
     return NextResponse.next();
   };
   ```

1. Simpan dan kemudian coba lihat kembali pada browser, apakah sudah berhasil menampilkan data user?

Ya sampai pada pada tahap ini artinya kita sudah berhasil melakukan proses `authentication` pada `middleware` untuk route `/api` yang kita buat sebelumnya.

Lalu bagaimana dengan `Guarding` untuk route `/dashboard` dan turunannya?

### Step 8 - Mengimplementasikan Middleware Authentication (FrontEnd)

Pada langkah ini kita akan mencoba untuk melakukan `Guarding` navigasi pada router `/dashboard` dan turunannya.

Adapun langkah-langkahnya adalah sebagai berikut:

1. Membuat sebuah component baru dengan nama `ServerProtectedComponent.tsx` pada folder `components` (`src/components/ServerProtectedComponent.tsx`) dan menuliskan kode sebagai berikut:

   ```tsx
   // ?? Ingat baik baik cookies hanya bisa digunakan di:
   // ?? - (Read Only) Server Component
   // ?? - (Read & Write) Server Action
   // ?? - (Read & Write) Route Handler
   // ?? - (Read & Write) Middleware
   import { cookies } from "next/headers";
   import { redirect } from "next/navigation";

   const ServerProtectedComponent = async ({
     children,
   }: {
     children: React.ReactNode;
   }) => {
     // Membaca cookies
     const cookieStore = await cookies();

     // Mengambil token dari cookieStore
     const token = cookieStore.get("token");

     // Mengecek apabila token tidak ada, maka redirect ke halaman login
     if (!token || token.value.length <= 0) {
       redirect("/login");
     }

     // Di sini kita hanya akan mengembalikan children
     return <>{children}</>;
   };

   export default ServerProtectedComponent;
   ```

1. Karena pada `dashboard` ini kita sudah memanfaatkan `layout.tsx`, maka kita hanya perlu memodifikasi file `layout.tsx` (`src/app/dashboard/layout.tsx`) menjadi sebagai berikut:

   ```tsx
   import DashboardSidebar from "@/components/DashboardSidebar";
   // Import ServerProtectedComponent
   import ServerProtectedComponent from "@/components/ServerProtectedComponent";

   const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
     return (
       // Whole Screen
       // Gunakan ServerProtectedComponent sebagai parent
       <ServerProtectedComponent>
         <section className="flex h-screen w-full">
           {/* Left Side */}
           <DashboardSidebar />

           {/* Right Side */}
           <main className="h-full w-full overflow-auto bg-white p-4 dark:bg-zinc-900/30">
             {/* Content */}
             {children}
           </main>
         </section>
       </ServerProtectedComponent>
     );
   };

   export default DashboardLayout;
   ```

1. Membuka browser dan buka tautan `http://localhost:3000/login` kemudian melakukan login, dan lihat, apakah sudah bisa masuk ke halaman `/dashboard` serta `/dashboard/jokes` ?

   Sampai pada tahap ini, kita sudah berhasil melakukan `Guarding` pada route `/dashboard` dan turunannya.

Asik bukan?

Pembelajaran ini cukup panjang juga yah, semoga mendapatkan insight yang lebih dalam mengenai `middleware` pada NextJS dan cara menuliskan `authentication` dengan lebih baik yah !

## References

- <https://nextjs.org/docs/app/building-your-application/routing/middleware>
- <https://nextjs.org/docs/app/api-reference/functions/cookies>
- <https://www.npmjs.com/package/jose>
