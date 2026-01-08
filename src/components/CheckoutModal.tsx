'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Loader2, Crown, ArrowRight, AlertCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    tierName: string;
    price: string;
}

export default function CheckoutModal({ isOpen, onClose, tierName, price }: CheckoutModalProps) {
    const { data: session } = useSession();
    const [status, setStatus] = useState<'idle' | 'processing' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handlePayment = async () => {
        if (!session) {
            setErrorMessage('Please sign in to continue with the upgrade.');
            setStatus('error');
            return;
        }

        setStatus('processing');
        setErrorMessage('');

        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId: 'pro' }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to create checkout session');
            }

            const { url } = await response.json();
            if (url) {
                window.location.href = url;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (error: any) {
            console.error('[CHECKOUT_ERROR]', error);
            setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
            setStatus('error');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={status !== 'processing' ? onClose : undefined}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md bg-white dark:bg-[#0a0a0b] rounded-[32px] shadow-2xl overflow-hidden border border-white/10"
                >
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold dark:text-white">Upgrade Plan</h3>
                                <p className="text-gray-500 text-sm mt-1">Unlock all features with {tierName}</p>
                            </div>
                            <button
                                onClick={onClose}
                                disabled={status === 'processing'}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors disabled:opacity-50"
                            >
                                <X className="w-5 h-5 dark:text-gray-400" />
                            </button>
                        </div>

                        <div className="mb-8 overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center relative group">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Crown className="w-24 h-24 text-primary" />
                            </div>
                            <div className="relative z-10">
                                <span className="text-sm font-medium text-primary uppercase tracking-widest mb-2 block">{tierName}</span>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-5xl font-bold dark:text-white">{price}</span>
                                    <span className="text-gray-500 text-sm">/month</span>
                                </div>
                            </div>
                        </div>

                        {status === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 items-start"
                            >
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <button
                                onClick={handlePayment}
                                disabled={status === 'processing'}
                                className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {status === 'processing' ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Connecting to Stripe...
                                    </>
                                ) : (
                                    <>
                                        Proceed to Checkout
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                            <div className="text-[11px] text-gray-400 dark:text-gray-500 text-center flex items-center justify-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                <span>Secure payment powered by Stripe</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
