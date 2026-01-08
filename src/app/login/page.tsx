'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Github, Chrome } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleSocialLogin = async (provider: string) => {
        setIsLoading(provider);
        try {
            await signIn(provider, { callbackUrl: '/dashboard' });
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-background to-background pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="glass-card p-8 rounded-2xl relative z-10 border border-white/10 bg-black/40 backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Welcome Back</h2>
                        <p className="text-muted-foreground mt-2 text-sm">Sign in to continue converting designs</p>
                    </div>

                    <div className="space-y-3 mb-8">
                        <button
                            onClick={() => handleSocialLogin('github')}
                            disabled={!!isLoading}
                            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading === 'github' ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Github className="w-5 h-5" />
                            )}
                            Continue with GitHub
                        </button>
                        <button
                            onClick={() => handleSocialLogin('google')}
                            disabled={!!isLoading}
                            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading === 'google' ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Chrome className="w-5 h-5" />
                            )}
                            Continue with Google
                        </button>
                    </div>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-transparent px-2 text-gray-500">Or continue with email</span>
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const email = formData.get('email') as string;
                        const password = formData.get('password') as string;

                        setIsLoading('credentials');
                        try {
                            const result = await signIn('credentials', {
                                email,
                                password,
                                callbackUrl: '/dashboard',
                                redirect: true,
                            });
                        } catch (error) {
                            console.error('Login error:', error);
                        } finally {
                            setIsLoading(null);
                        }
                    }}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white transition-colors">
                                <input type="checkbox" className="rounded border-gray-700 bg-gray-800 text-primary focus:ring-primary" />
                                Remember me
                            </label>
                            <Link href="#" className="text-primary hover:text-violet-400 transition-colors">Forgot password?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={!!isLoading}
                            className="w-full bg-primary hover:bg-violet-600 text-white font-medium py-3 rounded-xl transition-all hover:shadow-[0_0_20px_-5px_var(--primary)] active:scale-[0.98] flex items-center justify-center gap-2 group"
                        >
                            {isLoading === 'credentials' ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account?
                        <Link href="/signup" className="text-white hover:text-primary ml-1 font-medium transition-colors">Create account</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
