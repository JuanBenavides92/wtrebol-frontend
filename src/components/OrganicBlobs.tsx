'use client';

/**
 * Organic blob shapes that float in the background
 * Represents air flow and temperature zones
 */
export default function OrganicBlobs() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Large blue blob - top right (cold air) */}
            <div
                className="absolute -top-32 -right-32 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl animate-blob"
                style={{ animationDelay: '0s' }}
            />

            {/* Medium blue blob - left center (cold air) */}
            <div
                className="absolute top-1/3 -left-24 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl animate-blob"
                style={{ animationDelay: '2s' }}
            />

            {/* Small blue blob - bottom right (cold air) */}
            <div
                className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl animate-blob"
                style={{ animationDelay: '4s' }}
            />

            {/* Subtle yellow blob - bottom left (warm accent) */}
            <div
                className="absolute -bottom-20 -left-20 w-72 h-72 bg-amber-300/10 rounded-full blur-3xl animate-blob-slow"
                style={{ animationDelay: '1s' }}
            />

            {/* Flow lines - representing air circulation */}
            <svg
                className="absolute inset-0 w-full h-full opacity-10"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0EA5E9" />
                        <stop offset="100%" stopColor="#60C5F1" />
                    </linearGradient>
                </defs>

                {/* Curved flow line 1 */}
                <path
                    d="M -50 200 Q 300 100, 600 300 T 1200 200"
                    stroke="url(#flowGradient)"
                    strokeWidth="2"
                    fill="none"
                    className="animate-flow-line"
                />

                {/* Curved flow line 2 */}
                <path
                    d="M -50 400 Q 400 300, 700 500 T 1200 400"
                    stroke="url(#flowGradient)"
                    strokeWidth="2"
                    fill="none"
                    className="animate-flow-line"
                    style={{ animationDelay: '1s' }}
                />
            </svg>
        </div>
    );
}
