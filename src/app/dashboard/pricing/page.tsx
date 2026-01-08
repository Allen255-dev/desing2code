'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Crown } from 'lucide-react';
import { useProjects } from '@/context/ProjectsContext';
import { useRouter } from 'next/navigation';
import CheckoutModal from '@/components/CheckoutModal';
import { useSession } from 'next-auth/react';

const Tiers = [
    {
        name: 'Starter',
        price: '$0',
        description: 'Perfect for exploring the possibilities.',
        features: ['3 Generations per month', 'HTML + CSS only', 'Basic support', 'Community access'],
        icon: <Zap className="w-6 h-6 text-blue-500" />,
        buttonText: 'Current Plan',
        highlight: false,
        planId: 'starter'
    },
    {
        name: 'Pro',
        price: '$25',
        period: '/mo',
        description: 'For professional developers and designers.',
        features: [
            'Unlimited Generations',
            'React + Tailwind support',
            'Vue.js support',
            'One-click Download',
            'Priority Support'
        ],
        icon: <Crown className="w-6 h-6 text-primary" />,
        buttonText: 'Upgrade to Pro',
        highlight: true,
        planId: 'pro'
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'Advanced features for large teams.',
        features: [
            'API Access',
            'Custom Design Systems',
            'Dedicated Account Manager',
            'SSO & Security features',
            'Unlimited Team Members'
        ],
        icon: <Shield className="w-6 h-6 text-purple-500" />,
        buttonText: 'Contact Sales',
        highlight: false,
        planId: 'enterprise'
    }
];

export default function PricingPage() {
    const { data: session } = useSession();
    const { userPlan: contextPlan } = useProjects();
    const [selectedTier, setSelectedTier] = useState<typeof Tiers[0] | null>(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Sync plan from session
    const userPlan = (session?.user as any)?.plan || contextPlan;

    const handleUpgradeClick = (tier: typeof Tiers[0]) => {
        if (tier.planId === 'enterprise') {
            window.alert('Please contact sales for custom enterprise pricing.');
            return;
        }

        if (tier.planId === userPlan) return;

        setSelectedTier(tier);
        setIsCheckoutOpen(true);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                onSuccess={() => { }}
                tierName={selectedTier?.name || ''}
                price={selectedTier?.price || ''}
            />
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Simple, transparent pricing</h2>
                <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                    Choose the plan that's right for you and start converting designs to code faster than ever.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Tiers.map((tier, i) => (
                    <motion.div
                        key={tier.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`relative p-8 rounded-3xl border ${tier.highlight
                            ? 'border-primary ring-2 ring-primary/20 bg-primary/5 dark:bg-primary/10'
                            : 'border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50'
                            } flex flex-col`}
                    >
                        {tier.highlight && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Most Popular
                            </div>
                        )}

                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
                                    {tier.icon}
                                </div>
                                <h3 className="text-xl font-bold dark:text-white uppercase tracking-tight">{tier.name}</h3>
                            </div>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-bold dark:text-white">{tier.price}</span>
                                {tier.period && <span className="text-gray-500 dark:text-gray-400">{tier.period}</span>}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{tier.description}</p>
                        </div>

                        <div className="space-y-4 mb-8 flex-1">
                            {tier.features.map((feature) => (
                                <div key={feature} className="flex items-start gap-3">
                                    <div className="mt-1 p-0.5 rounded-full bg-green-500/20 text-green-500">
                                        <Check className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => handleUpgradeClick(tier)}
                            disabled={userPlan === tier.planId && tier.planId !== 'enterprise'}
                            className={`w-full py-4 rounded-2xl font-bold transition-all ${userPlan === tier.planId && tier.planId !== 'enterprise'
                                ? 'bg-gray-200 dark:bg-white/10 text-gray-400 cursor-not-allowed'
                                : tier.highlight
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-95'
                                    : 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10'
                                }`}
                        >
                            {userPlan === tier.planId && tier.planId !== 'enterprise' ? 'Current Plan' : tier.buttonText}
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 text-white relative overflow-hidden">
                <div className="relative z-10 md:flex items-center justify-between gap-10">
                    <div className="space-y-4 max-w-xl">
                        <h3 className="text-3xl font-bold">Need more power?</h3>
                        <p className="opacity-90">
                            Our advanced AI models can handle complex layouts, custom components, and even help you refactor your existing codebase.
                        </p>
                    </div>
                    <button className="mt-6 md:mt-0 px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:bg-gray-100 transition-colors whitespace-nowrap">
                        Talk to an Expert
                    </button>
                </div>
                {/* Background Decoration */}
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 blur-3xl rounded-full"></div>
                <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/10 blur-3xl rounded-full"></div>
            </div>
        </div>
    );
}
