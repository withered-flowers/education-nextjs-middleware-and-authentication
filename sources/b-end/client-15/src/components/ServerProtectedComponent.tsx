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
