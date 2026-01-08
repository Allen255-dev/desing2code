'use client';

import CodeViewer from '@/components/CodeViewer';
import Link from 'next/link';
import { ArrowLeft, Calendar, FileCode, Copy, Check } from 'lucide-react';
import { useProjects } from '@/context/ProjectsContext';
import { useState } from 'react';

import { use } from 'react';

export default function SnippetDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { projects, isLoading } = useProjects();
    const resolvedParams = use(params);
    const item = projects.find((i) => i.id === resolvedParams.id);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (item?.code) {
            navigator.clipboard.writeText(item.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (isLoading) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-gray-500 font-medium">Loading snippet...</p>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="p-4 rounded-full bg-red-500/10 text-red-500 mb-2">
                    <FileCode className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Snippet not found</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    The code snippet you are looking for does not exist or has been removed.
                </p>
                <Link
                    href="/dashboard/snippets"
                    className="mt-4 px-6 py-2.5 rounded-full bg-primary text-white font-medium hover:bg-violet-600 transition-colors"
                >
                    Return to History
                </Link>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-6 gap-6">
            <div className="flex flex-col gap-4">
                <Link
                    href="/dashboard/snippets"
                    className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white w-fit transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to History
                </Link>

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{item.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300">
                                <FileCode className="w-3.5 h-3.5" />
                                <span className="uppercase font-medium">{item.language}</span>
                            </span>
                            <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                                <Calendar className="w-3.5 h-3.5" />
                                {item.createdAt}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:scale-105 transition-all shadow-lg active:scale-95"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-200 dark:border-white/5 relative overflow-hidden flex flex-col">
                <div className="flex-1 overflow-hidden">
                    <CodeViewer code={item.code} />
                </div>
            </div>
        </div>
    );
}
