'use client';

import { Copy, Check, Terminal, Download } from 'lucide-react';
import { useState } from 'react';

interface CodeViewerProps {
    code: string;
    onChange?: (newCode: string) => void;
    filename?: string;
}

export default function CodeViewer({ code, onChange, filename = 'GeneratedComponent.tsx' }: CodeViewerProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([code], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden glass border border-white/10 bg-[#1e1e1e]">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="ml-3 text-xs font-mono text-gray-400 flex items-center gap-1.5">
                        <Terminal className="w-3 h-3" />
                        {filename} {onChange && <span className="text-secondary italic ml-2">(Editable)</span>}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md"
                    >
                        <Download className="w-3 h-3" />
                        Download
                    </button>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md"
                    >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied' : 'Copy Code'}
                    </button>
                </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 relative overflow-hidden">
                <textarea
                    value={code}
                    onChange={(e) => onChange?.(e.target.value)}
                    spellCheck={false}
                    className="absolute inset-0 w-full h-full p-4 font-mono text-sm leading-relaxed text-gray-300 bg-transparent resize-none focus:outline-none custom-scrollbar"
                />
            </div>
        </div>
    );
}
