'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    ArrowLeft, Save, Loader2, FileText, Image as ImageIcon,
    Package, Settings, Film, ListCheck, ShoppingCart
} from 'lucide-react';
import Tabs, { Tab } from '@/components/admin/Tabs';
import ImageGalleryManager from '@/components/admin/ImageGalleryManager';
import WYSIWYGEditor from '@/components/admin/WYSIWYGEditor';
import DocumentsManager, { Document } from '@/components/admin/DocumentsManager';
import SpecificationsTable from '@/components/admin/SpecificationsTable';
import FeaturesList from '@/components/admin/FeaturesList';
import FAQManager from '@/components/admin/FAQManager';
import BadgesToggle from '@/components/admin/BadgesToggle';
import PriceInput from '@/components/admin/PriceInput';
import CreatableSelect from '@/components/admin/CreatableSelect';
import { useProductOptions } from '@/hooks/useProductOptions';
import API_CONFIG from '@/lib/config';
import slugify from 'slugify';

interface ExtendedProductFormData {
    // Tab 1 - Básico
    title: string;
    description: string;
    price: string;
    category: string;
    brand: string;
    sku: string;
    slug: string;
    condition: 'nuevo' | 'usado';
    btuCapacity: number;
    usageType: 'residencial' | 'comercial' | 'industrial';

    // Tab 2 - Galería
    images: string[];
    mainImageIndex: number;
    imageUrl: string; // Backward compatibility

    // Tab 3 - Contenido
    longDescription: string;
    videoUrl: string;
    documents: Document[];

    // Tab 4 - Especificaciones & Features
    specifications: Record<string, string | number>;
    features: string[];
    faqs: Array<{ question: string; answer: string }>;

    // Tab 5 - Comercio
    badges: string[];
    warranty: {
        duration: string;
        type: string;
        details: string;
    };
    shipping: {
        freeShipping: boolean;
        shippingCost: string;
        estimatedDays: string;
    };
    estimatedDeliveryDays: number; // Días numéricos para cálculos

    // Estado
    isActive: boolean;
    inStock: boolean;
    stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock' | 'pre-order';
}

const TABS: Tab[] = [
    {
        id: 'basico',
        label: 'Básico',
        icon: <FileText className="h-4 w-4" />,
    },
    {
        id: 'galeria',
        label: 'Galería',
        icon: <ImageIcon className="h-4 w-4" />,
    },
    {
        id: 'contenido',
        label: 'Contenido',
        icon: <Film className="h-4 w-4" />,
    },
    {
        id: 'specs',
        label: 'Especificaciones',
        icon: <ListCheck className="h-4 w-4" />,
    },
    {
        id: 'comercio',
        label: 'Comercio',
        icon: <ShoppingCart className="h-4 w-4" />,
    },
];

const CATEGORIES = [
    { value: 'split', label: 'Split / Minisplit' },
    { value: 'cassette', label: 'Cassette 4 Vías' },
    { value: 'piso-cielo', label: 'Piso-Cielo' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'accesorio', label: 'Accesorio' },
];

const BTU_OPTIONS = [9000, 12000, 18000, 24000, 30000, 36000, 48000, 60000];

export default function ProductFormPage() {
    const router = useRouter();
    const params = useParams();
    const { isAuthenticated } = useAuth();
    const isEdit = params?.id !== 'new';
    const productId = isEdit ? params?.id as string : null;

    const [activeTab, setActiveTab] = useState('basico');
    const [formData, setFormData] = useState<ExtendedProductFormData>({
        title: '',
        description: '',
        price: '',
        category: '',
        brand: '',
        sku: '',
        slug: '',
        condition: 'nuevo',
        btuCapacity: 0,
        usageType: 'residencial',
        images: [],
        mainImageIndex: 0,
        imageUrl: '',
        longDescription: '',
        videoUrl: '',
        documents: [],
        specifications: {},
        features: [],
        faqs: [],
        badges: [],
        warranty: {
            duration: '',
            type: '',
            details: '',
        },
        shipping: {
            freeShipping: false,
            shippingCost: '',
            estimatedDays: '',
        },
        estimatedDeliveryDays: 0,
        isActive: true,
        inStock: true,
        stockStatus: 'in-stock',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasLoadedProduct, setHasLoadedProduct] = useState(false);

    // Product options hooks
    const categoryOptions = useProductOptions('category');
    const btuOptions = useProductOptions('btu');
    const conditionOptions = useProductOptions('condition');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/admin/login');
            return;
        }

        if (isEdit && productId && !hasLoadedProduct) {
            loadProduct();
        }
    }, [isAuthenticated, isEdit, productId, hasLoadedProduct]);


    // Auto-generate slug from title
    useEffect(() => {
        if (formData.title && !formData.slug) {
            const generatedSlug = slugify(formData.title, {
                lower: true,
                strict: true,
                locale: 'es',
            });
            setFormData(prev => ({ ...prev, slug: generatedSlug }));
        }
    }, [formData.title, formData.slug]);

    const loadProduct = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_CONFIG.url(`/api/content/item/${productId}`), {
                credentials: 'include',
            });

            if (response.ok) {
                const result = await response.json();
                const data = result.success ? result.data : result;

                // Backward compatibility: migrate imageUrl to images array
                let images = data.images || [];
                let mainImageIndex = data.mainImageIndex || 0;

                // If no images array but has imageUrl, migrate it
                if (images.length === 0 && data.imageUrl) {
                    console.log('📸 [loadProduct] Migrating imageUrl to images array:', data.imageUrl);
                    images = [data.imageUrl];
                    mainImageIndex = 0;
                }

                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    price: data.price || '',
                    category: data.category || '',
                    brand: data.brand || '',
                    sku: data.sku || '',
                    slug: data.slug || '',
                    condition: data.condition || 'nuevo',
                    btuCapacity: data.btuCapacity || 0,
                    usageType: data.usageType || 'residencial',
                    images: images,
                    mainImageIndex: mainImageIndex,
                    imageUrl: data.imageUrl || (images.length > 0 ? images[0] : ''),
                    longDescription: data.longDescription || '',
                    videoUrl: data.videoUrl || '',
                    documents: data.documents || [],
                    specifications: data.specifications || {},
                    features: data.features || [],
                    faqs: data.faqs || [],
                    badges: data.badges || [],
                    warranty: data.warranty || { duration: '', type: '', details: '' },
                    shipping: data.shipping || { freeShipping: false, shippingCost: '', estimatedDays: '' },
                    estimatedDeliveryDays: data.estimatedDeliveryDays || 0,
                    isActive: data.isActive ?? true,
                    inStock: data.inStock ?? true,
                    stockStatus: data.stockStatus || 'in-stock',
                });
                setHasLoadedProduct(true);
            }
        } catch (error) {
            console.error('Error loading product:', error);
            setError('Error al cargar el producto');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validations
        if (!formData.title.trim()) {
            setError('El nombre es requerido');
            setActiveTab('basico');
            return;
        }

        if (formData.images.length === 0 && !formData.imageUrl) {
            setError('Se requiere al menos una imagen');
            setActiveTab('galeria');
            return;
        }

        setIsSaving(true);

        try {
            // Use main image from gallery or fallback to imageUrl
            const mainImage = formData.images.length > 0
                ? formData.images[formData.mainImageIndex]
                : formData.imageUrl;

            const payload: any = {
                type: 'product',
                ...formData,
                imageUrl: mainImage, // Backward compatibility
            };

            // Clean estimatedDeliveryDays if not specified
            if (!payload.estimatedDeliveryDays || payload.estimatedDeliveryDays === 0) {
                delete payload.estimatedDeliveryDays;
            }

            // Clean empty nested objects to prevent cast errors
            if (payload.warranty &&
                !payload.warranty.duration &&
                !payload.warranty.type &&
                !payload.warranty.details) {
                delete payload.warranty;
            }

            if (payload.shipping &&
                !payload.shipping.freeShipping &&
                !payload.shipping.shippingCost &&
                !payload.shipping.estimatedDays &&
                (!payload.shipping.availableRegions || payload.shipping.availableRegions.length === 0)) {
                delete payload.shipping;
            }

            console.log('🚀 Enviando payload:', JSON.stringify(payload, null, 2));

            // ✨ USE SERVER ACTION instead of direct fetch
            const { saveProductAction } = await import('../actions');
            const result = await saveProductAction(payload, productId, isEdit);

            if (result.success) {
                console.log('✅ Producto guardado y caché revalidado');

                // Forzar actualización del router para invalidar caché del cliente
                router.refresh();

                // Redirigir a lista de productos
                router.push('/admin/productos');
            } else {
                console.error('❌ Error al guardar:', result.error);
                setError(result.error || 'Error al guardar el producto');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            setError('Error al guardar el producto');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-5xl">
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/admin/productos')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a Productos
                    </button>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
                    </h1>
                    <p className="text-gray-400">
                        {isEdit ? 'Modifica los datos del producto' : 'Crea un nuevo producto para la tienda'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                        <p className="text-sm text-red-200">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="bg-slate-800/30 border border-white/10 rounded-xl overflow-hidden">
                        {/* Tabs */}
                        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

                        {/* Tab Content */}
                        <div className="p-8">
                            {/* TAB 1: BÁSICO */}
                            {activeTab === 'basico' && (
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-white mb-2">
                                                Nombre del Producto <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                                placeholder="Ej: Aire Acondicionado Split Inverter 12000 BTU"
                                                required
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-white mb-2">Descripción Corta</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                rows={3}
                                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                                placeholder="Breve descripción que aparecerá en las tarjetas de producto"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-white mb-2">
                                                URL amigable (Slug)
                                            </label>
                                            <div className="flex gap-2 items-center">
                                                <span className="text-gray-400 text-sm">/tienda/</span>
                                                <input
                                                    type="text"
                                                    value={formData.slug}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                                    className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                                    placeholder="aire-acondicionado-split-12000-btu"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const generatedSlug = slugify(formData.title, {
                                                            lower: true,
                                                            strict: true,
                                                            locale: 'es',
                                                        });
                                                        setFormData(prev => ({ ...prev, slug: generatedSlug }));
                                                    }}
                                                    className="px-4 py-3 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
                                                >
                                                    Generar desde título
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Se genera automáticamente del título. Puedes editarlo manualmente.
                                            </p>
                                        </div>

                                        <PriceInput
                                            value={formData.price}
                                            onChange={(value) => setFormData(prev => ({ ...prev, price: value }))}
                                            label="Precio"
                                            placeholder="Ej: $2.500.000"
                                        />

                                        <CreatableSelect
                                            value={formData.category}
                                            onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                                            options={categoryOptions.options.map(opt => ({ _id: opt._id, value: opt.value, label: opt.label }))}
                                            onCreateOption={async (label) => {
                                                return await categoryOptions.createOption(label);
                                            }}
                                            label="Categoría"
                                            placeholder="Seleccionar categoría..."
                                            isLoading={categoryOptions.isLoading}
                                            optionType="category"
                                            onRefresh={() => categoryOptions.refreshOptions()}
                                        />

                                        <div>
                                            <label className="block text-sm font-medium text-white mb-2">Marca</label>
                                            <input
                                                type="text"
                                                value={formData.brand}
                                                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                                placeholder="Ej: LG, Samsung, Carrier"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-white mb-2">SKU</label>
                                            <input
                                                type="text"
                                                value={formData.sku}
                                                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                                placeholder="Código interno del producto"
                                            />
                                        </div>

                                        <CreatableSelect
                                            value={formData.btuCapacity ? String(formData.btuCapacity) : ''}
                                            onChange={(value) => {
                                                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                                                console.log('🔵 [ProductForm BTU] onChange LLAMADO');
                                                console.log('📥 [ProductForm BTU] Valor recibido:', value);
                                                console.log('📋 [ProductForm BTU] Estado actual btuCapacity:', formData.btuCapacity);

                                                // Mantener como número en formData para compatibilidad con backend
                                                // pero aceptar string del CreatableSelect
                                                const numValue = value ? parseInt(value, 10) : 0;
                                                console.log('🔢 [ProductForm BTU] Valor convertido a número:', numValue);

                                                setFormData(prev => {
                                                    console.log('🔄 [ProductForm BTU] Actualizando formData...');
                                                    console.log('📋 [ProductForm BTU] Valor anterior:', prev.btuCapacity);
                                                    const newData = { ...prev, btuCapacity: numValue };
                                                    console.log('📋 [ProductForm BTU] Valor nuevo:', newData.btuCapacity);
                                                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                                                    return newData;
                                                });
                                            }}
                                            options={btuOptions.options.map(opt => ({ _id: opt._id, value: opt.value, label: opt.label }))}
                                            onCreateOption={async (label) => {
                                                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                                                console.log('🟢 [ProductForm BTU] onCreateOption LLAMADO');
                                                console.log('📝 [ProductForm BTU] Label a crear:', label);

                                                const created = await btuOptions.createOption(label);

                                                console.log('✅ [ProductForm BTU] Opción creada:', created);
                                                console.log('📋 [ProductForm BTU] Opciones actuales:', btuOptions.options.length);
                                                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

                                                // Retornar la opción creada para que CreatableSelect la maneje
                                                return created;
                                            }}
                                            label="Capacidad (BTU)"
                                            placeholder="Seleccionar capacidad..."
                                            isLoading={btuOptions.isLoading}
                                            error={btuOptions.error}
                                            optionType="btu"
                                            onRefresh={() => btuOptions.refreshOptions()}
                                        />

                                        <CreatableSelect
                                            value={formData.condition}
                                            onChange={(value) => setFormData(prev => ({ ...prev, condition: value as 'nuevo' | 'usado' }))}
                                            options={conditionOptions.options.map(opt => ({ _id: opt._id, value: opt.value, label: opt.label }))}
                                            onCreateOption={async (label) => {
                                                return await conditionOptions.createOption(label);
                                            }}
                                            label="Condición"
                                            placeholder="Seleccionar condición..."
                                            isLoading={conditionOptions.isLoading}
                                            optionType="condition"
                                            onRefresh={() => conditionOptions.refreshOptions()}
                                        />

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-white mb-2">
                                                Slug (URL amigable)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.slug}
                                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-mono text-sm"
                                                placeholder="se-genera-automaticamente"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                URL: /tienda/{formData.slug || 'producto-ejemplo'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10 pt-6">
                                        <h3 className="text-lg font-semibold text-white mb-4">Estado del Producto</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <label className="flex items-center gap-3 p-4 bg-slate-800 border border-white/10 rounded-lg cursor-pointer hover:border-sky-500/50 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isActive}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                                    className="w-5 h-5 rounded border-gray-600 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-800"
                                                />
                                                <div>
                                                    <div className="text-white font-medium">Producto Activo</div>
                                                    <div className="text-xs text-gray-400">Visible en la tienda</div>
                                                </div>
                                            </label>

                                            <label className="flex items-center gap-3 p-4 bg-slate-800 border border-white/10 rounded-lg cursor-pointer hover:border-sky-500/50 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.inStock}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                                                    className="w-5 h-5 rounded border-gray-600 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-800"
                                                />
                                                <div>
                                                    <div className="text-white font-medium">En Stock</div>
                                                    <div className="text-xs text-gray-400">Disponible para venta</div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: GALERÍA */}
                            {activeTab === 'galeria' && (
                                <div>
                                    <ImageGalleryManager
                                        images={formData.images}
                                        mainImageIndex={formData.mainImageIndex}
                                        onUpdate={(images, mainIndex) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                images,
                                                mainImageIndex: mainIndex,
                                                // Sync imageUrl with main image for backward compatibility
                                                imageUrl: images.length > 0 ? images[mainIndex] : prev.imageUrl,
                                            }));
                                        }}
                                        maxImages={10}
                                    />
                                </div>
                            )}

                            {/* TAB 3: CONTENIDO */}
                            {activeTab === 'contenido' && (
                                <div className="space-y-8">
                                    {/* Long Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">
                                            Descripción Larga (HTML)
                                        </label>
                                        <p className="text-xs text-gray-500 mb-3">
                                            Descripción completa del producto con formato rico. Aparece en la pestaña "Descripción" de la página de detalle.
                                        </p>
                                        <WYSIWYGEditor
                                            content={formData.longDescription}
                                            onChange={(html) => setFormData(prev => ({ ...prev, longDescription: html }))}
                                            placeholder="Escribe la descripción completa del producto..."
                                        />
                                    </div>

                                    {/* Video URL */}
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">
                                            Video URL (YouTube/Vimeo)
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.videoUrl}
                                            onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                            placeholder="https://www.youtube.com/watch?v=..."
                                        />
                                        {formData.videoUrl && (
                                            <p className="text-xs text-emerald-400 mt-2">
                                                ✓ Se mostrará un reproductor embebido en la página de detalle
                                            </p>
                                        )}
                                    </div>

                                    {/* Documents */}
                                    <div>
                                        <DocumentsManager
                                            documents={formData.documents}
                                            onChange={(docs) => setFormData(prev => ({ ...prev, documents: docs }))}
                                            maxDocuments={5}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: ESPECIFICACIONES & FEATURES */}
                            {activeTab === 'specs' && (
                                <div className="space-y-8">
                                    <SpecificationsTable
                                        specifications={formData.specifications}
                                        onChange={(specs) => setFormData(prev => ({ ...prev, specifications: specs }))}
                                    />

                                    <FeaturesList
                                        features={formData.features}
                                        onChange={(features) => setFormData(prev => ({ ...prev, features }))}
                                        maxLength={100}
                                    />

                                    <FAQManager
                                        faqs={formData.faqs}
                                        onChange={(faqs) => setFormData(prev => ({ ...prev, faqs }))}
                                    />
                                </div>
                            )}

                            {/* TAB 5: COMERCIO */}
                            {activeTab === 'comercio' && (
                                <div className="space-y-8">
                                    <BadgesToggle
                                        badges={formData.badges}
                                        onChange={(badges) => setFormData(prev => ({ ...prev, badges }))}
                                    />

                                    {/* Warranty */}
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-white">Garantía</label>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 mb-2">Duración</label>
                                                <input
                                                    type="text"
                                                    value={formData.warranty.duration}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        warranty: { ...prev.warranty, duration: e.target.value }
                                                    }))}
                                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                                    placeholder="Ej: 2 años"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 mb-2">Tipo</label>
                                                <input
                                                    type="text"
                                                    value={formData.warranty.type}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        warranty: { ...prev.warranty, type: e.target.value }
                                                    }))}
                                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                                    placeholder="Ej: Garantía del fabricante"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-gray-400 mb-2">Detalles</label>
                                                <textarea
                                                    value={formData.warranty.details}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        warranty: { ...prev.warranty, details: e.target.value }
                                                    }))}
                                                    rows={2}
                                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                                    placeholder="Detalles adicionales de la garantía..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping */}
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-white">Envío</label>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <label className="flex items-center gap-3 p-4 bg-slate-800 border border-white/10 rounded-lg cursor-pointer hover:border-sky-500/50 transition-colors md:col-span-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.shipping.freeShipping}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        shipping: { ...prev.shipping, freeShipping: e.target.checked }
                                                    }))}
                                                    className="w-5 h-5 rounded border-gray-600 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-800"
                                                />
                                                <div>
                                                    <div className="text-white font-medium">Envío Gratuito</div>
                                                    <div className="text-xs text-gray-400">El producto incluye envío gratis</div>
                                                </div>
                                            </label>

                                            {!formData.shipping.freeShipping && (
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400 mb-2">Costo de Envío</label>
                                                    <input
                                                        type="text"
                                                        value={formData.shipping.shippingCost}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            shipping: { ...prev.shipping, shippingCost: e.target.value }
                                                        }))}
                                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                                        placeholder="Ej: $50,000"
                                                    />
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 mb-2">Tiempo de Entrega</label>
                                                <input
                                                    type="text"
                                                    value={formData.shipping.estimatedDays}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        shipping: { ...prev.shipping, estimatedDays: e.target.value }
                                                    }))}
                                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                                    placeholder="Ej: 3-5 días hábiles"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 mb-2">Días Estimados (Número)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="365"
                                                    value={formData.estimatedDeliveryDays || ''}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        estimatedDeliveryDays: Number(e.target.value)
                                                    }))}
                                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                                    placeholder="Ej: 5"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Usado para calcular la fecha estimada de entrega
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/productos')}
                            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <><Loader2 className="h-5 w-5 animate-spin" />Guardando...</>
                            ) : (
                                <><Save className="h-5 w-5" />{isEdit ? 'Actualizar Producto' : 'Crear Producto'}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
