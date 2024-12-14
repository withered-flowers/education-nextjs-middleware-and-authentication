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
