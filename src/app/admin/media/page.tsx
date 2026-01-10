'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    Image as ImageIcon,
    Search,
    Copy,
    Trash2,
    Upload,
    Loader2,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface MediaFile {
    _id: string;
    filename: string;
    url: string;
    size: number;
    uploadedAt: string;
}

export default function MediaPage() {
    const router = useRouter();
    const { isLoading, isAuthenticated } = useAuth();
    const [media, setMedia] = useState<MediaFile[]>([]);
    const [filteredMedia, setFilteredMedia] = useState<MediaFile[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingMedia, setIsLoadingMedia] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/admin/login');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadMedia();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        // Filtrar media por búsqueda
        if (searchQuery.trim()) {
            const filtered = media.filter(item =>
                item.filename.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredMedia(filtered);
        } else {
            setFilteredMedia(media);
        }
    }, [searchQuery, media]);

    const loadMedia = async () => {
        setIsLoadingMedia(true);
        try {
            // TODO: Implementar endpoint para listar imágenes
            // Por ahora, array vacío
            setMedia([]);
            setFilteredMedia([]);
        } catch (error) {
            console.error('Error loading media:', error);
        } finally {
            setIsLoadingMedia(false);
        }
    };

    const handleUploadSuccess = (imageUrl: string) => {
        // Recargar galería después de subir
        loadMedia();
        setShowUpload(false);
    };

    const copyToClipboard = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedUrl(url);
            setTimeout(() => setCopiedUrl(null), 2000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };

    const deleteImage = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;

        try {
            // TODO: Implementar endpoint para eliminar imagen
            console.log('Deleting image:', id);
            loadMedia();
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Galería de Medios</h1>
                <p className="text-gray-400">Gestiona todas las imágenes de tu sitio</p>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar imágenes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    />
                </div>

                {/* Upload Button */}
                <button
                    onClick={() => setShowUpload(!showUpload)}
                    className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors font-medium"
                >
                    <Upload className="h-5 w-5" />
                    Subir Imagen
                </button>
            </div>

            {/* Upload Section */}
            {showUpload && (
                <div className="mb-6">
                    <ImageUpload
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={(error) => console.error(error)}
                    />
                </div>
            )}

            {/* Media Grid */}
            {isLoadingMedia ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
                </div>
            ) : filteredMedia.length === 0 ? (
                <div className="text-center py-12">
                    <ImageIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                        {searchQuery ? 'No se encontraron imágenes' : 'No hay imágenes'}
                    </h3>
                    <p className="text-gray-400 mb-6">
                        {searchQuery
                            ? 'Intenta con otro término de búsqueda'
                            : 'Sube tu primera imagen para comenzar'
                        }
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={() => setShowUpload(true)}
                            className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors font-medium"
                        >
                            Subir Imagen
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredMedia.map((item) => (
                        <div
                            key={item._id}
                            className="group bg-slate-800/50 border border-white/10 rounded-xl overflow-hidden hover:border-sky-500/50 transition-all"
                        >
                            {/* Image */}
                            <div className="relative aspect-square bg-slate-700">
                                <img
                                    src={item.url}
                                    alt={item.filename}
                                    className="w-full h-full object-cover"
                                />

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => copyToClipboard(item.url)}
                                        className="p-2 bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors"
                                        title="Copiar URL"
                                    >
                                        {copiedUrl === item.url ? (
                                            <CheckCircle className="h-5 w-5 text-white" />
                                        ) : (
                                            <Copy className="h-5 w-5 text-white" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => deleteImage(item._id)}
                                        className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="h-5 w-5 text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-3">
                                <p className="text-sm font-medium text-white truncate mb-1">
                                    {item.filename}
                                </p>
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                    <span>{formatFileSize(item.size)}</span>
                                    <span>{formatDate(item.uploadedAt)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats */}
            <div className="mt-8 p-4 bg-slate-800/30 border border-white/10 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                        {filteredMedia.length} {filteredMedia.length === 1 ? 'imagen' : 'imágenes'}
                        {searchQuery && ` encontrada${filteredMedia.length === 1 ? '' : 's'}`}
                    </span>
                    {media.length > 0 && (
                        <span className="text-gray-400">
                            Total: {media.length}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
