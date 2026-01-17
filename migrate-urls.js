// Script para reemplazar todas las URLs hardcodeadas con API_CONFIG
// Este script se ejecutará para actualizar todos los archivos restantes

const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'src/app/admin/page.tsx',
    'src/app/admin/productos/page.tsx',
    'src/app/admin/productos/[id]/page.tsx',
    'src/app/admin/servicios/page.tsx',
    'src/app/admin/servicios/[id]/page.tsx',
    'src/app/admin/ventajas/page.tsx',
    'src/app/admin/ventajas/[id]/page.tsx',
    'src/app/admin/faqs/page.tsx',
    'src/app/admin/faqs/[id]/page.tsx',
    'src/app/admin/tecnicos/page.tsx',
    'src/app/admin/tecnicos/[id]/page.tsx',
    'src/components/admin/ImageUpload.tsx',
];

const replacements = [
    {
        from: /'http:\/\/localhost:5000\/api\/content\/slide'/g,
        to: "API_CONFIG.url(API_CONFIG.ENDPOINTS.SLIDES)"
    },
    {
        from: /'http:\/\/localhost:5000\/api\/content\/product'/g,
        to: "API_CONFIG.url(API_CONFIG.ENDPOINTS.PRODUCTS)"
    },
    {
        from: /'http:\/\/localhost:5000\/api\/content\/service'/g,
        to: "API_CONFIG.url(API_CONFIG.ENDPOINTS.SERVICES)"
    },
    {
        from: /'http:\/\/localhost:5000\/api\/content\/advantage'/g,
        to: "API_CONFIG.url(API_CONFIG.ENDPOINTS.ADVANTAGES)"
    },
    {
        from: /'http:\/\/localhost:5000\/api\/content\/faq'/g,
        to: "API_CONFIG.url(API_CONFIG.ENDPOINTS.FAQ)"
    },
    {
        from: /'http:\/\/localhost:5000\/api\/content'/g,
        to: "API_CONFIG.url(API_CONFIG.ENDPOINTS.CONTENT)"
    },
    {
        from: /`http:\/\/localhost:5000\/api\/content\/item\/\$\{([^}]+)\}`/g,
        to: "API_CONFIG.url(`/api/content/item/${$1}`)"
    },
    {
        from: /`http:\/\/localhost:5000\/api\/content\/\$\{([^}]+)\}`/g,
        to: "API_CONFIG.url(`${API_CONFIG.ENDPOINTS.CONTENT}/${$1}`)"
    },
    {
        from: /'http:\/\/localhost:5000\/api\/technicians'/g,
        to: "API_CONFIG.url(API_CONFIG.ENDPOINTS.TECHNICIANS)"
    },
    {
        from: /`http:\/\/localhost:5000\/api\/technicians\/\$\{([^}]+)\}`/g,
        to: "API_CONFIG.url(`${API_CONFIG.ENDPOINTS.TECHNICIANS}/${$1}`)"
    },
    {
        from: /'http:\/\/localhost:5000\/api\/upload'/g,
        to: "API_CONFIG.url(API_CONFIG.ENDPOINTS.UPLOAD)"
    },
    {
        from: /'http:\/\/localhost:5000\/api\/appointments'/g,
        to: "API_CONFIG.url(API_CONFIG.ENDPOINTS.APPOINTMENTS)"
    },
];

console.log('🔧 Iniciando reemplazo de URLs hardcodeadas...\n');

filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Archivo no encontrado: ${file}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Aplicar reemplazos
    replacements.forEach(({ from, to }) => {
        if (from.test(content)) {
            content = content.replace(from, to);
            modified = true;
        }
    });

    // Agregar import si es necesario y se modificó el archivo
    if (modified && !content.includes("import API_CONFIG from '@/lib/config'")) {
        // Buscar la última línea de import
        const lines = content.split('\n');
        let lastImportIndex = -1;

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().startsWith('import ')) {
                lastImportIndex = i;
            }
        }

        if (lastImportIndex !== -1) {
            lines.splice(lastImportIndex + 1, 0, "import API_CONFIG from '@/lib/config';");
            content = lines.join('\n');
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Actualizado: ${file}`);
    } else {
        console.log(`⏭️  Sin cambios: ${file}`);
    }
});

console.log('\n✨ Proceso completado!');
