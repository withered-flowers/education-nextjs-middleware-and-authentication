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
