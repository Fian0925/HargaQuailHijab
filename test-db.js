import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://fmnfgiaovafahxfkuieb.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtbmZnaWFvdmFmYWh4Zmt1aWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MDYzNjQsImV4cCI6MjA4Mzk4MjM2NH0.xlzXYgk4S38g5wiG2eW0bZ31d0GgAnPhE_iE9s-MBHw');

async function test() {
  const { data, error } = await supabase.from('products').select('nama_produk, warna, stok').limit(10);
  console.log(data);
}

test();
