'use client';

import { useState } from 'react';
import { Layers, MoreVertical, Trash2, Search } from 'lucide-react';
import Link from 'next/link';
import { useProjects } from '@/context/ProjectsContext';

export default function ProjectsPage() {
    const { projects, deleteProject, isLoading } = useProjects();
    const [searchTerm, setSearchTerm] = useState('');

    if (isLoading) {
        return (
            <div className="p-8 h-full flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-gray-500 animate-pulse font-medium">Fetching your designs...</p>
            </div>
        );
    }

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to delete this project?')) {
            deleteProject(id);
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">My Designs</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your converted projects</p>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>
            </div>

            {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, i) => (
                        <div
                            key={project.id}
                            className="glass-card rounded-2xl overflow-hidden group hover:border-black/10 dark:hover:border-white/20 transition-all cursor-pointer bg-white/50 dark:bg-black/50 border border-black/5 dark:border-white/5"
                        >
                            <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-black relative flex items-center justify-center border-b border-black/5 dark:border-white/5">
                                <Layers className="text-gray-500 dark:text-gray-700 w-12 h-12" />

                                {/* Language Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${project.language === 'react' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                        project.language === 'vue' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                            'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                        }`}>
                                        {project.language}
                                    </span>
                                </div>

                                <div className="absolute inset-0 bg-white/50 dark:bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Link href={`/dashboard/snippets/${project.id}`}>
                                        <button className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:scale-105 transition-transform">
                                            Open Project
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">{project.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{project.createdAt}</p>
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(project.id, e)}
                                        className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                        title="Delete Project"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
                    <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5 mb-4">
                        <Layers className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No designs found</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm text-center mb-6">
                        You haven't saved any designs yet. Go to New Project to start converting.
                    </p>
                </div>
            )}
        </div>
    );
}
