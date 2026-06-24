import { supabaseServer } from "@/lib/supabaseServer";
import { type Product, type SafeProduct, getModalTerbaik, calculateShopeePrice, calculateNonShopeePrice } from "@/lib/pricing";
import { fetchLiveStock, matchStockVariants } from "@/lib/stock";
import CatalogClient from "@/components/CatalogClient";

export const revalidate = 60; // Cache selama 60 detik (optional, biar cepat)

export default async function Page() {
  // 1. Fetch data directly on the server (Supabase and Live Stock concurrently)
  const [supabaseResponse, liveStock] = await Promise.all([
    supabaseServer
      .from("products")
      .select("*")
      .order("nama_produk", { ascending: true }),
    fetchLiveStock(),
  ]);

  const { data: rawProducts, error } = supabaseResponse;

  if (error) {
    console.error("Error fetching products:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-red-500">Gagal memuat data katalog.</p>
      </div>
    );
  }

  const products = rawProducts as Product[];

  // 2. Transform the data into SAFE data for the client
  // Kolom "harga_agen", "harga_distributor", dll DIBUANG sepenuhnya di sisi Server ini.
  const safeProducts: SafeProduct[] = products.map((p) => {
    const { modal } = getModalTerbaik(p);
    
    // Match the stock variants from Google Sheets
    const variants = matchStockVariants(p.nama_produk, liveStock);

    return {
      id: p.id,
      nama_produk: p.nama_produk,
      kategori: p.kategori,
      regularPrice: calculateNonShopeePrice(modal),
      shopeePrice: calculateShopeePrice(modal),
      isValid: modal > 0,
      availableVariants: variants,
    };
  });

  // 3. Pass the SAFE data to the Client Component
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-slate-900 selection:text-white">
      <CatalogClient products={safeProducts} />
    </div>
  );
}
