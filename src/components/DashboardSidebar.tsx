'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, PlusCircle, Layers, Settings, LogOut, Code, Crown, RefreshCcw, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useProjects } from '@/context/ProjectsContext';
import { useSession, signOut } from 'next-auth/react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'New Project', href: '/dashboard/new', icon: PlusCircle },
    { name: 'My Designs', href: '/dashboard/projects', icon: Layers },
    { name: 'Snippets', href: '/dashboard/snippets', icon: Code },
    { name: 'Pricing', href: '/dashboard/pricing', icon: Crown },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const { userPlan: contextPlan, planExpiryDate } = useProjects();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Prioritize session plan if available
    const userPlan = (session?.user as any)?.plan || contextPlan;

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    const getDaysLeft = () => {
        if (!planExpiryDate) return 0;
        const expiry = new Date(planExpiryDate);
        const now = new Date();
        const diff = expiry.getTime() - now.getTime();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const daysLeft = getDaysLeft();

    return (
        <motion.div
            animate={{ width: isCollapsed ? '80px' : '256px' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            initial={false}
            className="h-full glass border-r border-white/10 flex flex-col relative z-20"
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg z-30 border border-white/20"
            >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            <div className="p-6 flex items-center justify-between whitespace-nowrap overflow-hidden">
                <motion.div
                    animate={{ x: isCollapsed ? -100 : 0, opacity: isCollapsed ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-gray-400 dark:from-white dark:to-gray-400">
                        Design2Code
                    </h1>
                </motion.div>
                {isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute left-1/2 -translate-x-1/2"
                    >
                        <h1 className="text-2xl font-bold text-primary">D2C</h1>
                    </motion.div>
                )}
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const tourIdMap: Record<string, string> = {
                        'New Project': 'tour-new-project',
                        'My Designs': 'tour-projects',
                        'Pricing': 'tour-pricing',
                        'Settings': 'tour-settings'
                    };

                    return (
                        <Link
                            key={item.name}
                            id={tourIdMap[item.name]}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all h-[48px] relative group ${isActive
                                ? 'bg-primary text-white shadow-[0_0_20px_-10px_var(--primary)]'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                                }`}
                        >
                            <div className="flex-shrink-0">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <motion.span
                                animate={{ opacity: isCollapsed ? 0 : 1, x: isCollapsed ? -20 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="font-medium whitespace-nowrap"
                            >
                                {item.name}
                            </motion.span>

                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Plan Info / Upgrade Card */}
            <div className="px-4 mb-4 overflow-hidden">
                <motion.div
                    animate={{
                        opacity: isCollapsed ? 0 : 1,
                        height: isCollapsed ? 0 : 'auto',
                        marginBottom: isCollapsed ? 0 : 16
                    }}
                >
                    {userPlan === 'starter' ? (
                        <div className="bg-gradient-to-br from-violet-600/10 to-primary/10 rounded-2xl p-4 border border-primary/20 relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Crown className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-bold text-gray-900 dark:text-white white-space-nowrap">Pro Plan</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                    Unlock React, Vue.js and unlimited generations.
                                </p>
                                <Link href="/dashboard/pricing">
                                    <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:scale-[1.02] active:scale-95 transition-all">
                                        Upgrade Now
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Crown className="w-4 h-4 text-amber-500" />
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">Pro User</span>
                                </div>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-3">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(daysLeft / 30) * 100}%` }}
                                    className="h-full bg-amber-500"
                                />
                            </div>
                            <Link href="/dashboard/pricing">
                                <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold rounded-lg border border-white/10 transition-all flex items-center justify-center gap-2">
                                    <RefreshCcw className="w-3 h-3" /> Renew Subscription
                                </button>
                            </Link>
                        </div>
                    )}
                </motion.div>

                {isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center pb-4"
                    >
                        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                            <Crown className="w-5 h-5 text-primary" />
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Profile Section */}
            <div className="p-4 border-t border-gray-200 dark:border-white/5 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {session?.user?.image ? (
                            <img src={session.user.image} alt={session.user.name || ''} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-4 h-4 text-primary" />
                        )}
                    </div>
                    {!isCollapsed && (
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                {session?.user?.name || 'Guest User'}
                            </p>
                            <p className="text-[10px] text-gray-500 truncate uppercase tracking-wider">
                                {userPlan} account
                            </p>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-500 dark:text-gray-400 hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-colors h-[48px] relative group"
                >
                    <div className="flex-shrink-0">
                        <LogOut className="w-5 h-5" />
                    </div>
                    <motion.span
                        animate={{ opacity: isCollapsed ? 0 : 1, x: isCollapsed ? -20 : 0 }}
                        className="font-medium whitespace-nowrap"
                    >
                        Sign Out
                    </motion.span>
                    {isCollapsed && (
                        <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                            Sign Out
                        </div>
                    )}
                </button>
            </div>
        </motion.div>
    );
}
