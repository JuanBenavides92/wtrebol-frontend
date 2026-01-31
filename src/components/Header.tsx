'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { cartCount, openCart } = useCart();
  const { customer, isAuthenticated, logout } = useCustomerAuth();
  const { config } = useSiteConfig();
  const pathname = usePathname();

  const navItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Galería', href: '/galeria' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Tienda', href: '/tienda' },
    { label: 'Calendario', href: '/calendario' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header className="fixed top-0 w-full z-50 h-20 flex items-center justify-between px-6 md:px-12 bg-gradient-to-br from-sky-50/95 to-blue-50/95 backdrop-blur-xl border-b border-sky-200/50">
        {/* Logo - DINÁMICO */}
        <Link
          href="/"
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          {config?.logoUrl ? (
            // Logo como imagen desde S3
            <img
              src={config.logoUrl}
              alt={config.logoText || 'Logo'}
              style={{ height: `${config.logoHeight || 40}px` }}
              className="w-auto object-contain"
            />
          ) : (
            // Logo por defecto (letra W con gradiente)
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              {config?.logoText?.[0] || 'W'}
            </div>
          )}

          <span className="text-lg font-bold tracking-tight text-slate-900 hidden md:inline">
            {config?.logoText}
            {config?.logoSubtext && (
              <span className="font-light text-sky-600"> {config.logoSubtext}</span>
            )}
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900 md:hidden">
            {config?.logoText}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-700">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`relative group cursor-pointer transition-colors ${isActive(item.href)
                ? 'text-sky-600 font-bold'
                : 'hover:text-sky-600'
                }`}
            >
              {item.label}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-sky-500 transition-all duration-300 ${isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
              ></span>
            </Link>
          ))}
        </nav>

        {/* Right Section: Cart, Customer Profile and Contact */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <button
            onClick={openCart}
            className="relative p-2 hover:bg-sky-100 rounded-lg transition-colors"
            aria-label="Abrir carrito"
          >
            <ShoppingCart className="w-5 h-5 text-slate-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Customer Profile Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 p-2 hover:bg-sky-100 rounded-lg transition-colors"
            >
              <User className="w-5 h-5 text-slate-700" />
              {isAuthenticated && customer && (
                <span className="text-sm font-medium text-slate-700">{customer.name}</span>
              )}
            </button>

            {/* Dropdown Menu */}
            {profileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setProfileMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                  {isAuthenticated && customer ? (
                    <>
                      <div className="px-4 py-3 border-b border-slate-200">
                        <p className="text-sm text-gray-500">Hola,</p>
                        <p className="font-semibold text-slate-800 truncate">{customer.name}</p>
                        <p className="text-xs text-gray-600 truncate">{customer.email}</p>
                      </div>
                      <Link
                        href="/customer/dashboard"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-sky-50 transition-colors"
                      >
                        <Package className="h-5 w-5" />
                        Mis Pedidos
                      </Link>
                      <Link
                        href="/customer/dashboard/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-sky-50 transition-colors"
                      >
                        <User className="h-5 w-5" />
                        Mi Perfil
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-sky-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-700">Cerrar Sesión</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/customer/login"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-sky-50 transition-colors"
                      >
                        <User className="h-5 w-5" />
                        Iniciar Sesión
                      </Link>
                      <Link
                        href="/customer/register"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white hover:from-sky-600 hover:to-emerald-600 transition-colors"
                      >
                        <User className="h-5 w-5" />
                        Registrarse
                      </Link>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <Link
            href="/contacto"
            className="hidden lg:block bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all hover:shadow-lg"
          >
            Contáctanos
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-700 p-2 hover:bg-sky-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-20 left-0 right-0 bg-gradient-to-br from-sky-50/98 to-blue-50/98 backdrop-blur-xl border-b border-sky-200/50 z-40 md:hidden transform transition-all duration-300 ease-out ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
          }`}
      >
        <nav className="flex flex-col p-6 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`transition-colors text-left font-medium py-2 border-b border-sky-200/30 hover:border-sky-500 ${isActive(item.href) ? 'text-sky-600 font-bold' : 'text-slate-700 hover:text-sky-600'
                }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contacto"
            onClick={() => setMobileMenuOpen(false)}
            className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-4 py-3 rounded-full font-semibold w-full hover:shadow-lg hover:shadow-sky-500/50 transition-all text-center"
          >
            Contáctanos
          </Link>
        </nav>
      </div>
    </>
  );
}

