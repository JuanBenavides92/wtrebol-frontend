'use client';

interface BadgesToggleProps {
    badges: string[];
    onChange: (badges: string[]) => void;
}

const AVAILABLE_BADGES = [
    { value: 'nuevo', label: '✨ Nuevo', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
    { value: 'oferta', label: '🔥 Oferta', color: 'bg-red-500/20 text-red-400 border-red-500/50' },
    { value: 'mas-vendido', label: '⭐ Más Vendido', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' },
    { value: 'envio-gratis', label: '🚚 Envío Gratis', color: 'bg-green-500/20 text-green-400 border-green-500/50' },
    { value: 'destacado', label: '💎 Destacado', color: 'bg-purple-500/20 text-purple-400 border-purple-500/50' },
];

export default function BadgesToggle({ badges, onChange }: BadgesToggleProps) {
    const toggleBadge = (badgeValue: string) => {
        if (badges.includes(badgeValue)) {
            onChange(badges.filter(b => b !== badgeValue));
        } else {
            onChange([...badges, badgeValue]);
        }
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-white">
                Badges del Producto ({badges.length} seleccionados)
            </label>

            <div className="grid md:grid-cols-2 gap-3">
                {AVAILABLE_BADGES.map(badge => {
                    const isSelected = badges.includes(badge.value);
                    return (
                        <label
                            key={badge.value}
                            className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${isSelected
                                    ? `${badge.color} border-current`
                                    : 'bg-slate-800 border-white/10 hover:border-white/30'
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleBadge(badge.value)}
                                className="w-5 h-5 rounded border-gray-600 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-800"
                            />
                            <div className={`font-medium ${isSelected ? '' : 'text-gray-300'}`}>
                                {badge.label}
                            </div>
                        </label>
                    );
                })}
            </div>

            <p className="text-xs text-gray-500">
                Los badges aparecerán como etiquetas visuales en la tarjeta y página de detalle del producto.
            </p>
        </div>
    );
}
