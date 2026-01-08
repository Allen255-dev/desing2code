'use client';

import { useState, useEffect } from 'react';
import { Save, Key, User, Shield, Bell, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

type TabType = 'ai' | 'profile' | 'security' | 'notifications';

type NotificationPreferences = {
    emailNotifications: boolean;
    projectUpdates: boolean;
    marketingEmails: boolean;
};

export default function SettingsPage() {
    const { data: session, update: updateSession } = useSession();
    const [activeTab, setActiveTab] = useState<TabType>('ai');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // AI Settings state
    const [apiKey, setApiKey] = useState('');

    // Profile state
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        image: '',
        role: 'developer' as 'designer' | 'developer' | 'admin',
    });

    // Notification preferences state
    const [notifications, setNotifications] = useState<NotificationPreferences>({
        emailNotifications: true,
        projectUpdates: true,
        marketingEmails: false,
    });

    // Load data on mount
    useEffect(() => {
        // Load API key
        const savedKey = localStorage.getItem('d2c_api_key');
        if (savedKey) setApiKey(savedKey);

        // Load profile data from session
        if (session?.user) {
            setProfileData({
                name: session.user.name || '',
                email: session.user.email || '',
                image: session.user.image || '',
                role: (session.user as any).role || 'developer',
            });
        }

        // Load notification preferences
        const savedPrefs = localStorage.getItem('d2c_notifications');
        if (savedPrefs) {
            try {
                setNotifications(JSON.parse(savedPrefs));
            } catch (e) {
                console.error('Failed to parse notification preferences');
            }
        }
    }, [session]);

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleSaveAI = () => {
        setIsSaving(true);
        setTimeout(() => {
            localStorage.setItem('d2c_api_key', apiKey);
            setIsSaving(false);
            showMessage('success', 'API key saved successfully!');
        }, 800);
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update profile');
            }

            // Update the session with new data
            await updateSession();

            showMessage('success', 'Profile updated successfully!');
        } catch (error: any) {
            showMessage('error', error.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveNotifications = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/user/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notifications),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update preferences');
            }

            // Save to localStorage
            localStorage.setItem('d2c_notifications', JSON.stringify(notifications));

            showMessage('success', 'Notification preferences saved!');
        } catch (error: any) {
            showMessage('error', error.message || 'Failed to save preferences');
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'ai' as TabType, name: 'AI Settings', icon: Key },
        { id: 'profile' as TabType, name: 'Profile', icon: User },
        { id: 'security' as TabType, name: 'Security', icon: Shield },
        { id: 'notifications' as TabType, name: 'Notifications', icon: Bell },
    ];

    return (
        <div className="p-8 max-w-4xl space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Configure your account and AI preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar */}
                <div className="space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.name}
                            </button>
                        );
                    })}
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <AnimatePresence mode="wait">
                        {/* AI Settings Tab */}
                        {activeTab === 'ai' && (
                            <motion.div
                                key="ai"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="glass-card p-6 rounded-2xl border border-black/5 dark:border-white/5 space-y-6">
                                    <div className="flex items-center gap-3 mb-2 text-gray-900 dark:text-white font-bold">
                                        <Key className="w-5 h-5 text-primary" />
                                        <h3>AI Configuration</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                OpenAI / Gemini API Key
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    placeholder="sk-..."
                                                    value={apiKey}
                                                    onChange={(e) => setApiKey(e.target.value)}
                                                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                                                Your API key is stored locally in your browser and is only used to facilitate real-time conversions. We never transmit your key to our servers.
                                            </p>
                                        </div>

                                        <div className="pt-4 flex items-center justify-between">
                                            {message && activeTab === 'ai' && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className={`text-sm font-medium ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}
                                                >
                                                    {message.text}
                                                </motion.span>
                                            )}
                                            <div className="flex-1" />
                                            <button
                                                onClick={handleSaveAI}
                                                disabled={isSaving}
                                                className="px-6 py-2.5 bg-primary hover:bg-violet-600 text-white rounded-full font-bold shadow-lg shadow-primary/25 transition-all flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {isSaving ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Save className="w-4 h-4" />
                                                )}
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-card p-6 rounded-2xl border border-black/5 dark:border-white/5 bg-amber-500/5 border-amber-500/10">
                                    <h4 className="text-amber-500 font-bold mb-2 flex items-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        Privacy Note
                                    </h4>
                                    <p className="text-sm text-amber-500/80 leading-relaxed">
                                        Providing an API key will enable "Turbo" generation. Free users with an API key can bypass some framework restrictions during development.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="glass-card p-6 rounded-2xl border border-black/5 dark:border-white/5 space-y-6">
                                    <div className="flex items-center gap-3 mb-2 text-gray-900 dark:text-white font-bold">
                                        <User className="w-5 h-5 text-primary" />
                                        <h3>Profile Information</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                placeholder="Your name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                placeholder="your.email@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Avatar URL
                                            </label>
                                            <input
                                                type="url"
                                                value={profileData.image}
                                                onChange={(e) => setProfileData({ ...profileData, image: e.target.value })}
                                                className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                placeholder="https://example.com/avatar.jpg"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Role
                                            </label>
                                            <select
                                                value={profileData.role}
                                                onChange={(e) => setProfileData({ ...profileData, role: e.target.value as any })}
                                                className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            >
                                                <option value="developer">Developer</option>
                                                <option value="designer">Designer</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>

                                        <div className="pt-4 flex items-center justify-between">
                                            {message && activeTab === 'profile' && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className={`text-sm font-medium ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}
                                                >
                                                    {message.text}
                                                </motion.span>
                                            )}
                                            <div className="flex-1" />
                                            <button
                                                onClick={handleSaveProfile}
                                                disabled={isSaving}
                                                className="px-6 py-2.5 bg-primary hover:bg-violet-600 text-white rounded-full font-bold shadow-lg shadow-primary/25 transition-all flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {isSaving ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Save className="w-4 h-4" />
                                                )}
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <motion.div
                                key="security"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="glass-card p-6 rounded-2xl border border-black/5 dark:border-white/5 space-y-6">
                                    <div className="flex items-center gap-3 mb-2 text-gray-900 dark:text-white font-bold">
                                        <Shield className="w-5 h-5 text-primary" />
                                        <h3>Security Settings</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                            <h4 className="text-blue-500 font-semibold mb-2">OAuth Authentication</h4>
                                            <p className="text-sm text-blue-500/80 leading-relaxed">
                                                Your account is secured through OAuth (Google/GitHub). Password management is handled by your authentication provider. To change your password, please visit your provider's account settings.
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                                Connected Accounts
                                            </h4>
                                            <div className="space-y-2">
                                                {session?.user?.email && (
                                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                                <User className="w-4 h-4 text-primary" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {session.user.email}
                                                                </p>
                                                                <p className="text-xs text-gray-500">Primary account</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs text-green-500 font-medium">Connected</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <motion.div
                                key="notifications"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="glass-card p-6 rounded-2xl border border-black/5 dark:border-white/5 space-y-6">
                                    <div className="flex items-center gap-3 mb-2 text-gray-900 dark:text-white font-bold">
                                        <Bell className="w-5 h-5 text-primary" />
                                        <h3>Notification Preferences</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                                                <p className="text-xs text-gray-500 mt-1">Receive email updates about your account</p>
                                            </div>
                                            <button
                                                onClick={() => setNotifications({ ...notifications, emailNotifications: !notifications.emailNotifications })}
                                                className={`relative w-12 h-6 rounded-full transition-colors ${notifications.emailNotifications ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                                                    }`}
                                            >
                                                <div
                                                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${notifications.emailNotifications ? 'translate-x-6' : 'translate-x-0'
                                                        }`}
                                                />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Project Updates</h4>
                                                <p className="text-xs text-gray-500 mt-1">Get notified when your projects are processed</p>
                                            </div>
                                            <button
                                                onClick={() => setNotifications({ ...notifications, projectUpdates: !notifications.projectUpdates })}
                                                className={`relative w-12 h-6 rounded-full transition-colors ${notifications.projectUpdates ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                                                    }`}
                                            >
                                                <div
                                                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${notifications.projectUpdates ? 'translate-x-6' : 'translate-x-0'
                                                        }`}
                                                />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Marketing Emails</h4>
                                                <p className="text-xs text-gray-500 mt-1">Receive updates about new features and offers</p>
                                            </div>
                                            <button
                                                onClick={() => setNotifications({ ...notifications, marketingEmails: !notifications.marketingEmails })}
                                                className={`relative w-12 h-6 rounded-full transition-colors ${notifications.marketingEmails ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                                                    }`}
                                            >
                                                <div
                                                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${notifications.marketingEmails ? 'translate-x-6' : 'translate-x-0'
                                                        }`}
                                                />
                                            </button>
                                        </div>

                                        <div className="pt-4 flex items-center justify-between">
                                            {message && activeTab === 'notifications' && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className={`text-sm font-medium ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}
                                                >
                                                    {message.text}
                                                </motion.span>
                                            )}
                                            <div className="flex-1" />
                                            <button
                                                onClick={handleSaveNotifications}
                                                disabled={isSaving}
                                                className="px-6 py-2.5 bg-primary hover:bg-violet-600 text-white rounded-full font-bold shadow-lg shadow-primary/25 transition-all flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {isSaving ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Save className="w-4 h-4" />
                                                )}
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
