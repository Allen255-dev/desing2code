'use client';

import { User as UserType } from '@/types/user';
import { motion } from 'framer-motion';
import { Settings, LogOut, Code, Layout, Github } from 'lucide-react';
import Link from 'next/link';

// Mock user data for the skeleton
const mockUser: UserType = {
    id: '1',
    name: 'Alex Designer',
    email: 'alex@design.co',
    role: 'designer',
    bio: 'Passionate about creating beautiful user interfaces and converting them to clean code.',
    createdAt: new Date('2024-01-01'),
};

export default function ProfilePage() {
    return (
        <div className="min-h-screen p-8 pt-24 max-w-7xl mx-auto space-y-8">
            {/* Header / Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-3xl p-8 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-20" />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-end pt-12">
                    <div className="w-32 h-32 rounded-full border-4 border-black bg-zinc-800 flex items-center justify-center text-4xl font-bold text-gray-400 shadow-2xl">
                        {mockUser.name.charAt(0)}
                    </div>

                    <div className="flex-1 space-y-2">
                        <h1 className="text-4xl font-bold text-white">{mockUser.name}</h1>
                        <p className="text-gray-400 flex items-center gap-2">
                            {mockUser.role.charAt(0).toUpperCase() + mockUser.role.slice(1)}
                            <span className="w-1 h-1 rounded-full bg-gray-600" />
                            {mockUser.email}
                        </p>
                        <div className="flex gap-3 pt-2">
                            <span className="px-3 py-1 rounded-full bg-white/5 text-xs border border-white/10 text-gray-300">UI/UX</span>
                            <span className="px-3 py-1 rounded-full bg-white/5 text-xs border border-white/10 text-gray-300">React</span>
                            <span className="px-3 py-1 rounded-full bg-white/5 text-xs border border-white/10 text-gray-300">Tailwind</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="p-3 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white border border-transparent hover:border-white/10">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button className="p-3 rounded-full hover:bg-red-500/10 transition-colors text-gray-400 hover:text-red-400 border border-transparent hover:border-red-500/20">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Stats & Bio */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-8"
                >
                    <div className="glass-card p-6 rounded-2xl space-y-4">
                        <h3 className="text-lg font-semibold text-white">About</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            {mockUser.bio}
                        </p>
                        <div className="pt-4 border-t border-white/5 flex gap-4">
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-white/5 rounded-xl">
                            <div className="text-2xl font-bold text-white">12</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Projects</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl">
                            <div className="text-2xl font-bold text-white">48</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Snippets</div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Recent Projects */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="md:col-span-2 space-y-6"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-white">Recent Conversions</h3>
                        <button className="text-sm text-primary hover:text-violet-400 transition-colors">View All</button>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="glass-card p-4 rounded-xl flex items-center gap-4 group hover:bg-white/5 transition-colors cursor-pointer">
                                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-800 to-black flex items-center justify-center border border-white/5">
                                    {item % 2 === 0 ? <Code className="text-gray-600" /> : <Layout className="text-gray-600" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-medium group-hover:text-primary transition-colors">E-Commerce Dashboard UI</h4>
                                    <p className="text-xs text-gray-500 mt-1">Converted 2 days ago • React + Tailwind</p>
                                </div>
                                <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors border border-white/5">
                                    Open
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
