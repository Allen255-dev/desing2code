'use client';

import { useEffect, useRef, useState } from 'react';
import { Smartphone, Tablet, Monitor } from 'lucide-react';

interface LivePreviewProps {
    code: string;
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

const VIEWPORT_WIDTHS = {
    mobile: '375px',
    tablet: '768px',
    desktop: '100%',
};

export default function LivePreview({ code }: LivePreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [size, setSize] = useState<ViewportSize>('desktop');

    useEffect(() => {
        if (!iframeRef.current || !code) return;

        const doc = iframeRef.current.contentDocument;
        if (!doc) return;

        // Detect language/framework
        const isReact = code.includes('import React') || code.includes('export default function');
        const isVue = code.includes('<template>') || code.includes('<script setup>');

        let htmlContent = '';

        if (isReact) {
            // Transform React to something the browser can run via Babel Standalone
            const cleanCode = code
                .replace(/import\s+.*\s+from\s+['"].*['"];?/g, '') // Remove imports
                .replace(/export\s+default\s+/, ''); // Remove export default

            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                    <style>
                        body { margin: 0; padding: 0; }
                    </style>
                </head>
                <body>
                    <div id="root"></div>
                    <script type="text/babel">
                        ${cleanCode}
                        const Root = () => {
                            try {
                                const Component = typeof Hero !== 'undefined' ? Hero : 
                                                typeof App !== 'undefined' ? App :
                                                () => <div>Component Defined</div>;
                                return <Component />;
                            } catch (e) {
                                return <div className="p-4 text-red-500">Render Error: {e.message}</div>;
                            }
                        };
                        const root = ReactDOM.createRoot(document.getElementById('root'));
                        root.render(<Root />);
                    </script>
                </body>
                </html>
            `;
        } else if (isVue) {
            // Simple Vue 3 CDN approach
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
                    <style>body { margin: 0; }</style>
                </head>
                <body>
                    <div id="app"></div>
                    <script>
                        const { createApp } = Vue;
                        // Very basic Vue template extraction for the mock
                        const template = \`${code.match(/<template>([\s\S]*?)<\/template>/)?.[1] || '<div>Vue Template Error</div>'}\`;
                        createApp({
                            template: template
                        }).mount('#app');
                    </script>
                </body>
                </html>
            `;
        } else {
            // Pure HTML
            if (!code.includes('<html')) {
                htmlContent = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <script src="https://cdn.tailwindcss.com"></script>
                    </head>
                    <body>${code}</body>
                    </html>
                `;
            } else {
                htmlContent = code;
            }
        }

        doc.open();
        doc.write(htmlContent);
        doc.close();
    }, [code]);

    return (
        <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-black/40">
            {/* Viewport Toggles */}
            <div className="flex items-center justify-center gap-2 p-2 border-b border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                <button
                    onClick={() => setSize('mobile')}
                    className={`p-1.5 rounded-md transition-all ${size === 'mobile' ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                    title="Mobile View"
                >
                    <Smartphone className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setSize('tablet')}
                    className={`p-1.5 rounded-md transition-all ${size === 'tablet' ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                    title="Tablet View"
                >
                    <Tablet className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setSize('desktop')}
                    className={`p-1.5 rounded-md transition-all ${size === 'desktop' ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                    title="Desktop View"
                >
                    <Monitor className="w-4 h-4" />
                </button>
                <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 mx-1" />
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                    {size === 'desktop' ? 'Full Width' : VIEWPORT_WIDTHS[size]}
                </span>
            </div>

            {/* Iframe Container */}
            <div className="flex-1 overflow-auto p-4 flex justify-center items-start custom-scrollbar">
                <div
                    style={{ width: VIEWPORT_WIDTHS[size] }}
                    className={`h-full bg-white transition-all duration-300 shadow-2xl rounded-lg overflow-hidden border border-black/5 ${size !== 'desktop' ? 'aspect-[9/16] h-[calc(100%-20px)] mt-2' : 'w-full h-full'}`}
                >
                    <iframe
                        ref={iframeRef}
                        title="Live Preview"
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-popups allow-modals allow-same-origin"
                    />
                </div>
            </div>
        </div>
    );
}
