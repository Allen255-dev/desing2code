'use client';

import { motion } from 'framer-motion';
import { Plus, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useProjects } from '@/context/ProjectsContext';

export default function DashboardPage() {
    const { projects } = useProjects();
    const recentProjects = projects.slice(0, 3);

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back. Ready to create?</p>
                </div>
                <Link href="/dashboard/new">
                    <button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-6 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        New Project
                    </button>
                </Link>
            </div>

            {recentProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recentProjects.map((project, i) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 rounded-2xl group hover:border-black/10 dark:hover:border-white/20 transition-all cursor-pointer bg-white/50 dark:bg-black/50"
                        >
                            <div className="h-40 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-black mb-4 flex items-center justify-center border border-black/5 dark:border-white/5 group-hover:scale-[1.02] transition-transform duration-500">
                                <span className="text-gray-400 dark:text-gray-600 font-mono text-sm">Preview</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">{project.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{project.createdAt}</p>
                                </div>
                                <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                                    <ArrowUpRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
                    <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5 mb-4">
                        <Plus className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No projects yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm text-center mb-6">
                        Start by uploading a design screenshot to convert it into clean, usable code.
                    </p>
                    <Link href="/dashboard/new">
                        <button className="bg-primary hover:bg-violet-600 text-white px-6 py-2.5 rounded-full font-medium transition-colors">
                            Create your first project
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}
