'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import API_CONFIG from '@/lib/config';
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Loader2,
    Film,
    GripVertical
} from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Slide {
    _id: string;
    type: 'slide';
    title: string;
    description?: string;
    imageUrl: string;
    buttonText?: string;
    buttonLink?: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface SortableSlideRowProps {
    slide: Slide;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onToggleActive: (id: string, currentStatus: boolean) => void;
}

function SortableSlideRow({ slide, onEdit, onDelete, onToggleActive }: SortableSlideRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: slide._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={`hover:bg-slate-800/30 transition-colors ${isDragging ? 'bg-slate-800/50' : ''}`}
        >
            <td className="px-6 py-4">
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-700/50 rounded transition-colors"
                    title="Arrastrar para reordenar"
                >
                    <GripVertical className="h-5 w-5 text-gray-400" />
                </button>
            </td>
            <td className="px-6 py-4">
                <span className="text-white font-medium">#{slide.order}</span>
            </td>
            <td className="px-6 py-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700">
                    <img
                        src={slide.imageUrl}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            </td>
            <td className="px-6 py-4">
                <p className="text-white font-medium">{slide.title}</p>
            </td>
            <td className="px-6 py-4">
                <p className="text-gray-400 text-sm line-clamp-2 max-w-md">
                    {slide.description || '-'}
                </p>
            </td>
            <td className="px-6 py-4">
                <button
                    onClick={() => onToggleActive(slide._id, slide.isActive)}
                    className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                        ${slide.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                        }
                    `}
                >
                    {slide.isActive ? (
                        <>
                            <Eye className="h-4 w-4" />
                            Activo
                        </>
                    ) : (
                        <>
                            <EyeOff className="h-4 w-4" />
                            Inactivo
                        </>
                    )}
                </button>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => onEdit(slide._id)}
                        className="p-2 hover:bg-sky-500/20 text-sky-400 rounded-lg transition-colors"
                        title="Editar"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(slide._id)}
                        className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                        title="Eliminar"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default function SlidesPage() {
    const router = useRouter();
    const { isLoading, isAuthenticated } = useAuth();
    const [slides, setSlides] = useState<Slide[]>([]);
    const [isLoadingSlides, setIsLoadingSlides] = useState(true);
    const [isSavingOrder, setIsSavingOrder] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/admin/login');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadSlides();
        }
    }, [isAuthenticated]);

    const loadSlides = async () => {
        setIsLoadingSlides(true);
        try {
            const response = await fetch(
                API_CONFIG.url(API_CONFIG.ENDPOINTS.SLIDES),
                API_CONFIG.fetchOptions()
            );

            if (response.ok) {
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setSlides(result.data.sort((a: Slide, b: Slide) => a.order - b.order));
                } else {
                    console.warn('Backend response format unexpected:', result);
                    setSlides([]);
                }
            }
        } catch (error) {
            console.error('Error loading slides:', error);
        } finally {
            setIsLoadingSlides(false);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = slides.findIndex((slide) => slide._id === active.id);
        const newIndex = slides.findIndex((slide) => slide._id === over.id);

        const newSlides = arrayMove(slides, oldIndex, newIndex);

        // Actualizar orden local inmediatamente
        const updatedSlides = newSlides.map((slide, index) => ({
            ...slide,
            order: index + 1
        }));

        setSlides(updatedSlides);

        // Guardar nuevo orden en el backend
        await saveNewOrder(updatedSlides);
    };

    const saveNewOrder = async (orderedSlides: Slide[]) => {
        setIsSavingOrder(true);
        try {
            // Actualizar cada slide con su nuevo orden
            const updatePromises = orderedSlides.map((slide, index) =>
                fetch(
                    API_CONFIG.url(`${API_CONFIG.ENDPOINTS.CONTENT}/${slide._id}`),
                    API_CONFIG.fetchOptions({
                        method: 'PUT',
                        body: JSON.stringify({ order: index + 1 }),
                    })
                )
            );

            await Promise.all(updatePromises);
            console.log('✅ Orden actualizado correctamente');
        } catch (error) {
            console.error('Error saving new order:', error);
            // Recargar slides en caso de error
            loadSlides();
        } finally {
            setIsSavingOrder(false);
        }
    };

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const response = await fetch(
                API_CONFIG.url(`${API_CONFIG.ENDPOINTS.CONTENT}/${id}`),
                API_CONFIG.fetchOptions({
                    method: 'PUT',
                    body: JSON.stringify({ isActive: !currentStatus }),
                })
            );

            if (response.ok) {
                loadSlides();
            }
        } catch (error) {
            console.error('Error toggling slide:', error);
        }
    };

    const deleteSlide = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este slide?')) return;

        try {
            const response = await fetch(
                API_CONFIG.url(`${API_CONFIG.ENDPOINTS.CONTENT}/${id}`),
                API_CONFIG.fetchOptions({ method: 'DELETE' })
            );

            if (response.ok) {
                loadSlides();
            }
        } catch (error) {
            console.error('Error deleting slide:', error);
        }
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
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Slides del Homepage</h1>
                    <p className="text-gray-400">Arrastra los slides para cambiar su orden</p>
                </div>
                <button
                    onClick={() => router.push('/admin/slides/new')}
                    className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors font-medium"
                >
                    <Plus className="h-5 w-5" />
                    Nuevo Slide
                </button>
            </div>

            {/* Saving Indicator */}
            {isSavingOrder && (
                <div className="mb-4 p-3 bg-sky-500/20 border border-sky-500/30 rounded-lg flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-sky-400 animate-spin" />
                    <span className="text-sky-400 text-sm">Guardando nuevo orden...</span>
                </div>
            )}

            {/* Table */}
            {isLoadingSlides ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
                </div>
            ) : slides.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/30 border border-white/10 rounded-xl">
                    <Film className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No hay slides</h3>
                    <p className="text-gray-400 mb-6">Crea tu primer slide para el homepage</p>
                    <button
                        onClick={() => router.push('/admin/slides/new')}
                        className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors font-medium"
                    >
                        Crear Slide
                    </button>
                </div>
            ) : (
                <div className="bg-slate-800/30 border border-white/10 rounded-xl overflow-hidden">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <table className="w-full">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300"></th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Orden</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Imagen</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Título</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Descripción</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Estado</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <SortableContext
                                    items={slides.map(s => s._id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {slides.map((slide) => (
                                        <SortableSlideRow
                                            key={slide._id}
                                            slide={slide}
                                            onEdit={(id) => router.push(`/admin/slides/${id}`)}
                                            onDelete={deleteSlide}
                                            onToggleActive={toggleActive}
                                        />
                                    ))}
                                </SortableContext>
                            </tbody>
                        </table>
                    </DndContext>
                </div>
            )}

            {/* Stats */}
            {slides.length > 0 && (
                <div className="mt-6 p-4 bg-slate-800/30 border border-white/10 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">
                            Total: {slides.length} {slides.length === 1 ? 'slide' : 'slides'}
                        </span>
                        <span className="text-gray-400">
                            Activos: {slides.filter(s => s.isActive).length}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

