export type Product = {
  id: string;
  nama_produk: string;
  jenis: string;
  kategori: string;
  warna: string;
  harga_agen: number;
  harga_distributor: number;
  harga_distributor_qf: number;
  stok: number;
};

export type SafeProduct = {
  id: string;
  nama_produk: string;
  kategori: string;
  regularPrice: number;
  shopeePrice: number;
  isValid: boolean;
};

export const formatRp = (val: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);

export interface CalculatorConfig {
  profit: number;
  packing: number;
  fixed: number;
  admin: number;
  promo: number;
  ongkir: number;
  live: number;
  affiliator: number;
  preorderFee: number;
  isPreorder: boolean;
}

export const DEFAULT_CONFIG: CalculatorConfig = {
  profit: 5000,
  packing: 0,
  fixed: 1250,
  admin: 8.25,
  promo: 4.5,
  ongkir: 8,
  live: 3,
  affiliator: 0,
  preorderFee: 3,
  isPreorder: false,
};

export function getModalTerbaik(product: Product): {
  modal: number;
  sumber: string;
} {
  if (product.harga_distributor_qf > 0) {
    return { modal: product.harga_distributor_qf, sumber: "QF" };
  } else if (product.harga_distributor > 0) {
    return { modal: product.harga_distributor, sumber: "Distributor" };
  }
  return { modal: product.harga_agen, sumber: "Agen" };
}

export function calculateShopeePrice(modal: number, config: CalculatorConfig = DEFAULT_CONFIG): number {
  if (!modal) return 0;
  const persenAdmin = config.admin + config.promo + config.ongkir + config.live + (config.isPreorder ? config.preorderFee : 0);
  const persenAffil = config.affiliator || 0;
  const totalPersen = persenAdmin + persenAffil;
  const biayaLain = config.packing + config.fixed;
  const biayaDasar = modal + config.profit + biayaLain;

  const hargaJualRaw = biayaDasar / (1 - totalPersen / 100);
  return Math.ceil(hargaJualRaw / 100) * 100;
}

export function calculateNonShopeePrice(modal: number): number {
  if (!modal) return 0;
  let profit = 0;
  if (modal >= 0 && modal <= 29999) profit = 5000;
  else if (modal >= 30000 && modal <= 149999) profit = 10000;
  else if (modal >= 150000 && modal <= 199999) profit = 13000;
  else if (modal >= 200000) profit = 15000;
  return modal + profit;
}
