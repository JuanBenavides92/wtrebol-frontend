'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
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

        {/* Right Section: Cart and Contact */}
        <div className="flex items-center gap-6">
          <Link href="/tienda" className="relative cursor-pointer group">
            <ShoppingCart className="h-6 w-6 text-gray-300 group-hover:text-sky-500 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/contacto"
            className="hidden md:block bg-white/10 hover:bg-sky-500 text-white border border-white/20 px-5 py-2 rounded-full text-sm font-semibold transition-all hover:shadow-[0_0_15px_rgba(14,165,233,0.5)]"
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
