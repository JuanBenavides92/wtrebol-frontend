'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle } from 'lucide-react';

interface ImageUploadProps {
    onUploadSuccess: (imageUrl: string) => void;
    onUploadError?: (error: string) => void;
}

export default function ImageUpload({ onUploadSuccess, onUploadError }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File): string | null => {
        // Validar tipo de archivo
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            return 'Tipo de archivo no válido. Solo se permiten: JPG, PNG, WebP, GIF';
        }

        // Validar tamaño (máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return 'El archivo es demasiado grande. Máximo 5MB';
        }

        return null;
    };

    const handleFile = async (file: File) => {
        setError(null);
        setUploadSuccess(false);

        // Validar archivo
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            if (onUploadError) onUploadError(validationError);
            return;
        }

        // Mostrar preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Subir archivo
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setUploadSuccess(true);
                // Backend devuelve { success: true, data: { url, fileName, fileSize, mimeType } }
                onUploadSuccess(result.data.url);
            } else {
                throw new Error(result.message || 'Error al subir la imagen');
            }
        } catch (err: any) {
            const errorMsg = err.message || 'Error al subir la imagen';
            setError(errorMsg);
            if (onUploadError) onUploadError(errorMsg);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };

    const clearPreview = () => {
        setPreview(null);
        setError(null);
        setUploadSuccess(false);
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                    relative border-2 border-dashed rounded-xl p-8 transition-all
                    ${isDragging
                        ? 'border-sky-500 bg-sky-500/10'
                        : 'border-white/20 bg-slate-800/30'
                    }
                    ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:border-sky-500/50'}
                `}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                />

                <div className="flex flex-col items-center gap-4">
                    {isUploading ? (
                        <>
                            <Loader2 className="h-12 w-12 text-sky-500 animate-spin" />
                            <p className="text-white font-medium">Subiendo imagen...</p>
                        </>
                    ) : uploadSuccess ? (
                        <>
                            <CheckCircle className="h-12 w-12 text-emerald-500" />
                            <p className="text-emerald-400 font-medium">¡Imagen subida exitosamente!</p>
                        </>
                    ) : (
                        <>
                            <Upload className="h-12 w-12 text-gray-400" />
                            <div className="text-center">
                                <p className="text-white font-medium mb-1">
                                    Arrastra una imagen aquí o haz clic para seleccionar
                                </p>
                                <p className="text-sm text-gray-400">
                                    JPG, PNG, WebP, GIF - Máximo 5MB
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                    <p className="text-sm text-red-200">{error}</p>
                </div>
            )}

            {/* Preview */}
            {preview && (
                <div className="relative bg-slate-800/50 border border-white/10 rounded-xl p-4">
                    <button
                        onClick={clearPreview}
                        className="absolute top-2 right-2 p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                    >
                        <X className="h-4 w-4 text-red-400" />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-slate-700">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <ImageIcon className="h-4 w-4 text-sky-400" />
                                <p className="text-sm font-medium text-white">Vista previa</p>
                            </div>
                            <p className="text-xs text-gray-400">
                                {uploadSuccess ? 'Imagen lista para usar' : 'Imagen cargada localmente'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
