'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Code, Zap, Layers, Upload, Cpu, CheckCircle, Menu, X, ChevronDown } from 'lucide-react';

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[60] glass border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-white">
            Design2Code
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/signup">
              <button className="px-5 py-2 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all border border-white/5">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-gray-400 hover:text-white transition-colors py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full"
                >
                  <button className="w-full py-4 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/25">
                    Get Started Free
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-6">
              ✨ AI-Powered Conversion
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              Turn your Design <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                into Code instantly.
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-400 mb-10 leading-relaxed">
              Stop writing boilerplate. Upload your UI design and let our advanced AI
              convert it into clean, production-ready React & Tailwind code in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <button className="px-8 py-4 rounded-full bg-primary text-white font-medium hover:bg-violet-600 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_-5px_var(--primary)] text-lg flex items-center gap-2">
                  Start for Free <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/dashboard/new">
                <button className="px-8 py-4 rounded-full glass border border-white/10 text-white font-medium hover:bg-white/5 transition-all text-lg">
                  Live Demo
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Hero Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-screen opacity-50" />
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Upload}
              title="Drag & Drop Import"
              description="simply upload your PNG, JPG, or WEBP design files. We handle the rest automatically."
              delay={0.1}
            />
            <FeatureCard
              icon={Cpu}
              title="AI Analysis"
              description="Our engine recognizes buttons, inputs, and layouts to construct a semantic DOM tree."
              delay={0.2}
            />
            <FeatureCard
              icon={Code}
              title="Clean Code"
              description="Get production-ready React components styled with Tailwind CSS immediately."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How it works</h2>
            <p className="text-gray-400">From screenshot to source code in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <Step
              number="01"
              title="Upload Design"
              desc="Take a screenshot of any UI you like or upload your design file."
            />
            <Step
              number="02"
              title="Processing"
              desc="Our AI identifies components, colors, and typography instantly."
            />
            <Step
              number="03"
              title="Export Code"
              desc="Copy the generated TSX code directly into your VS Code project."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400">Scale your design-to-code workflow with the right plan</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              tier="Starter"
              price="0"
              features={["5 free conversions/mo", "HTML/CSS Output", "Standard Support"]}
              cta="Get Started"
              link="/signup"
            />
            <PricingCard
              tier="Pro"
              price="29"
              features={["Unlimited conversions", "React & Vue Support", "Priority Support", "Advanced Customization"]}
              cta="Go Pro"
              link="/dashboard/pricing"
              featured
            />
            <PricingCard
              tier="Enterprise"
              price="99"
              features={["Custom models", "Team collaboration", "Dedicated account manager", "SLA Support"]}
              cta="Contact Sales"
              link="/signup"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400">Everything you need to know about Design2Code</p>
          </div>

          <div className="space-y-6">
            <FAQItem
              question="What formats can I upload?"
              answer="We support high-resolution PNG, JPG, and WEBP files. For the best results, ensure the screenshot is clear and captures the full layout."
            />
            <FAQItem
              question="Is the generated code mobile-friendly?"
              answer="Yes! By default, our AI uses Tailwind's responsive utilities to ensure the generated code works beautifully across all breakpoints."
            />
            <FAQItem
              question="Can I export to other frameworks?"
              answer="Currently, we support React + Tailwind, Vue 3, and raw HTML/CSS. Support for Next.js, Angular, and Svelte is coming soon!"
            />
            <FAQItem
              question="How accurate is the AI conversion?"
              answer="Our models typically achieve 90-95% visual accuracy. While some complex custom logic may need manual adjustment, the layout and styling are handled automatically."
            />
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold text-white">Ready to speed up your workflow?</h2>
          <p className="text-gray-400 text-lg">
            Join thousands of developers using Design2Code to build faster.
          </p>
          <Link href="/signup">
            <button className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-all hover:scale-105">
              Get Started Now
            </button>
          </Link>

          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© 2024 Design2Code. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PricingCard({ tier, price, features, cta, link, featured = false }: { tier: string, price: string, features: string[], cta: string, link: string, featured?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`p-8 rounded-3xl flex flex-col relative ${featured ? 'bg-primary/10 border-2 border-primary shadow-[0_0_40px_-10px_var(--primary)] scale-105 z-10' : 'glass-card border border-white/5'}`}
    >
      {featured && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          Most Popular
        </span>
      )}
      <h3 className="text-xl font-bold text-white mb-2">{tier}</h3>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl font-bold text-white">${price}</span>
        <span className="text-gray-500 text-sm">/mo</span>
      </div>
      <ul className="space-y-4 mb-8 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-gray-400 text-sm">
            <CheckCircle className="w-4 h-4 text-primary shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Link href={link} className="w-full">
        <button className={`w-full py-3 rounded-2xl font-bold transition-all ${featured ? 'bg-primary text-white hover:bg-violet-600 shadow-lg shadow-primary/25' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}>
          {cta}
        </button>
      </Link>
    </motion.div>
  )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/5 rounded-2xl overflow-hidden glass-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-bold text-white">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-gray-500"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5 mt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="p-8 rounded-3xl glass-card border border-white/5 hover:border-white/10 transition-colors group"
    >
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}

function Step({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="relative z-10 text-center">
      <div className="w-24 h-24 mx-auto bg-black border border-white/10 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-xl shadow-black/50">
        {number}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 max-w-xs mx-auto">
        {desc}
      </p>
    </div>
  )
}
