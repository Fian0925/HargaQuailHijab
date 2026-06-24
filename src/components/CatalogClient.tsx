"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ShoppingBag, Store, Tag, ArrowRight, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import type { SafeProduct } from "@/lib/pricing";

const formatRp = (val: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);

export default function CatalogClient({ products }: { products: SafeProduct[] }) {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState<string>("Semua");
  const [sortBy, setSortBy] = useState<string>("az");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Nomor WA Admin
  const WA_NUMBER = "6285117250925";

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.kategori).filter(Boolean));
    return ["Semua", ...Array.from(cats)];
  }, [products]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, kategori, sortBy]);

  const filteredAndSortedData = useMemo(() => {
    let result = products.filter((p) => {
      const matchSearch = p.nama_produk.toLowerCase().includes(search.toLowerCase());
      const matchKat = kategori === "Semua" || p.kategori === kategori;
      return matchSearch && matchKat;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "termurah") return a.regularPrice - b.regularPrice;
      if (sortBy === "termahal") return b.regularPrice - a.regularPrice;
      // default A-Z
      return a.nama_produk.localeCompare(b.nama_produk);
    });

    return result;
  }, [products, search, kategori, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const currentData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Header Premium */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20 ring-1 ring-slate-900/10">
                <Store className="text-white h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                  Katalog Produk
                </h1>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  Pesan via WhatsApp untuk harga terbaik!
                </p>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64 group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Cari produk..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <select
                  className="flex-1 px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-slate-700 shadow-sm font-medium appearance-none cursor-pointer"
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <select
                  className="flex-1 px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-slate-700 shadow-sm font-medium appearance-none cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="az">A - Z</option>
                  <option value="termurah">Termurah</option>
                  <option value="termahal">Termahal</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {currentData.length === 0 ? (
          <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm">
            <Tag className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">Tidak ada hasil</h3>
            <p className="text-slate-500 text-sm mt-1">Coba gunakan kata kunci atau filter lain.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {currentData.map((product) => {
                const waMessage = encodeURIComponent(`Halo Admin, saya tertarik membeli produk ini:\n*${product.nama_produk}*\nKategori: ${product.kategori}\nHarga: ${formatRp(product.regularPrice)}\n\nApakah stoknya tersedia?`);

                return (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative"
                  >
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold tracking-widest rounded-lg uppercase mb-3">
                        {product.kategori || "UMUM"}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-xl leading-snug line-clamp-2 mb-3">
                        {product.nama_produk}
                      </h3>
                    </div>
                    
                    <div className="mt-auto space-y-4">
                      {product.isValid ? (
                        <>
                          {/* Harga Non-Shopee (Emerald - Fokus Utama) */}
                          <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                              <Store className="w-24 h-24 text-emerald-600" />
                            </div>
                            <p className="text-xs text-emerald-700 font-bold mb-1.5 flex items-center gap-1.5 uppercase tracking-wider relative z-10">
                              <Store className="h-4 w-4" /> Harga Web / WA
                            </p>
                            <p className="text-3xl font-black text-emerald-600 tracking-tight relative z-10">
                              {formatRp(product.regularPrice)}
                            </p>
                            <p className="text-[10px] text-emerald-600/70 mt-1 font-medium italic relative z-10">
                              *Belum termasuk ongkir (ditanggung pembeli)
                            </p>
                            
                            <a 
                              href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 relative z-10 active:scale-[0.98]"
                            >
                              <MessageCircle className="h-4 w-4" /> Pesan via WhatsApp
                            </a>
                          </div>
                          
                          {/* Harga Shopee (Orange - Fokus Sekunder) */}
                          <div className="p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                            <div>
                              <p className="text-[10px] text-slate-500 font-semibold mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                                <ShoppingBag className="h-3 w-3" /> Harga Shopee
                              </p>
                              <p className="text-lg font-bold text-slate-700">
                                {formatRp(product.shopeePrice)}
                              </p>
                            </div>
                            <a 
                              href="https://shopee.co.id/aryanistore.id"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-100 rounded-lg hover:bg-orange-100 transition-colors w-full sm:w-auto text-center inline-block"
                            >
                              Beli di Shopee
                            </a>
                          </div>

                          {/* Accordion Stok Warna Ready */}
                          <details className="group border border-slate-100 rounded-2xl bg-white overflow-hidden shadow-sm">
                            <summary className="flex items-center justify-between p-4 font-semibold text-sm text-slate-700 cursor-pointer list-none select-none hover:bg-slate-50 transition-colors [&::-webkit-details-marker]:hidden">
                              <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4 text-slate-400" />
                                <span>Cek Warna Ready</span>
                              </div>
                              <span className="transition duration-300 group-open:rotate-180">
                                <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16"><path d="M6 9l6 6 6-6"></path></svg>
                              </span>
                            </summary>
                            <div className="px-4 pb-4 border-t border-slate-50 pt-3">
                              <div className="flex flex-wrap gap-1.5">
                                {product.availableVariants && product.availableVariants.length > 0 ? (
                                  product.availableVariants.map((v, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-slate-800 text-white text-[10px] font-semibold rounded-md uppercase tracking-wider shadow-sm">
                                      {v}
                                    </span>
                                  ))
                                ) : (
                                  <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-semibold rounded-md border border-red-100 uppercase tracking-wider">
                                    Hubungi Admin
                                  </span>
                                )}
                              </div>
                            </div>
                          </details>
                        </>
                      ) : (
                        <div className="py-8 text-center bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                          <p className="text-sm text-slate-400 font-medium">Harga belum tersedia</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex flex-wrap justify-center gap-1">
                  {(() => {
                    const getVisiblePages = (current: number, total: number) => {
                      if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
                      if (current <= 3) return [1, 2, 3, 4, '...', total];
                      if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
                      return [1, '...', current - 1, current, current + 1, '...', total];
                    };

                    return getVisiblePages(currentPage, totalPages).map((page, idx) => (
                      <button
                        key={idx}
                        onClick={() => typeof page === 'number' && setCurrentPage(page)}
                        disabled={page === '...'}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${
                          currentPage === page
                            ? "bg-slate-900 text-white shadow-md"
                          : page === '...'
                            ? "text-slate-400 cursor-default"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {page}
                      </button>
                    ));
                  })()}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
