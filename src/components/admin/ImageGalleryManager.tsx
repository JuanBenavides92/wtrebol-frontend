'use client';

import { useState } from 'react';
import { Upload, X, Star, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import API_CONFIG from '@/lib/config';

interface ImageGalleryManagerProps {
    images: string[];
    mainImageIndex: number;
    onUpdate: (images: string[], mainIndex: number) => void;
    maxImages?: number;
}

export default function ImageGalleryManager({
    images,
    mainImageIndex,
    onUpdate,
    maxImages = 10,
}: ImageGalleryManagerProps) {
    const [uploading, setUploading] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (images.length + files.length > maxImages) {
            alert(`Máximo ${maxImages} imágenes permitidas`);
            return;
        }

        setUploading(true);
        const newImages: string[] = [];

        for (const file of files) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch(API_CONFIG.url('/api/upload'), {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data?.url) {
                        newImages.push(result.data.url);
                    }
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }

        onUpdate([...images, ...newImages], mainImageIndex);
        setUploading(false);
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        const newMainIndex = index === mainImageIndex
            ? Math.min(mainImageIndex, newImages.length - 1)
            : mainImageIndex > index
                ? mainImageIndex - 1
                : mainImageIndex;
        onUpdate(newImages, Math.max(0, newMainIndex));
    };

    const setMainImage = (index: number) => {
        onUpdate(images, index);
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...images];
        const draggedImage = newImages[draggedIndex];
        newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedImage);

        const newMainIndex = draggedIndex === mainImageIndex
            ? index
            : index === mainImageIndex
                ? mainImageIndex + (draggedIndex < mainImageIndex ? 1 : -1)
                : mainImageIndex;

        setDraggedIndex(index);
        onUpdate(newImages, newMainIndex);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-white">
                    Galería de Imágenes ({images.length}/{maxImages})
                </label>
                <label className="cursor-pointer px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    {uploading ? 'Subiendo...' : 'Subir Imágenes'}
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={uploading || images.length >= maxImages}
                        className="hidden"
                    />
                </label>
            </div>

            {images.length === 0 ? (
                <div className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center">
                    <ImageIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">No hay imágenes</p>
                    <p className="text-sm text-gray-500">Sube al menos una imagen del producto</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((url, index) => (
                        <div
                            key={index}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-move ${index === mainImageIndex
                                ? 'border-sky-500 ring-2 ring-sky-500/50'
                                : 'border-white/10 hover:border-white/30'
                                }`}
                        >
                            <Image
                                src={url}
                                alt={`Producto ${index + 1}`}
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="object-cover"
                            />

                            {/* Main badge */}
                            {index === mainImageIndex && (
                                <div className="absolute top-2 left-2 bg-sky-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                    <Star className="h-3 w-3" />
                                    Principal
                                </div>
                            )}

                            {/* Overlay con acciones */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                {index !== mainImageIndex && (
                                    <button
                                        onClick={() => setMainImage(index)}
                                        className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded text-sm font-medium transition-colors"
                                    >
                                        Hacer Principal
                                    </button>
                                )}
                                <button
                                    onClick={() => removeImage(index)}
                                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                                    title="Eliminar"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Upload placeholder */}
                    {uploading && (
                        <div className="aspect-square rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
                        </div>
                    )}
                </div>
            )}

            <p className="text-xs text-gray-500">
                Arrastra para reordenar. La imagen principal se mostrará como portada del producto.
            </p>
        </div>
    );
}
