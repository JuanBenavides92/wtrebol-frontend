import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Solo proteger rutas /admin/* excepto /admin/login
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        // En Next.js, no podemos acceder a localStorage en middleware
        // La protección real se hará en el cliente con AuthContext
        // Este middleware es solo una capa adicional de seguridad

        // Por ahora, permitir acceso (la protección real está en el cliente)
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
