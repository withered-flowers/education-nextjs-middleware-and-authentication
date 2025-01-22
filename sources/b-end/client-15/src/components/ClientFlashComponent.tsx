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
