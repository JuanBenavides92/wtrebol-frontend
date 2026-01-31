import { ReactNode } from 'react';

interface PageLayoutProps {
    children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
    return (
        <div className="min-h-screen bg-transparent">
            {/* Content wrapper */}
            <div className="relative z-10 pt-32 pb-16 px-6">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}

