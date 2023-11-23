import { NextRequest, NextResponse } from "next/server";

export const middleware = (request: NextRequest) => {
  console.log(request.method, request.url);

  // Seperti pada Express, karena ini middleware, kita harus meng-"sliding" supaya request bisa dilanjutkan ke handler berikutnya dengan menggunakan "next()"
  return NextResponse.next();
};
