'use client';

import { useState, useCallback } from 'react';
import { Upload, FileImage, X } from 'lucide-react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                handleFile(file);
            }
        }
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        onFileSelect(file);
    };

    const clearFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    if (selectedFile && previewUrl) {
        return (
            <div className="w-full h-full relative group rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-4" />
                <button
                    onClick={clearFile}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-red-500/80 text-white transition-colors backdrop-blur-md opacity-0 group-hover:opacity-100"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition-all duration-300 ${isDragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
        >
            <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileInput}
            />

            <div className={`p-6 rounded-full bg-white/5 mb-6 transition-transform duration-300 ${isDragOver ? 'scale-110' : ''}`}>
                <Upload className={`w-8 h-8 ${isDragOver ? 'text-primary' : 'text-gray-400'}`} />
            </div>

            <div className="text-center space-y-2">
                <h3 className="text-xl font-medium text-white">Upload your design</h3>
                <p className="text-sm text-gray-400 max-w-xs mx-auto">
                    Drag and drop your UI design here, or <label htmlFor="file-upload" className="text-primary hover:text-white cursor-pointer transition-colors font-medium">browse</label> to upload
                </p>
            </div>

            <div className="mt-8 flex gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <FileImage className="w-3 h-3" /> JPG, PNG, WEBP
                </div>
                <div>Max 10MB</div>
            </div>
        </div>
    );
}
