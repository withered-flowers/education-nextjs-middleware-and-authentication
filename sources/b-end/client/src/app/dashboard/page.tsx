// ?? Untuk pembuktian penggunaan middleware, di sini kita akan membuat sebuah logic untuk mengambil data users dari server via GET /api/users.

// ?? Sekarang kita akan menggunakan cookies
import { cookies } from "next/headers";

const fetchUsers = async () => {
  const response = await fetch("http://localhost:3000/api/users", {
    headers: {
      // Spesifik hanya pada NextJS, kita harus menambahkan Cookie: cookies().toString() pada headers.
      Cookie: cookies().toString(),
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
