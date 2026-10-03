"use client";

import { useMemo, useState } from "react";
import {
  BarChart3, Calculator, ChevronRight, CircleDollarSign, ClipboardList,
  LayoutDashboard, Lightbulb, Menu, Package, Plus, ReceiptText, Settings,
  ShoppingBag, Sparkles, Target, TrendingUp, Users, X
} from "lucide-react";
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";

const demoSales = [
  { date: "25 Sep", revenue: 420000, orders: 12 },
  { date: "26 Sep", revenue: 515000, orders: 15 },
  { date: "27 Sep", revenue: 468000, orders: 14 },
  { date: "28 Sep", revenue: 690000, orders: 21 },
  { date: "29 Sep", revenue: 745000, orders: 24 },
  { date: "30 Sep", revenue: 612000, orders: 19 },
  { date: "1 Okt", revenue: 830000, orders: 27 },
];

const initialProducts = [
  { id: 1, name: "Nasi Ayam Sambal", category: "FnB", cost: 10500, price: 22000, sold: 38 },
  { id: 2, name: "Es Kopi Susu", category: "FnB", cost: 5800, price: 15000, sold: 56 },
  { id: 3, name: "Paket Foto Produk", category: "Jasa", cost: 50000, price: 175000, sold: 5 },
];

const rupiah = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Math.round(value || 0));
const compactRupiah = (value) => value >= 1000000 ? "Rp " + (value/1000000).toFixed(1).replace(".", ",") + " jt" : rupiah(value).replace(",00", "");

function Card({ children, className = "" }) { return <div className={`card ${className}`}>{children}</div>; }
function SectionTitle({ icon: Icon, eyebrow, title, subtitle }) {
  return <div className="section-title"><div className="eyebrow"><Icon size={16}/>{eyebrow}</div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>;
}

export default function Home() {
  const [active, setActive] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [businessType, setBusinessType] = useState("FnB");
  const [products, setProducts] = useState(initialProducts);
  const [hpp, setHpp] = useState({ product: "", purchase: "", packQty: "", usedQty: "", resultPcs: "", targetMargin: "40" });
  const [online, setOnline] = useState({ basePrice: 0, platform: "GoFood", discount: 20, fee: 20, promo: 0 });
  const [sale, setSale] = useState({ product: "Nasi Ayam Sambal", channel: "Offline", qty: 1, price: 22000 });
  const [sales, setSales] = useState([{ id: 1, product: "Nasi Ayam Sambal", channel: "Offline", qty: 2, total: 44000, date: "1 Okt 2026" }, { id: 2, product: "Es Kopi Susu", channel: "GoFood", qty: 3, total: 45000, date: "1 Okt 2026" }]);

  const totalRevenue = useMemo(() => sales.reduce((sum, s) => sum + s.total, 0), [sales]);
  const totalOrders = useMemo(() => sales.reduce((sum, s) => sum + s.qty, 0), [sales]);
  const hppUnit = useMemo(() => {
    const purchase = Number(hpp.purchase);
    const packQty = Number(hpp.packQty);
    const usedQty = Number(hpp.usedQty);
    const resultPcs = Number(hpp.resultPcs);
    if (!purchase || !packQty || !usedQty || !resultPcs) return 0;
    return (purchase / packQty * usedQty) / resultPcs;
  }, [hpp]);
  const onlineCalc = useMemo(() => {
    const base = Number(online.basePrice) || 0;
    const afterDiscount = Math.max(0, base * (1 - Number(online.discount || 0) / 100));
    const fee = afterDiscount * (Number(online.fee || 0) / 100);
    const promo = Number(online.promo || 0);
    const received = Math.max(0, afterDiscount - fee - promo);
    return { afterDiscount, fee, promo, received, margin: base ? (received / base) * 100 : 0 };
  }, [online]);

  const nav = [
    ["dashboard","Dashboard",LayoutDashboard],["hpp","Hitung HPP",Calculator],["price","Harga Jual Online",ShoppingBag],
    ["sales","Penjualan",ReceiptText],["analysis","Analisis",BarChart3],["guide","Panduan Bisnis",Lightbulb]
  ];

  function addSale(e) {
    e.preventDefault();
    const qty = Number(sale.qty) || 1, price = Number(sale.price) || 0;
    setSales(prev => [{ id: Date.now(), product: sale.product, channel: sale.channel, qty, total: qty * price, date: new Date().toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"}) }, ...prev]);
    setActive("sales");
  }
  function addProduct(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name")?.toString().trim();
    const cost = Number(fd.get("cost")) || 0, price = Number(fd.get("price")) || 0;
    if (!name) return;
    setProducts(prev => [{ id: Date.now(), name, category: businessType, cost, price, sold: 0 }, ...prev]);
    e.currentTarget.reset();
  }

  return (
    <main>
      <div className="app">
        <aside className={mobileOpen ? "sidebar open" : "sidebar"}>
          <div className="brand"><div className="brand-mark">B</div><div><strong>bisniz</strong><span>business development system</span></div><button className="close-mobile" onClick={() => setMobileOpen(false)}><X size={18}/></button></div>
          <div className="workspace"><div className="workspace-dot">UM</div><div><small>Workspace</small><b>Usaha Mama</b></div><ChevronRight size={16}/></div>
          <nav>{nav.map(([id,label,Icon]) => <button key={id} className={active===id?"nav active":"nav"} onClick={() => {setActive(id); setMobileOpen(false)}}><Icon size={18}/><span>{label}</span>{id==="analysis" && <em>NEW</em>}</button>)}</nav>
          <div className="sidebar-bottom"><div className="tip-mini"><Sparkles size={17}/><div><b>Mulai dari kecil.</b><span>Bisniz bantu kamu hitung sebelum eksekusi.</span></div></div><button className="nav"><Settings size={18}/><span>Pengaturan</span></button><div className="profile"><div className="avatar">SA</div><div><b>Syarief</b><span>Business beginner</span></div></div></div>
        </aside>

        <section className="content">
          <header className="topbar"><button className="menu-btn" onClick={() => setMobileOpen(true)}><Menu size={21}/></button><div><small>Saturday, 3 October 2026</small><h1>{active==="dashboard"?"Dashboard":nav.find(n=>n[0]===active)?.[1]}</h1></div><div className="top-actions"><span className="pill"><span className="pulse"/> Data tersimpan</span><button className="primary" onClick={() => setActive("sales")}><Plus size={17}/> Catat penjualan</button></div></header>

          {active==="dashboard" && <div className="view">
            <div className="hero"><div><div className="hero-badge"><Sparkles size={15}/> Business development companion</div><h2>Bangun bisnis dengan<br/><span>angka yang lebih jelas.</span></h2><p>Mulai dari HPP, tentukan harga jual, catat transaksi, lalu lihat apa yang perlu kamu perbaiki.</p><div className="hero-buttons"><button className="primary" onClick={()=>setActive("hpp")}>Hitung HPP <ChevronRight size={17}/></button><button className="ghost" onClick={()=>setActive("guide")}>Lihat panduan</button></div></div><div className="hero-art"><div className="orbit orbit-1"/><div className="orbit orbit-2"/><div className="hero-icon"><TrendingUp size={42}/></div><div className="floating-card fc1"><CircleDollarSign size={17}/><div><b>+18,4%</b><span>Revenue</span></div></div><div className="floating-card fc2"><Calculator size={16}/><div><b>HPP aman</b><span>Rp 10.500 / porsi</span></div></div></div></div>

            <div className="stats-grid"><Card><div className="stat-icon indigo"><CircleDollarSign size={19}/></div><small>Revenue tercatat</small><h3>{compactRupiah(totalRevenue + 4282000)}</h3><span className="trend">↗ 18,4% <i>vs minggu lalu</i></span></Card><Card><div className="stat-icon orange"><ReceiptText size={19}/></div><small>Total transaksi</small><h3>{totalOrders+184}</h3><span className="trend">↗ 12,1% <i>vs minggu lalu</i></span></Card><Card><div className="stat-icon green"><Target size={19}/></div><small>Avg. order value</small><h3>{rupiah(66500)}</h3><span className="muted">Target {rupiah(75000)}</span></Card><Card><div className="stat-icon purple"><Package size={19}/></div><small>Produk aktif</small><h3>{products.length}</h3><span className="muted">2 perlu evaluasi</span></Card></div>

            <div className="dashboard-grid"><Card className="chart-card"><div className="card-head"><div><b>Performa penjualan</b><span>7 hari terakhir</span></div><select><option>7 hari</option><option>30 hari</option></select></div><div className="chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={demoSales}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="date" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false} tickFormatter={(v)=>v/1000+"k"}/><Tooltip formatter={(v)=>rupiah(v)}/><Bar dataKey="revenue" radius={[7,7,2,2]} fill="#171717"/></BarChart></ResponsiveContainer></div></Card>
              <Card className="insight-card"><div className="card-head"><div><b>Business pulse</b><span>Yang perlu kamu tahu</span></div><Sparkles size={18}/></div><div className="insight-item"><div className="insight-num">01</div><div><b>Produk terlaris</b><span>Es Kopi Susu menyumbang 34% unit terjual.</span></div></div><div className="insight-item"><div className="insight-num">02</div><div><b>Harga online</b><span>Margin turun 5,8% di channel delivery.</span></div></div><div className="insight-item"><div className="insight-num">03</div><div><b>Opportunity</b><span>AOV bisa naik dengan bundling produk.</span></div></div><button className="link-btn" onClick={()=>setActive("analysis")}>Buka analisis lengkap <ChevronRight size={15}/></button></Card>
            </div>

            <Card className="products-card"><div className="card-head"><div><b>Produk &amp; jasa</b><span>Ringkasan harga dan HPP</span></div><button className="small-btn" onClick={()=>setActive("hpp")}><Plus size={15}/> Tambah produk</button></div><div className="table-wrap"><table><thead><tr><th>Produk</th><th>Jenis</th><th>HPP / unit</th><th>Harga jual</th><th>Margin</th><th></th></tr></thead><tbody>{products.map(p=>{const margin=p.price?((p.price-p.cost)/p.price)*100:0; return <tr key={p.id}><td><b>{p.name}</b><span className="cell-sub">{p.sold} terjual</span></td><td><span className="tag">{p.category}</span></td><td>{rupiah(p.cost)}</td><td>{rupiah(p.price)}</td><td><span className={margin>=40?"margin good":"margin"}>{margin.toFixed(0)}%</span></td><td><ChevronRight size={16}/></td></tr>})}</tbody></table></div></Card>
          </div>}

          {active==="hpp" && <div className="view"><SectionTitle icon={Calculator} eyebrow="UNIT ECONOMICS" title="Hitung HPP per produk" subtitle="Masukkan pembelian bahan dalam satuan yang kamu beli, lalu Bisniz otomatis mengubahnya jadi HPP per unit."/><div className="two-col"><Card><div className="form-title"><span>01</span><div><b>Data bahan / biaya</b><small>Contoh: beli minyak 2 liter, dipakai 250 ml</small></div></div><div className="field-grid"><label>Nama produk<input placeholder="Nasi Ayam Sambal" value={hpp.product} onChange={e=>setHpp({...hpp,product:e.target.value})}/></label><label>Harga beli<input type="number" placeholder="60000" value={hpp.purchase} onChange={e=>setHpp({...hpp,purchase:e.target.value})}/></label><label>Total isi<input type="number" placeholder="2000" value={hpp.packQty} onChange={e=>setHpp({...hpp,packQty:e.target.value})}/><small>Satuan isi, mis. ml / gram / pcs</small></label><label>Isi yang digunakan<input type="number" placeholder="250" value={hpp.usedQty} onChange={e=>setHpp({...hpp,usedQty:e.target.value})}/><small>Dipakai untuk satu kali produksi</small></label><label>Hasil produksi (pcs)<input type="number" placeholder="10" value={hpp.resultPcs} onChange={e=>setHpp({...hpp,resultPcs:e.target.value})}/><small>Output dari bahan yang dipakai</small></label><label>Target margin<input type="number" value={hpp.targetMargin} onChange={e=>setHpp({...hpp,targetMargin:e.target.value})}/><small>Margin kotor yang ditargetkan (%)</small></label></div></Card><Card className="result-card"><div className="result-kicker">HASIL PERHITUNGAN</div><div className="big-money">{rupiah(hppUnit)}</div><span>estimasi HPP per pcs</span><div className="calc-line"><span>Biaya bahan terpakai</span><b>{rupiah(hppUnit * (Number(hpp.resultPcs)||0))}</b></div><div className="calc-line"><span>Harga jual target</span><b>{hppUnit ? rupiah(hppUnit/(1-Number(hpp.targetMargin||40)/100)) : "—"}</b></div><div className="formula"><span>Formula</span><code>(Harga beli ÷ total isi × isi digunakan) ÷ hasil pcs</code></div><button className="primary wide" onClick={()=>{ if(hppUnit) setProducts(prev=>[{id:Date.now(),name:hpp.product||"Produk Baru",category:businessType,cost:Math.round(hppUnit),price:Math.round(hppUnit/(1-Number(hpp.targetMargin||40)/100)),sold:0},...prev]); }}>Simpan ke produk</button></Card></div></div>}

          {active==="price" && <div className="view"><SectionTitle icon={ShoppingBag} eyebrow="PRICE BUILDER" title="Kalkulator harga jual online" subtitle="Simulasikan diskon dan fee platform agar harga promo tetap menjaga penerimaanmu."/><div className="two-col"><Card><div className="field-grid"><label>Harga normal<input type="number" value={online.basePrice} onChange={e=>setOnline({...online,basePrice:e.target.value})}/></label><label>Platform<select value={online.platform} onChange={e=>setOnline({...online,platform:e.target.value})}><option>GoFood</option><option>GrabFood</option><option>ShopeeFood</option></select></label><label>Diskon promo (%)<input type="number" value={online.discount} onChange={e=>setOnline({...online,discount:e.target.value})}/></label><label>Fee platform (%)<input type="number" value={online.fee} onChange={e=>setOnline({...online,fee:e.target.value})}/><small>Isi sesuai kontrak / campaign yang kamu dapat</small></label><label>Biaya promo lain<input type="number" value={online.promo} onChange={e=>setOnline({...online,promo:e.target.value})}/></label></div></Card><Card className="result-card"><div className="platform-label">{online.platform}</div><div className="price-result">{rupiah(online.received)}</div><span>estimasi uang bersih setelah potongan</span><div className="price-breakdown"><div><span>Harga normal</span><b>{rupiah(online.basePrice)}</b></div><div><span>Diskon {online.discount}%</span><b>- {rupiah(online.basePrice-onlineCalc.afterDiscount)}</b></div><div><span>Fee {online.fee}%</span><b>- {rupiah(onlineCalc.fee)}</b></div><div><span>Promo lain</span><b>- {rupiah(onlineCalc.promo)}</b></div></div><div className="net-box"><span>Net retention</span><b>{onlineCalc.margin.toFixed(1)}%</b></div></Card></div><Card className="platform-cards"><div className="mini-platform"><b>GoFood</b><span>Atur fee sesuai kontrak merchant</span></div><div className="mini-platform"><b>GrabFood</b><span>Masukkan fee aktual pada akunmu</span></div><div className="mini-platform"><b>ShopeeFood</b><span>Gunakan simulasi sebelum ikut promo</span></div></Card></div>}

          {active==="sales" && <div className="view"><SectionTitle icon={ReceiptText} eyebrow="TRANSACTION LOG" title="Pencatatan penjualan" subtitle="Catat transaksi harian dengan channel yang jelas supaya laporanmu nggak berantakan."/><div className="two-col"><Card><form onSubmit={addSale}><div className="field-grid"><label>Produk<select value={sale.product} onChange={e=>setSale({...sale,product:e.target.value,price:products.find(p=>p.name===e.target.value)?.price||0})}>{products.map(p=><option key={p.id}>{p.name}</option>)}</select></label><label>Channel<select value={sale.channel} onChange={e=>setSale({...sale,channel:e.target.value})}><option>Offline</option><option>GoFood</option><option>GrabFood</option><option>ShopeeFood</option><option>WhatsApp</option><option>Marketplace</option></select></label><label>Qty<input type="number" min="1" value={sale.qty} onChange={e=>setSale({...sale,qty:e.target.value})}/></label><label>Harga / unit<input type="number" value={sale.price} onChange={e=>setSale({...sale,price:e.target.value})}/></label></div><button className="primary wide" type="submit"><Plus size={17}/> Simpan transaksi</button></form></Card><Card className="summary-side"><div className="summary-box"><small>Revenue sesi</small><b>{rupiah(totalRevenue)}</b><span>{sales.length} transaksi tercatat</span></div><div className="summary-box"><small>Produk aktif</small><b>{products.length}</b><span>Terakhir diperbarui hari ini</span></div></Card></div><Card className="products-card"><div className="card-head"><div><b>Transaksi terbaru</b><span>Data disimpan di browser untuk prototype</span></div></div><div className="table-wrap"><table><thead><tr><th>Tanggal</th><th>Produk</th><th>Channel</th><th>Qty</th><th>Total</th></tr></thead><tbody>{sales.map(s=><tr key={s.id}><td>{s.date}</td><td><b>{s.product}</b></td><td><span className="tag">{s.channel}</span></td><td>{s.qty}</td><td><b>{rupiah(s.total)}</b></td></tr>)}</tbody></table></div></Card></div>}

          {active==="analysis" && <div className="view"><SectionTitle icon={BarChart3} eyebrow="BUSINESS INTELLIGENCE" title="Analisis penjualan" subtitle="Baca tren, channel, dan produk supaya keputusanmu berbasis data—bukan feeling."/><div className="stats-grid compact"><Card><small>Revenue 7 hari</small><h3>{compactRupiah(demoSales.reduce((a,b)=>a+b.revenue,0))}</h3><span className="trend">↗ 18,4% <i>growth</i></span></Card><Card><small>Peak day</small><h3>1 Okt</h3><span className="muted">27 order</span></Card><Card><small>Average order</small><h3>{rupiah(66500)}</h3><span className="muted">target {rupiah(75000)}</span></Card><Card><small>Repeat signal</small><h3>28%</h3><span className="muted">estimasi pelanggan kembali</span></Card></div><div className="analysis-grid"><Card className="chart-card"><div className="card-head"><div><b>Revenue trend</b><span>Per hari</span></div></div><div className="chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={demoSales}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="date" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false} tickFormatter={(v)=>v/1000+"k"}/><Tooltip formatter={(v)=>rupiah(v)}/><Line type="monotone" dataKey="revenue" strokeWidth={3} dot={{r:4}}/></LineChart></ResponsiveContainer></div></Card><Card className="channel-card"><div className="card-head"><div><b>Channel mix</b><span>Distribusi transaksi</span></div></div><div className="donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{name:"Offline",value:43},{name:"GoFood",value:27},{name:"GrabFood",value:18},{name:"Lainnya",value:12}]} dataKey="value" nameKey="name" innerRadius={58} outerRadius={86} paddingAngle={4}><Cell fill="#171717"/><Cell fill="#646cff"/><Cell fill="#ff9d42"/><Cell fill="#b5b5b5"/></Pie><Legend verticalAlign="bottom"/></PieChart></ResponsiveContainer></div></Card></div><Card className="recommendation"><div className="rec-icon"><Lightbulb size={20}/></div><div><b>Decision prompts</b><p>Uji bundle Nasi Ayam + Es Kopi untuk menaikkan nilai keranjang. Bandingkan margin delivery setelah fee aktual dimasukkan. Produk jasa sebaiknya dipantau dengan waktu pengerjaan sebagai komponen biaya.</p></div></Card></div>}

          {active==="guide" && <div className="view"><SectionTitle icon={Lightbulb} eyebrow="BEGINNER MODE" title="Panduan mulai bisnis" subtitle="Urutan sederhana yang bisa kamu ikuti dari ide sampai keputusan pertama."/><div className="steps"><Card><span>01</span><h3>Pilih model bisnis</h3><p>Tentukan apakah kamu menjual produk F&amp;B atau jasa. Bedakan cara menghitung biaya dan kapasitasnya.</p><button className="link-btn" onClick={()=>setBusinessType("FnB")}>Pilih FnB <ChevronRight size={15}/></button></Card><Card><span>02</span><h3>Hitung HPP</h3><p>Masukkan harga beli, isi kemasan, jumlah yang digunakan, dan berapa output yang dihasilkan.</p><button className="link-btn" onClick={()=>setActive("hpp")}>Mulai hitung <ChevronRight size={15}/></button></Card><Card><span>03</span><h3>Uji harga jual</h3><p>Simulasikan harga online dengan potongan promo dan fee platform. Jangan lupa masukkan biaya aktual.</p><button className="link-btn" onClick={()=>setActive("price")}>Simulasikan <ChevronRight size={15}/></button></Card><Card><span>04</span><h3>Catat &amp; baca data</h3><p>Catat semua transaksi, lalu lihat tren revenue, AOV, dan kontribusi channel.</p><button className="link-btn" onClick={()=>setActive("analysis")}>Lihat analisis <ChevronRight size={15}/></button></Card></div><Card className="choose-business"><div><div className="eyebrow"><Users size={15}/> BUSINESS TYPE</div><h3>Bisnis kamu apa?</h3><p>Mode ini mempengaruhi contoh dan template yang tampil di sistem.</p></div><div className="business-switch"><button className={businessType==="FnB"?"selected":""} onClick={()=>setBusinessType("FnB")}>🍜 FnB</button><button className={businessType==="Jasa"?"selected":""} onClick={()=>setBusinessType("Jasa")}>🧩 Jasa</button></div></Card></div>}
        </section>
      </div>
    </main>
  );
}
