'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { cartCount, openCart } = useCart();
  const { customer, isAuthenticated, logout } = useCustomerAuth();
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
      <header className="fixed top-0 w-full z-50 h-20 flex items-center justify-between px-6 md:px-12 bg-slate-900/70 backdrop-blur-xl border-b border-white/10">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
            W
          </div>
          <span className="text-lg font-bold tracking-tight text-white hidden md:inline">
            WTREBOL <span className="font-light text-sky-500">INNOVACIÓN</span>
          </span>
          <span className="text-lg font-bold tracking-tight text-white md:hidden">
            WTREBOL
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`relative group cursor-pointer transition-colors ${isActive(item.href) ? 'text-sky-500' : 'hover:text-white'
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
          {/* Cart Button */}
          <button onClick={() => openCart()} className="relative cursor-pointer group">
            <ShoppingCart className="h-6 w-6 text-gray-300 group-hover:text-sky-500 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Customer Profile Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all"
            >
              <User className="h-5 w-5 text-gray-300" />
              {isAuthenticated && customer && (
                <span className="text-sm text-white max-w-[100px] truncate">
                  {customer.name.split(' ')[0]}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {profileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setProfileMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden">
                  {isAuthenticated && customer ? (
                    <>
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm text-gray-400">Hola,</p>
                        <p className="font-semibold text-white truncate">{customer.name}</p>
                        <p className="text-xs text-gray-500 truncate">{customer.email}</p>
                      </div>
                      <Link
                        href="/customer/dashboard"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <Package className="h-5 w-5" />
                        Mis Pedidos
                      </Link>
                      <Link
                        href="/customer/dashboard/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <User className="h-5 w-5" />
                        Mi Perfil
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors w-full text-left"
                      >
                        <LogOut className="h-5 w-5" />
                        Cerrar Sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/customer/login"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <User className="h-5 w-5" />
                        Iniciar Sesión
                      </Link>
                      <Link
                        href="/customer/register"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white hover:from-sky-400 hover:to-emerald-400 transition-colors"
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
            className="hidden lg:block bg-white/10 hover:bg-sky-500 text-white border border-white/20 px-5 py-2 rounded-full text-sm font-semibold transition-all hover:shadow-[0_0_15px_rgba(14,165,233,0.5)]"
          >
            Contáctanos
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
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
        className={`fixed top-20 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 z-40 md:hidden transform transition-all duration-300 ease-out ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
          }`}
      >
        <nav className="flex flex-col p-6 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`transition-colors text-left font-medium py-2 border-b border-white/5 hover:border-sky-500/50 ${isActive(item.href) ? 'text-sky-500' : 'text-gray-300 hover:text-white'
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

