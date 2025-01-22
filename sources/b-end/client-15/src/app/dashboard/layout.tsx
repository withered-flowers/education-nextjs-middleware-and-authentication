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
