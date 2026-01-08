'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export type Project = {
    id: string;
    name: string;
    description: string;
    language: 'react' | 'vue' | 'html';
    code: string;
    createdAt: string;
};

type ProjectsContextType = {
    projects: Project[];
    userPlan: 'starter' | 'pro' | 'enterprise';
    planExpiryDate: string | null;
    addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    setUserPlan: (plan: 'starter' | 'pro' | 'enterprise') => void;
    isLoading: boolean;
};

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [projects, setProjects] = useState<Project[]>([]);
    const [userPlan, setUserPlan] = useState<'starter' | 'pro' | 'enterprise'>('starter');
    const [planExpiryDate, setPlanExpiryDate] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    // Sync Plan and Expiry from Session
    useEffect(() => {
        if (session?.user) {
            setUserPlan((session.user as any).plan || 'starter');
            // If subscription expiry is available in session, use it
            // For now, we'll keep it simple as it's primarily handled in the DB
        }
    }, [session]);

    // Load Projects (Auth vs LocalStorage)
    useEffect(() => {
        const loadProjects = async () => {
            setIsLoading(true);
            if (status === 'authenticated') {
                try {
                    const response = await fetch('/api/projects');
                    if (response.ok) {
                        const data = await response.json();
                        // Format dates to match UI expectations if needed
                        const formattedProjects = data.map((p: any) => ({
                            ...p,
                            createdAt: new Date(p.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })
                        }));
                        setProjects(formattedProjects);
                    }
                } catch (error) {
                    console.error("Failed to fetch projects from DB", error);
                }
            } else if (status === 'unauthenticated') {
                const savedProjects = localStorage.getItem('design2code_projects');
                if (savedProjects) {
                    try {
                        setProjects(JSON.parse(savedProjects));
                    } catch (e) {
                        console.error("Failed to parse local projects", e);
                    }
                }
            }
            setIsLoading(false);
            setIsInitialized(true);
        };

        if (status !== 'loading') {
            loadProjects();
        }
    }, [status]);

    // Sync guest plan from LocalStorage
    useEffect(() => {
        if (status === 'unauthenticated') {
            const savedPlan = localStorage.getItem('design2code_plan');
            if (savedPlan) setUserPlan(savedPlan as any);

            const savedExpiry = localStorage.getItem('design2code_expiry');
            if (savedExpiry) setPlanExpiryDate(savedExpiry);
        }
    }, [status]);

    // Automatic Downgrade Check (for guests)
    useEffect(() => {
        if (status === 'unauthenticated' && isInitialized && userPlan !== 'starter' && planExpiryDate) {
            const expiry = new Date(planExpiryDate);
            const now = new Date();
            if (now > expiry) {
                setUserPlan('starter');
                setPlanExpiryDate(null);
            }
        }
    }, [status, userPlan, planExpiryDate, isInitialized]);

    // Save Guest Data to LocalStorage
    useEffect(() => {
        if (status === 'unauthenticated' && isInitialized) {
            localStorage.setItem('design2code_projects', JSON.stringify(projects));
            localStorage.setItem('design2code_plan', userPlan);
            if (planExpiryDate) {
                localStorage.setItem('design2code_expiry', planExpiryDate);
            } else {
                localStorage.removeItem('design2code_expiry');
            }
        }
    }, [status, projects, userPlan, planExpiryDate, isInitialized]);

    const addProject = async (newProject: Omit<Project, 'id' | 'createdAt'>) => {
        if (status === 'authenticated') {
            try {
                const response = await fetch('/api/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newProject),
                });
                if (response.ok) {
                    const savedProject = await response.json();
                    const formattedProject = {
                        ...savedProject,
                        createdAt: new Date(savedProject.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })
                    };
                    setProjects((prev) => [formattedProject, ...prev]);
                    return;
                }
            } catch (error) {
                console.error("Failed to save project to DB", error);
            }
        }

        // Local Fallback
        const project: Project = {
            ...newProject,
            id: crypto.randomUUID(),
            createdAt: new Date().toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        setProjects((prev) => [project, ...prev]);
    };

    const deleteProject = async (id: string) => {
        if (status === 'authenticated') {
            try {
                const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    setProjects((prev) => prev.filter((p) => p.id !== id));
                    return;
                }
            } catch (error) {
                console.error("Failed to delete project from DB", error);
            }
        }
        setProjects((prev) => prev.filter((p) => p.id !== id));
    };

    const updatePlan = (plan: 'starter' | 'pro' | 'enterprise') => {
        setUserPlan(plan);
        if (plan === 'pro') {
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + 30);
            setPlanExpiryDate(expiry.toISOString());
        } else if (plan === 'starter') {
            setPlanExpiryDate(null);
        }
    };

    return (
        <ProjectsContext.Provider value={{
            projects,
            addProject,
            deleteProject,
            userPlan,
            planExpiryDate,
            setUserPlan: updatePlan,
            isLoading
        }}>
            {children}
        </ProjectsContext.Provider>
    );
}

export function useProjects() {
    const context = useContext(ProjectsContext);
    if (context === undefined) {
        throw new Error('useProjects must be used within a ProjectsProvider');
    }
    return context;
}
