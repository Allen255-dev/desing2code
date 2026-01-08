import DashboardSidebar from '@/components/DashboardSidebar';
import { ProjectsProvider } from '@/context/ProjectsContext';
import OnboardingTour from '@/components/OnboardingTour';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProjectsProvider>
            <div className="flex h-screen bg-background overflow-hidden relative">
                <OnboardingTour />
                {/* Background Gradients for Dashboard */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/10 via-background to-background pointer-events-none" />

                <DashboardSidebar />
                <main className="flex-1 overflow-y-auto relative z-10">
                    {children}
                </main>
            </div>
        </ProjectsProvider>
    );
}
