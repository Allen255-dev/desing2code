'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Loader2, Code, ChevronDown, Save, Send, Sparkles, Upload, Figma, Globe, Image as ImageIcon, X } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import FigmaInput from '@/components/FigmaInput';
import UrlInput from '@/components/UrlInput';
import CodeViewer from '@/components/CodeViewer';
// Removed LivePreview import
import { useProjects } from '@/context/ProjectsContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

const MOCK_GENERATED_CODE = `import React from 'react';
// ... mock code removed for brevity
`;

export default function NewProjectPage() {
    const [file, setFile] = useState<File | null>(null);
    const [fetchedImage, setFetchedImage] = useState<string | null>(null);
    const [sourceType, setSourceType] = useState<'upload' | 'figma' | 'url'>('upload');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);

    // New State for Language
    const [selectedLanguage, setSelectedLanguage] = useState<'react' | 'vue' | 'html'>('react');

    const [projectName, setProjectName] = useState('');
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

    // Refinement State
    const [refinementPrompt, setRefinementPrompt] = useState('');
    const [isRefining, setIsRefining] = useState(false);

    const { data: session } = useSession();
    const { addProject, userPlan: contextPlan } = useProjects();
    const router = useRouter();

    const userPlan = (session?.user as any)?.plan || contextPlan;
    const isPro = userPlan === 'pro' || userPlan === 'enterprise';

    const handleRefine = () => {
        if (!refinementPrompt.trim() || !generatedCode) return;

        setIsRefining(true);

        // Simulate Refinement with more "Intelligence"
        setTimeout(() => {
            let updatedCode = generatedCode;
            const prompt = refinementPrompt.toLowerCase();

            // 1. Color Refinement
            const colors: Record<string, string> = {
                'dark': 'slate-950',
                'light': 'gray-50',
                'red': 'red-600',
                'blue': 'blue-600',
                'green': 'emerald-600',
                'indigo': 'indigo-600',
                'purple': 'violet-600',
                'pink': 'pink-600'
            };

            Object.entries(colors).forEach(([name, value]) => {
                if (prompt.includes(name)) {
                    // Replace background colors
                    updatedCode = updatedCode.replace(/bg-(?:[a-z]+)-(?:[1-9]00|950)/g, `bg-${value}`);
                    // Replace button colors specially
                    updatedCode = updatedCode.replace(/indigo-600/g, value);
                    updatedCode = updatedCode.replace(/indigo-700/g, value.replace('600', '700'));
                }
            });

            // 2. Shape / Rounded Refinement
            if (prompt.includes('round') || prompt.includes('circle')) {
                const size = prompt.includes('more') || prompt.includes('full') ? 'full' : '2xl';
                updatedCode = updatedCode.replace(/rounded-(?:lg|xl|md)/g, `rounded-${size}`);
            }

            // 3. Spacing / Padding Refinement
            if (prompt.includes('padding') || prompt.includes('space') || prompt.includes('gap')) {
                if (prompt.includes('more') || prompt.includes('increase') || prompt.includes('large')) {
                    updatedCode = updatedCode.replace(/p-([1-9])/g, (m, p1) => `p-${parseInt(p1) + 4}`);
                    updatedCode = updatedCode.replace(/px-([1-9])/g, (m, p1) => `px-${parseInt(p1) + 4}`);
                    updatedCode = updatedCode.replace(/gap-([1-9])/g, (m, p1) => `gap-${parseInt(p1) + 4}`);
                } else if (prompt.includes('less') || prompt.includes('decrease') || prompt.includes('small')) {
                    updatedCode = updatedCode.replace(/p-([1-9])/g, (m, p1) => `p-${Math.max(1, parseInt(p1) - 2)}`);
                }
            }

            // 4. Contrast / Text Refinement
            if (prompt.includes('dark mode')) {
                updatedCode = updatedCode.replace(/bg-white/g, 'bg-slate-950')
                    .replace(/text-gray-900/g, 'text-white')
                    .replace(/text-gray-400/g, 'text-slate-400');
            } else if (prompt.includes('light mode')) {
                updatedCode = updatedCode.replace(/bg-gray-900/g, 'bg-white')
                    .replace(/bg-slate-950/g, 'bg-white')
                    .replace(/text-white/g, 'text-gray-900');
            }

            // 5. Shadows
            if (prompt.includes('shadow')) {
                updatedCode = updatedCode.replace(/shadow-(?:sm|md|lg)/g, 'shadow-2xl shadow-primary/20');
                if (!updatedCode.includes('shadow')) {
                    updatedCode = updatedCode.replace(/rounded-([a-z0-9]+)/g, 'rounded-$1 shadow-lg');
                }
            }

            setGeneratedCode(updatedCode);
            setIsRefining(false);
            setRefinementPrompt('');
        }, 1500);
    };

    const handleGenerate = async () => {
        if ((!file && !fetchedImage) || !projectName.trim()) return;

        // Gating Check
        if (!isPro && (selectedLanguage === 'react' || selectedLanguage === 'vue')) {
            window.alert('React and Vue support are PRO features. Please upgrade your plan!');
            router.push('/dashboard/pricing');
            return;
        }

        setIsGenerating(true);
        setGeneratedCode(null);

        try {
            const base64Image = fetchedImage || (file ? await fileToBase64(file) : null);

            if (!base64Image) {
                throw new Error('No design source provided');
            }

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageBase64: base64Image,
                    language: selectedLanguage,
                    description: `Generated from ${sourceType}. Project: ${projectName}`
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to generate code');
            }

            const data = await response.json();
            setGeneratedCode(data.code);
        } catch (error: any) {
            console.error('Generation error:', error);
            window.alert(error.message || 'Something went wrong during code generation.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        if (!generatedCode || !projectName.trim()) return;

        addProject({
            name: projectName,
            description: `Generated from ${file?.name || 'screenshot'}`,
            language: selectedLanguage,
            code: generatedCode
        });

        router.push('/dashboard/projects');
    };

    return (
        <div className="h-full flex flex-col p-6 gap-6 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">New Conversion</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Upload a screenshot to generate code</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Project Name Input */}
                    <input
                        type="text"
                        placeholder="Project Name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 w-48 placeholder:text-gray-400"
                    />

                    {/* Language Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                            className="flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg pl-4 pr-3 py-2.5 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[180px] justify-between"
                        >
                            <span>
                                {selectedLanguage === 'react' && 'React + Tailwind'}
                                {selectedLanguage === 'vue' && 'Vue.js 3'}
                                {selectedLanguage === 'html' && 'HTML + CSS'}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isLanguageDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="absolute right-0 top-full mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg shadow-xl overflow-hidden z-50"
                                >
                                    {[
                                        { id: 'react', label: 'React + Tailwind', pro: true },
                                        { id: 'vue', label: 'Vue.js 3', pro: true },
                                        { id: 'html', label: 'HTML + CSS', pro: false }
                                    ].map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => {
                                                if (option.pro && !isPro) {
                                                    window.alert('This language is only available for PRO users.');
                                                    router.push('/dashboard/pricing');
                                                    return;
                                                }
                                                setSelectedLanguage(option.id as any);
                                                setIsLanguageDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${selectedLanguage === option.id
                                                ? 'bg-primary/10 text-primary font-medium'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                                }`}
                                        >
                                            <span>{option.label}</span>
                                            {option.pro && !isPro && (
                                                <span className="text-[10px] font-bold bg-primary text-white px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                    Pro
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {((file || fetchedImage)) && !generatedCode && !isGenerating && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={handleGenerate}
                            disabled={!projectName.trim()}
                            className="bg-primary hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-[0_0_20px_-5px_var(--primary)] flex items-center gap-2"
                        >
                            <Wand2 className="w-4 h-4" />
                            Generate Code
                        </motion.button>
                    )}
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                {/* Left Panel: Upload/Preview */}
                <div className="h-full flex flex-col gap-4">
                    <div className="bg-gray-100 dark:bg-white/5 rounded-t-xl px-4 py-2 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                        <div className="flex gap-4">
                            {[
                                { id: 'upload' as const, icon: Upload, label: 'Upload' },
                                { id: 'figma' as const, icon: Figma, label: 'Figma' },
                                { id: 'url' as const, icon: Globe, label: 'Website' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setSourceType(tab.id);
                                        setFile(null);
                                        setFetchedImage(null);
                                    }}
                                    className={`flex items-center gap-2 py-1 px-3 rounded-md text-xs font-medium transition-all ${sourceType === tab.id
                                        ? 'bg-primary/20 text-primary border border-primary/30'
                                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    <tab.icon className="w-3.5 h-3.5" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 min-h-0 bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative">
                        {fetchedImage ? (
                            <div className="w-full h-full relative group p-4">
                                <img src={fetchedImage} alt="Fetched" className="w-full h-full object-contain" />
                                <button
                                    onClick={() => setFetchedImage(null)}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-red-500/80 text-white transition-all backdrop-blur-md"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <>
                                {sourceType === 'upload' && <FileUpload onFileSelect={setFile} />}
                                {sourceType === 'figma' && <FigmaInput onImageFetched={setFetchedImage} />}
                                {sourceType === 'url' && <UrlInput onImageFetched={setFetchedImage} />}
                            </>
                        )}
                    </div>
                </div>

                {/* Right Panel: Code/Output */}
                <div className="h-full flex flex-col gap-4 relative">
                    <div className="bg-gray-100 dark:bg-white/5 rounded-t-xl px-4 py-2 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Output</span>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 bg-gray-50 dark:bg-black/20 rounded-2xl border border-black/5 dark:border-white/5 relative overflow-hidden flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {!generatedCode && !isGenerating && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center text-gray-400 dark:text-gray-500"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-4 border border-black/5 dark:border-white/5">
                                        <Code className="w-8 h-8 opacity-50" />
                                    </div>
                                    <p>Generated code will appear here</p>
                                </motion.div>
                            )}

                            {isGenerating && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center"
                                >
                                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                                    <p className="text-gray-900 dark:text-white font-medium">Analyzing design...</p>
                                    <p className="text-sm text-gray-500 mt-1">Detecting components and layout</p>
                                </motion.div>
                            )}

                            {generatedCode && !isGenerating && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full h-full"
                                >
                                    <CodeViewer
                                        code={generatedCode}
                                        onChange={setGeneratedCode}
                                        filename={
                                            selectedLanguage === 'react' ? 'GeneratedComponent.tsx' :
                                                selectedLanguage === 'vue' ? 'GeneratedComponent.vue' :
                                                    'index.html'
                                        }
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* AI Refinement Input */}
                    <AnimatePresence>
                        {generatedCode && !isGenerating && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="space-y-4"
                            >
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-violet-600 rounded-xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
                                    <div className="relative flex items-center gap-2 bg-white dark:bg-[#1e1e1e] border border-black/10 dark:border-white/10 rounded-xl p-1.5 pl-4 shadow-sm">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                        <input
                                            type="text"
                                            placeholder="Ask AI to refine this code... (e.g., 'Make it dark mode')"
                                            value={refinementPrompt}
                                            onChange={(e) => setRefinementPrompt(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                                            disabled={isRefining}
                                            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
                                        />
                                        <button
                                            onClick={handleRefine}
                                            disabled={isRefining || !refinementPrompt.trim()}
                                            className="bg-primary hover:bg-violet-600 disabled:opacity-50 text-white p-2 rounded-lg transition-all flex items-center gap-2"
                                        >
                                            {isRefining ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Send className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Save Button (Static Footer) */}
                    <AnimatePresence>
                        {generatedCode && !isGenerating && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="flex justify-end pt-2"
                            >
                                <button
                                    onClick={handleSave}
                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-green-500/20 flex items-center gap-2 transform transition-transform hover:scale-105"
                                >
                                    <Save className="w-5 h-5" />
                                    Save Project
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>


        </div>
    );
}
