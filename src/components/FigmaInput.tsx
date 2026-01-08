import { useState } from 'react';
import { Figma, Key, Loader2, ArrowRight } from 'lucide-react';

interface FigmaInputProps {
    onImageFetched: (base64: string) => void;
}

export default function FigmaInput({ onImageFetched }: FigmaInputProps) {
    const [figmaUrl, setFigmaUrl] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFetch = async () => {
        if (!figmaUrl || !accessToken) return;

        setIsFetching(true);
        setError(null);

        try {
            const response = await fetch('/api/figma', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ figmaUrl, accessToken }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch Figma design');
            }

            onImageFetched(data.image);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 space-y-6">
            <div className="p-4 rounded-full bg-[#F24E1E]/10">
                <Figma className="w-10 h-10 text-[#F24E1E]" />
            </div>

            <div className="text-center space-y-2">
                <h3 className="text-xl font-medium text-white">Import from Figma</h3>
                <p className="text-sm text-gray-400 max-w-sm mx-auto">
                    Enter your Figma frame URL and Personal Access Token to import your design.
                </p>
            </div>

            <div className="w-full max-w-md space-y-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Figma URL</label>
                    <div className="relative group">
                        <Figma className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="https://www.figma.com/design/..."
                            value={figmaUrl}
                            onChange={(e) => setFigmaUrl(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Access Token</label>
                        <a
                            href="https://www.figma.com/developers/api#access-tokens"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-primary hover:underline"
                        >
                            How to get this?
                        </a>
                    </div>
                    <div className="relative group">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                        <input
                            type="password"
                            placeholder="figd_..."
                            value={accessToken}
                            onChange={(e) => setAccessToken(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-red-500 text-center animate-shake">{error}</p>
                )}

                <button
                    onClick={handleFetch}
                    disabled={isFetching || !figmaUrl || !accessToken}
                    className="w-full py-3 bg-primary hover:bg-violet-600 disabled:opacity-50 text-white rounded-xl font-medium transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                    {isFetching ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Fetching Design...
                        </>
                    ) : (
                        <>
                            Fetch Design
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
