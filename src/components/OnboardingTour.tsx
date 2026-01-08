'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface TourStep {
    targetId: string;
    title: string;
    description: string;
    position: 'bottom' | 'top' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
    {
        targetId: 'tour-new-project',
        title: 'Start Converting',
        description: 'Upload your first design screenshot here to convert it into high-quality code.',
        position: 'right'
    },
    {
        targetId: 'tour-projects',
        title: 'Your Library',
        description: 'All your generated designs are saved here. You can search, edit and export them anytime.',
        position: 'right'
    },
    {
        targetId: 'tour-pricing',
        title: 'Go Pro',
        description: 'Unlock React and Vue.js exports by upgrading to a Pro plan.',
        position: 'right'
    },
    {
        targetId: 'tour-settings',
        title: 'Configure AI',
        description: 'Add your own API keys in Settings to enable real-time "Turbo" generation.',
        position: 'right'
    }
];

export default function OnboardingTour() {
    const [currentStep, setCurrentStep] = useState(-1);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('d2c_tour_seen');
        if (!hasSeenTour) {
            // Delay start slightly for layout stabilization
            const timer = setTimeout(() => setCurrentStep(0), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        if (currentStep >= 0 && currentStep < TOUR_STEPS.length) {
            const step = TOUR_STEPS[currentStep];
            const element = document.getElementById(step.targetId);
            if (element) {
                setTargetRect(element.getBoundingClientRect());
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            setTargetRect(null);
        }
    }, [currentStep]);

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        localStorage.setItem('d2c_tour_seen', 'true');
        setCurrentStep(-1);
    };

    if (currentStep === -1 || !targetRect) return null;

    const step = TOUR_STEPS[currentStep];

    const getTooltipStyle = () => {
        if (!targetRect) return {};
        const padding = 12;
        switch (step.position) {
            case 'right':
                return {
                    top: targetRect.top + targetRect.height / 2,
                    left: targetRect.right + padding,
                    transform: 'translateY(-50%)'
                };
            case 'bottom':
                return {
                    top: targetRect.bottom + padding,
                    left: targetRect.left + targetRect.width / 2,
                    transform: 'translateX(-50%)'
                };
            default:
                return { top: targetRect.bottom, left: targetRect.left };
        }
    };

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none">
            {/* Backdrop with Hole */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto" onClick={handleComplete} />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    style={getTooltipStyle()}
                    className="absolute w-80 bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl border border-primary/20 pointer-events-auto"
                >
                    {/* Arrow */}
                    <div className={`absolute w-3 h-3 bg-white dark:bg-gray-900 border-l border-t border-primary/20 rotate-[-45deg] ${step.position === 'right' ? '-left-1.5 top-1/2 -translate-y-1/2' : ''
                        }`} />

                    <div className="flex items-center gap-2 mb-3 text-primary">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Step {currentStep + 1} of {TOUR_STEPS.length}</span>
                    </div>

                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                        {step.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                            {TOUR_STEPS.map((_, i) => (
                                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentStep ? 'bg-primary' : 'bg-gray-200 dark:bg-white/10'}`} />
                            ))}
                        </div>

                        <div className="flex gap-2">
                            {currentStep > 0 && (
                                <button
                                    onClick={handleBack}
                                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                className="bg-primary hover:bg-violet-600 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-1 group"
                            >
                                {currentStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleComplete}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </motion.div>
            </AnimatePresence>

            {/* Target Highlight Effect */}
            {targetRect && (
                <motion.div
                    layoutId="tour-highlight"
                    style={{
                        top: targetRect.top - 4,
                        left: targetRect.left - 4,
                        width: targetRect.width + 8,
                        height: targetRect.height + 8,
                    }}
                    className="absolute border-2 border-primary rounded-xl ring-4 ring-primary/20 pointer-events-none z-[101]"
                />
            )}
        </div>
    );
}
