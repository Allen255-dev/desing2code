'use client';

import { Code, Copy, Check, Clock, FileJson, FileCode, Monitor, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useProjects } from '@/context/ProjectsContext';

export default function SnippetsPage() {
    const { projects, deleteProject } = useProjects();
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (id: string, code: string) => {
        setCopiedId(id);
        navigator.clipboard.writeText(code).catch(err => console.error('Failed to copy', err));
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to delete this generation from history?')) {
            deleteProject(id);
        }
    };

    const getLanguageIcon = (lang: string) => {
        switch (lang) {
            case 'react': return <FileCode className="w-5 h-5 text-blue-400" />;
            case 'vue': return <Monitor className="w-5 h-5 text-green-400" />;
            case 'html': return <FileJson className="w-5 h-5 text-orange-400" />;
            default: return <Code className="w-5 h-5 text-gray-400" />;
        }
    };

    const getLanguageLabel = (lang: string) => {
        switch (lang) {
            case 'react': return 'React + Tailwind';
            case 'vue': return 'Vue.js';
            case 'html': return 'HTML5';
            default: return lang.toUpperCase();
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Generation History</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Archive of your generated components and designs</p>
                </div>
            </div>

            {projects.length > 0 ? (
                <div className="space-y-4">
                    {projects.map((item) => (
                        <div
                            key={item.id}
                            className="glass-card p-6 rounded-2xl group hover:bg-black/5 dark:hover:bg-white/5 transition-all bg-white/50 dark:bg-black/50 border border-black/5 dark:border-white/5"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-5">
                                    <div className="p-3 rounded-xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10">
                                        {getLanguageIcon(item.language)}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${item.language === 'react' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' :
                                                item.language === 'vue' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' :
                                                    'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
                                                }`}>
                                                {getLanguageLabel(item.language)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                                            <Clock className="w-3 h-3" />
                                            <span>Generated {item.createdAt}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pl-16 md:pl-0">
                                    <Link href={`/dashboard/snippets/${item.id}`}>
                                        <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                            View Code
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => handleCopy(item.id, item.code)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors border border-black/5 dark:border-white/5"
                                    >
                                        {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copiedId === item.id ? 'Copied' : 'Copy'}
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(item.id, e)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                        title="Delete from History"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
                    <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5 mb-4">
                        <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No history yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm text-center mb-6">
                        Your generated code snippets will appear here once you start converting designs.
                    </p>
                    <Link href="/dashboard/new">
                        <button className="bg-primary hover:bg-violet-600 text-white px-6 py-2.5 rounded-full font-medium transition-colors">
                            Start Converting
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}
