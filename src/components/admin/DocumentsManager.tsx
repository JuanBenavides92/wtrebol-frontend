'use client';

import { useState } from 'react';
import { Upload, FileText, X, Loader2, Download } from 'lucide-react';
import API_CONFIG from '@/lib/config';

export interface Document {
    name: string;
    url: string;
    type: 'manual' | 'datasheet' | 'warranty' | 'certificate' | 'other';
}

interface DocumentsManagerProps {
    documents: Document[];
    onChange: (docs: Document[]) => void;
    maxDocuments?: number;
}

const DOCUMENT_TYPES = [
    { value: 'manual', label: '📘 Manual de Usuario' },
    { value: 'datasheet', label: '📊 Ficha Técnica' },
    { value: 'warranty', label: '🛡️ Garantía' },
    { value: 'certificate', label: '📜 Certificado' },
    { value: 'other', label: '📄 Otro' },
];

export default function DocumentsManager({
    documents,
    onChange,
    maxDocuments = 5,
}: DocumentsManagerProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (documents.length + files.length > maxDocuments) {
            alert(`Máximo ${maxDocuments} documentos permitidos`);
            return;
        }

        setUploading(true);
        const newDocs: Document[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setUploadingIndex(i);

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
                        newDocs.push({
                            name: file.name,
                            url: result.data.url,
                            type: 'other',
                        });
                    }
                }
            } catch (error) {
                console.error('Error uploading document:', error);
            }
        }

        onChange([...documents, ...newDocs]);
        setUploading(false);
        setUploadingIndex(null);
    };

    const removeDocument = (index: number) => {
        onChange(documents.filter((_, i) => i !== index));
    };

    const updateDocumentType = (index: number, type: Document['type']) => {
        const updated = [...documents];
        updated[index] = { ...updated[index], type };
        onChange(updated);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-white">
                    Documentos Descargables ({documents.length}/{maxDocuments})
                </label>
                <label className="cursor-pointer px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    {uploading ? 'Subiendo...' : 'Subir PDFs'}
                    <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileSelect}
                        disabled={uploading || documents.length >= maxDocuments}
                        className="hidden"
                    />
                </label>
            </div>

            {documents.length === 0 ? (
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
                    <FileText className="h-10 w-10 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400 mb-1">No hay documentos</p>
                    <p className="text-sm text-gray-500">Sube manuales, fichas técnicas o certificados</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {documents.map((doc, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 p-4 bg-slate-800 border border-white/10 rounded-lg"
                        >
                            <FileText className="h-8 w-8 text-sky-400 flex-shrink-0" />

                            <div className="flex-1 min-w-0">
                                <div className="text-white font-medium truncate">{doc.name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <select
                                        value={doc.type}
                                        onChange={(e) => updateDocumentType(index, e.target.value as Document['type'])}
                                        className="text-xs bg-slate-700 border border-white/10 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-sky-500"
                                    >
                                        {DOCUMENT_TYPES.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-white/10 text-sky-400 rounded transition-colors"
                                    title="Descargar"
                                >
                                    <Download className="h-4 w-4" />
                                </a>
                                <button
                                    type="button"
                                    onClick={() => removeDocument(index)}
                                    className="p-2 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                                    title="Eliminar"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {uploading && uploadingIndex !== null && (
                        <div className="flex items-center gap-4 p-4 bg-slate-800 border border-white/10 rounded-lg">
                            <Loader2 className="h-8 w-8 text-sky-500 animate-spin flex-shrink-0" />
                            <div className="text-white">Subiendo documento {uploadingIndex + 1}...</div>
                        </div>
                    )}
                </div>
            )}

            <p className="text-xs text-gray-500">
                Formatos aceptados: PDF, DOC, DOCX. Estos archivos estarán disponibles para descarga en la página del producto.
            </p>
        </div>
    );
}
