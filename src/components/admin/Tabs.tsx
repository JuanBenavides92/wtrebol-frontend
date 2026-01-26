'use client';

import { ReactNode } from 'react';

export interface Tab {
    id: string;
    label: string;
    icon?: ReactNode;
    hasError?: boolean;
    isComplete?: boolean;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (tabId: string) => void;
}

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
    return (
        <div className="border-b border-white/10">
            <div className="flex overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => onChange(tab.id)}
                            className={`
                                relative px-6 py-4 font-medium text-sm whitespace-nowrap transition-all
                                ${isActive
                                    ? 'text-sky-400 border-b-2 border-sky-400'
                                    : 'text-gray-400 hover:text-white border-b-2 border-transparent'
                                }
                            `}
                        >
                            <div className="flex items-center gap-2">
                                {tab.icon}
                                <span>{tab.label}</span>

                                {/* Status indicators */}
                                {tab.hasError && (
                                    <span className="w-2 h-2 bg-red-500 rounded-full" title="Tiene errores" />
                                )}
                                {tab.isComplete && !tab.hasError && (
                                    <span className="text-emerald-500">✓</span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
