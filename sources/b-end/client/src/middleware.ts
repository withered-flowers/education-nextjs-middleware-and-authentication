import { NextRequest, NextResponse } from "next/server";

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
