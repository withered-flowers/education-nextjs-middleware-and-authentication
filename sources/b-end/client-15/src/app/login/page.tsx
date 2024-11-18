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
