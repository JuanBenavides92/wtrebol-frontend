'use client';

import { Search, X, Filter } from 'lucide-react';
import { getCategoryLabel } from '@/lib/whatsapp';
import { FilterState } from '@/hooks/useProductFilters';

interface FilterBarProps {
    filters: FilterState;
    availableCategories: string[];
    availableBTUs: number[];
    onSearchChange: (search: string) => void;
    onToggleCategory: (category: string) => void;
    onToggleBTU: (btu: number) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
    resultCount: number;
}

export default function FilterBar({
    filters,
    availableCategories,
    availableBTUs,
    onSearchChange,
    onToggleCategory,
    onToggleBTU,
    onClearFilters,
    hasActiveFilters,
    resultCount,
}: FilterBarProps) {
    return (
        <div className="mb-8 space-y-4">
            {/* Top Row: Search and Result Count */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={filters.search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    />
                </div>

                {/* Result Count */}
                <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm">
                        {resultCount} {resultCount === 1 ? 'producto' : 'productos'}
                    </span>
                    {hasActiveFilters && (
                        <button
                            onClick={onClearFilters}
                            className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                        >
                            <X className="h-4 w-4" />
                            Limpiar filtros
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Buttons Row */}
            <div className="flex flex-wrap gap-3">
                {/* Category Filters */}
                {availableCategories.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-400">Categoría:</span>
                        {availableCategories.map((category) => {
                            const isActive = filters.categories.includes(category);
                            return (
                                <button
                                    key={category}
                                    onClick={() => onToggleCategory(category)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                                            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                                        }`}
                                >
                                    {getCategoryLabel(category)}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* BTU Filters */}
                {availableBTUs.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-400">BTU:</span>
                        {availableBTUs.map((btu) => {
                            const isActive = filters.btuRanges.includes(btu);
                            return (
                                <button
                                    key={btu}
                                    onClick={() => onToggleBTU(btu)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                                        }`}
                                >
                                    ❄️ {btu.toLocaleString()}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Active Filters Chips */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-gray-400">Filtros activos:</span>
                    {filters.search && (
                        <span className="bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                            &quot;{filters.search}&quot;
                            <button onClick={() => onSearchChange('')} className="hover:text-white">
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}
                    {filters.categories.map((cat) => (
                        <span
                            key={cat}
                            className="bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full text-xs flex items-center gap-1"
                        >
                            {getCategoryLabel(cat)}
                            <button onClick={() => onToggleCategory(cat)} className="hover:text-white">
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                    {filters.btuRanges.map((btu) => (
                        <span
                            key={btu}
                            className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs flex items-center gap-1"
                        >
                            ❄️ {btu.toLocaleString()} BTU
                            <button onClick={() => onToggleBTU(btu)} className="hover:text-white">
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
