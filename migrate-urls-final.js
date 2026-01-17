const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src');

// Archivos a actualizar con sus reemplazos específicos
const updates = [
    {
        file: 'src/app/admin/configuracion/page.tsx',
        replacements: [
            {
                from: /'http:\/\/localhost:5000\/api\/appointment-settings'/g,
                to: "API_CONFIG.url(API_CONFIG.ENDPOINTS.APPOINTMENT_SETTINGS)"
            }
        ],
        needsImport: true
    },
    {
        file: 'src/app/admin/citas/components/AppointmentsTable.tsx',
        replacements: [
            {
                from: /`http:\/\/localhost:5000\/api\/appointments\?\$\{params\}`/g,
                to: "API_CONFIG.url(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}?${params}`)"
            },
            {
                from: /`http:\/\/localhost:5000\/api\/appointments\/\$\{id\}`/g,
                to: "API_CONFIG.url(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${id}`)"
            }
        ],
        needsImport: true
    },
    {
        file: 'src/app/admin/c itas/components/AppointmentsCalendar.tsx',
        replacements: [
            {
                from: /'http:\/\/localhost:5000\/api\/appointments'/g,
                to: "API_CONFIG.url(API_CONFIG.ENDPOINTS.APPOINTMENTS)"
            },
            {
                from: /'http:\/\/localhost:5000\/api\/time-blocks'/g,
                to: "API_CONFIG.url(API_CONFIG.ENDPOINTS.TIME_BLOCKS)"
            },
            {
                from: /`http:\/\/localhost:5000\/api\/time-blocks\/\$\{blockId\}`/g,
                to: "API_CONFIG.url(`${API_CONFIG.ENDPOINTS.TIME_BLOCKS}/${blockId}`)"
            },
            {
                from: /`http:\/\/localhost:5000\/api\/time-blocks\/\$\{block\._id\}`/g,
                to: "API_CONFIG.url(`${API_CONFIG.ENDPOINTS.TIME_BLOCKS}/${block._id}`)"
            },
            {
                from: /`http:\/\/localhost:5000\/api\/appointments\/\$\{appointmentId\}`/g,
                to: "API_CONFIG.url(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${appointmentId}`)"
            },
            {
                from: /`http:\/\/localhost:5000\/api\/appointments\/\$\{apt\._id\}`/g,
                to: "API_CONFIG.url(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${apt._id}`)"
            }
        ],
        needsImport: true
    },
    {
        file: 'src/app/admin/citas/[id]/page.tsx',
        replacements: [
            {
                from: /'http:\/\/localhost:5000\/api\/technicians\?active=true'/g,
                to: "API_CONFIG.url(API_CONFIG.ENDPOINTS.TECHNICIANS + '?active=true')"
            },
            {
                from: /`http:\/\/localhost:5000\/api\/appointments\/\$\{appointmentId\}`/g,
                to: "API_CONFIG.url(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${appointmentId}`)"
            },
            {
                from: /`http:\/\/localhost:5000\/api\/public\/available-slots\?date=\$\{formData\.scheduledDate\}&serviceType=\$\{formData\.type\}`/g,
                to: "API_CONFIG.url(`${API_CONFIG.ENDPOINTS.AVAILABLE_SLOTS}?date=${formData.scheduledDate}&serviceType=${formData.type}`)"
            },
            {
                from: /'http:\/\/localhost:5000\/api\/appointments'/g,
                to: "API_CONFIG.url(API_CONFIG.ENDPOINTS.APPOINTMENTS)"
            }
        ],
        needsImport: true
    }
];

console.log('🔧 Starting URL migration...\n');

updates.forEach(({ file, replacements, needsImport }) => {
    const filePath = path.join(__dirname, file);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${file}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    replacements.forEach(({ from, to }) => {
        if (from.test(content)) {
            content = content.replace(from, to);
            modified = true;
        }
    });

    if (modified) {
        // Add import if needed and not already there
        if (needsImport && !content.includes("import API_CONFIG from '@/lib/config'")) {
            // Find the best place to add import (after other imports)
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

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${file}`);
    } else {
        console.log(`⏭️  No changes needed: ${file}`);
    }
});

console.log('\n✨ Migration complete!');
