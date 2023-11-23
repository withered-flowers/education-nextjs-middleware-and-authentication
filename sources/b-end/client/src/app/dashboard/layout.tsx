import DashboardSidebar from "@/components/DashboardSidebar";
// Import ServerProtectedComponents
import ServerProtectedComponents from "@/components/ServerProtectedComponents";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // Whole Screen
    // Gunakan ServerProtectedComponents sebagai parent
    <ServerProtectedComponents>
      <section className="flex h-screen w-full">
        {/* Left Side */}
        <DashboardSidebar />

        {/* Right Side */}
        <main className="h-full w-full overflow-auto bg-white p-4 dark:bg-zinc-900/30">
          {/* Content */}
          {children}
        </main>
      </section>
    </ServerProtectedComponents>
  );
};

export default DashboardLayout;
