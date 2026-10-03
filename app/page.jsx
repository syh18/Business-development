"use client";

import { useMemo, useState } from "react";
import {
  LayoutDashboard, Package, Calculator, Tags, Receipt, BarChart3, Users,
  Settings, Plus, Search, Bell, ChevronDown, ArrowUpRight, ArrowDownRight,
  Sparkles, Menu, X, MoreHorizontal, WalletCards, ShoppingBag, Target,
  Lightbulb, CircleDollarSign, TrendingUp
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell
} from "recharts";

const salesData = [
  {day:"Sen", revenue:620000},{day:"Sel", revenue:810000},{day:"Rab", revenue:690000},
  {day:"Kam", revenue:940000},{day:"Jum", revenue:880000},{day:"Sab", revenue:1120000},
  {day:"Min", revenue:830000}
];
const channels = [
  {name:"Offline", value:43},{name:"GoFood", value:27},{name:"GrabFood", value:18},{name:"Lainnya", value:12}
];
const initialProducts = [
  {id:1,name:"Nasi Ayam Sambal",type:"FnB",hpp:10500,price:22000,sold:138},
  {id:2,name:"Es Kopi Susu",type:"FnB",hpp:5800,price:15000,sold:186},
  {id:3,name:"Paket Foto Produk",type:"Jasa",hpp:50000,price:175000,sold:24},
  {id:4,name:"Paket Hampers",type:"FnB",hpp:28500,price:65000,sold:41}
];
const rupiah = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Math.round(n||0));
const compact = n => n>=1000000 ? "Rp "+(n/1000000).toFixed(1).replace(".",",")+" jt" : rupiah(n);

const navGroups = [
  {label:"Overview",items:[["dashboard","Dashboard",LayoutDashboard]]},
  {label:"Bisnis",items:[["products","Produk & Jasa",Package],["hpp","HPP & Costing",Calculator],["pricing","Pricing",Tags],["sales","Penjualan",Receipt]]},
  {label:"Insights",items:[["analytics","Analytics",BarChart3],["customers","Pelanggan",Users]]}
];

function Card({children,className=""}){return <div className={"card "+className}>{children}</div>}
function Kpi({icon:Icon,label,value,change,positive=true,sub}){return <Card className="kpi"><div className="kpi-top"><span className="kpi-icon"><Icon size={17}/></span><button><MoreHorizontal size={17}/></button></div><span className="kpi-label">{label}</span><strong>{value}</strong><div className="kpi-foot">{change && <span className={positive?"up":"down"}>{positive?<ArrowUpRight size={13}/>:<ArrowDownRight size={13}/>} {change}</span>}<span>{sub}</span></div></Card>}

export default function Home(){
  const [active,setActive]=useState("dashboard");
  const [mobile,setMobile]=useState(false);
  const [workspace,setWorkspace]=useState("PRONGZ");
  const [businessType,setBusinessType]=useState("FnB");
  const [products,setProducts]=useState(initialProducts);
  const [search,setSearch]=useState("");
  const [hpp,setHpp]=useState({purchase:"",total:"",used:"",output:"",margin:40});
  const [pricing,setPricing]=useState({price:22000,discount:20,fee:20,promo:0,platform:"GoFood"});
  const [sales,setSales]=useState([{id:1,product:"Es Kopi Susu",channel:"GoFood",qty:3,total:45000,date:"03 Okt 2026"},{id:2,product:"Nasi Ayam Sambal",channel:"Offline",qty:4,total:88000,date:"03 Okt 2026"},{id:3,product:"Paket Hampers",channel:"WhatsApp",qty:2,total:130000,date:"02 Okt 2026"}]);
  const [sale,setSale]=useState({product:"Nasi Ayam Sambal",channel:"Offline",qty:1});

  const revenue=sales.reduce((a,b)=>a+b.total,0)+5890000;
  const orders=sales.reduce((a,b)=>a+b.qty,0)+184;
  const hppUnit=useMemo(()=>{let p=+hpp.purchase,t=+hpp.total,u=+hpp.used,o=+hpp.output;return p&&t&&u&&o?(p/t*u)/o:0},[hpp]);
  const net=useMemo(()=>{const base=+pricing.price||0;const after=base*(1-(+pricing.discount||0)/100);const fee=after*(+pricing.fee||0)/100;const promo=+pricing.promo||0;return Math.max(0,after-fee-promo)},[pricing]);
  const filtered=products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));

  function go(id){setActive(id);setMobile(false)}
  function addSale(e){e.preventDefault();const p=products.find(x=>x.name===sale.product);const qty=+sale.qty||1;setSales(s=>[{id:Date.now(),product:sale.product,channel:sale.channel,qty,total:qty*(p?.price||0),date:new Date().toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})},...s]);go("sales")}
  function addProduct(e){e.preventDefault();const f=new FormData(e.currentTarget);const name=f.get("name")?.toString().trim();if(!name)return;const h=+f.get("hpp")||0,p=+f.get("price")||0;setProducts(x=>[{id:Date.now(),name,type:businessType,hpp:h,price:p,sold:0},...x]);e.currentTarget.reset()}

  const title={dashboard:"Dashboard",products:"Produk & Jasa",hpp:"HPP & Costing",pricing:"Pricing",sales:"Penjualan",analytics:"Analytics",customers:"Pelanggan"}[active];

  return <div className="shell">
    <aside className={mobile?"sidebar open":"sidebar"}>
      <div className="brand"><div className="brand-logo">B</div><div><b>bisniz</b><span>business operating system</span></div><button className="mobile-close" onClick={()=>setMobile(false)}><X size={18}/></button></div>
      <button className="workspace-picker"><span className="workspace-avatar">{workspace.slice(0,2)}</span><span><small>WORKSPACE</small><b>{workspace}</b></span><ChevronDown size={15}/></button>
      <nav>{navGroups.map(g=><div className="nav-group" key={g.label}><small>{g.label}</small>{g.items.map(([id,label,Icon])=><button key={id} onClick={()=>go(id)} className={active===id?"active":""}><Icon size={17}/><span>{label}</span>{id==="analytics"&&<em>AI</em>}</button>)}</div>)}</nav>
      <div className="sidebar-bottom"><button className="add-workspace"><Plus size={16}/> Workspace baru</button><button className="side-link"><Settings size={17}/> Pengaturan</button><div className="profile"><div className="avatar">SY</div><div><b>Syarief</b><span>Business owner</span></div><MoreHorizontal size={16}/></div></div>
    </aside>

    <main className="main">
      <header className="topbar"><div className="mobile-title"><button className="menu" onClick={()=>setMobile(true)}><Menu size={20}/></button><div><small>Workspace / {workspace}</small><h1>{title}</h1></div></div><div className="topbar-actions"><div className="search"><Search size={16}/><input placeholder="Cari apa saja..." value={search} onChange={e=>setSearch(e.target.value)}/><kbd>⌘ K</kbd></div><button className="icon-btn"><Bell size={18}/><i/></button><button className="user-btn"><span>SY</span><ChevronDown size={14}/></button></div></header>

      {active==="dashboard"&&<div className="page">
        <div className="welcome"><div><span className="eyebrow"><Sparkles size={14}/> BUSINESS PULSE</span><h2>Halo, Syarief. <span>Bisnis kamu lagi gimana?</span></h2><p>Ini ringkasan yang paling penting untuk kamu cek hari ini.</p></div><button className="primary" onClick={()=>go("sales")}><Plus size={16}/> Catat penjualan</button></div>
        <div className="kpi-grid"><Kpi icon={CircleDollarSign} label="Total revenue" value={compact(revenue)} change="+18,4%" sub="vs periode lalu"/><Kpi icon={WalletCards} label="Estimasi profit" value={compact(3984000)} change="+14,2%" sub="gross profit"/><Kpi icon={ShoppingBag} label="Total orders" value={orders} change="+12,1%" sub="transaksi"/><Kpi icon={Target} label="Average order" value={rupiah(66500)} change="+8,6%" sub="vs target Rp75k"/></div>
        <div className="dashboard-grid"><Card className="chart-card"><div className="card-head"><div><b>Revenue overview</b><span>7 hari terakhir</span></div><select><option>7 hari</option><option>30 hari</option></select></div><div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={salesData}><defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#635bff" stopOpacity=".25"/><stop offset="100%" stopColor="#635bff" stopOpacity="0"/></linearGradient></defs><XAxis dataKey="day" axisLine={false} tickLine={false}/><YAxis hide/><Tooltip formatter={v=>rupiah(v)}/><Area type="monotone" dataKey="revenue" stroke="#635bff" strokeWidth={3} fill="url(#rev)"/></AreaChart></ResponsiveContainer></div></Card>
          <Card className="pulse-card"><div className="card-head"><div><b>Business pulse</b><span>Insight otomatis</span></div><Sparkles size={17} color="#635bff"/></div><div className="insight"><span className="insight-dot green"/><div><b>Revenue tumbuh</b><p>Penjualan 7 hari terakhir naik 18,4% dibanding periode sebelumnya.</p></div></div><div className="insight"><span className="insight-dot orange"/><div><b>Delivery perlu dicek</b><p>Margin produk turun saat diskon + fee platform diterapkan.</p></div></div><div className="insight"><span className="insight-dot purple"/><div><b>Opportunity</b><p>Bundling produk terlaris berpotensi menaikkan AOV.</p></div></div><button className="text-btn" onClick={()=>go("analytics")}>Lihat semua insight <ArrowUpRight size={15}/></button></Card></div>
        <div className="bottom-grid"><Card><div className="card-head"><div><b>Produk terlaris</b><span>30 hari terakhir</span></div><button className="text-btn" onClick={()=>go("products")}>Lihat semua</button></div>{products.slice(0,4).map((p,i)=><div className="product-row" key={p.id}><span className="rank">{i+1}</span><div className="product-meta"><b>{p.name}</b><small>{p.type} · {p.sold} unit terjual</small></div><div className="product-value"><b>{rupiah(p.price)}</b><small>{(((p.price-p.hpp)/p.price)*100).toFixed(0)}% margin</small></div></div>)}</Card>
          <Card><div className="card-head"><div><b>Channel mix</b><span>Distribusi revenue</span></div></div><div className="donut-wrap"><ResponsiveContainer width="52%" height={180}><PieChart><Pie data={channels} dataKey="value" innerRadius={48} outerRadius={70} paddingAngle={3}>{channels.map((_,i)=><Cell key={i} fill={["#635bff","#8b83ff","#a9a4ff","#d8d6ff"][i]}/>)}</Pie></PieChart></ResponsiveContainer><div className="legend">{channels.map((c,i)=><div key={c.name}><i style={{background:["#635bff","#8b83ff","#a9a4ff","#d8d6ff"][i]}}/><span>{c.name}</span><b>{c.value}%</b></div>)}</div></div></Card></div>
      </div>}

      {active==="products"&&<div className="page"><div className="page-head"><div><span className="eyebrow">CATALOG</span><h2>Produk & Jasa</h2><p>Kelola produk, HPP, harga jual, dan margin dalam satu tempat.</p></div><button className="primary" onClick={()=>document.getElementById("product-name")?.focus()}><Plus size={16}/> Tambah produk</button></div><Card><form className="inline-form" onSubmit={addProduct}><input id="product-name" name="name" placeholder="Nama produk / jasa" required/><select value={businessType} onChange={e=>setBusinessType(e.target.value)}><option>FnB</option><option>Jasa</option></select><input name="hpp" type="number" placeholder="HPP / unit"/><input name="price" type="number" placeholder="Harga jual"/><button className="primary">Simpan</button></form></Card><Card className="table-card"><div className="table-wrap"><table><thead><tr><th>Produk</th><th>Jenis</th><th>HPP</th><th>Harga jual</th><th>Margin</th><th>Terjual</th><th/></tr></thead><tbody>{filtered.map(p=>{const m=((p.price-p.hpp)/p.price)*100;return <tr key={p.id}><td><b>{p.name}</b></td><td><span className="tag">{p.type}</span></td><td>{rupiah(p.hpp)}</td><td>{rupiah(p.price)}</td><td><span className={m>=40?"status good":"status warn"}>{m.toFixed(0)}%</span></td><td>{p.sold}</td><td><MoreHorizontal size={16}/></td></tr>})}</tbody></table></div></Card></div>}

      {active==="hpp"&&<div className="page"><div className="page-head"><div><span className="eyebrow">UNIT ECONOMICS</span><h2>HPP & Costing</h2><p>Hitung biaya per unit dari bahan yang kamu beli dan gunakan.</p></div></div><div className="two-col"><Card><h3>Input biaya</h3><div className="form-grid"><label>Harga beli<input type="number" placeholder="60000" value={hpp.purchase} onChange={e=>setHpp({...hpp,purchase:e.target.value})}/></label><label>Total isi<input type="number" placeholder="2000" value={hpp.total} onChange={e=>setHpp({...hpp,total:e.target.value})}/></label><label>Isi digunakan<input type="number" placeholder="250" value={hpp.used} onChange={e=>setHpp({...hpp,used:e.target.value})}/></label><label>Hasil produksi (pcs)<input type="number" placeholder="10" value={hpp.output} onChange={e=>setHpp({...hpp,output:e.target.value})}/></label><label>Target margin (%)<input type="number" value={hpp.margin} onChange={e=>setHpp({...hpp,margin:e.target.value})}/></label></div><div className="formula">HPP = (harga beli ÷ total isi × isi digunakan) ÷ hasil produksi</div></Card><Card className="result"><span className="eyebrow">ESTIMASI HPP</span><strong>{rupiah(hppUnit)}</strong><span>per unit</span><div className="result-line"><span>Harga jual rekomendasi</span><b>{hppUnit?rupiah(hppUnit/(1-(+hpp.margin||40)/100)):"—"}</b></div><button className="primary full" onClick={()=>go("pricing")}>Lanjut ke pricing <ArrowUpRight size={15}/></button></Card></div></div>}

      {active==="pricing"&&<div className="page"><div className="page-head"><div><span className="eyebrow">PRICE BUILDER</span><h2>Pricing simulator</h2><p>Simulasikan harga delivery tanpa menebak uang bersih yang kamu terima.</p></div></div><div className="two-col"><Card><div className="form-grid"><label>Harga normal<input type="number" value={pricing.price} onChange={e=>setPricing({...pricing,price:e.target.value})}/></label><label>Platform<select value={pricing.platform} onChange={e=>setPricing({...pricing,platform:e.target.value})}><option>GoFood</option><option>GrabFood</option><option>ShopeeFood</option></select></label><label>Diskon (%)<input type="number" value={pricing.discount} onChange={e=>setPricing({...pricing,discount:e.target.value})}/></label><label>Fee platform (%)<input type="number" value={pricing.fee} onChange={e=>setPricing({...pricing,fee:e.target.value})}/></label><label>Promo lain<input type="number" value={pricing.promo} onChange={e=>setPricing({...pricing,promo:e.target.value})}/></label></div><p className="hint">Fee platform sebaiknya diisi berdasarkan kontrak/campaign merchant kamu.</p></Card><Card className="price-result"><span className="platform-chip">{pricing.platform}</span><small>Estimasi diterima</small><strong>{rupiah(net)}</strong><div className="breakdown"><span>Harga normal <b>{rupiah(pricing.price)}</b></span><span>Diskon <b>- {rupiah((+pricing.price||0)*(+pricing.discount||0)/100)}</b></span><span>Fee <b>- {rupiah((+pricing.price||0)*(1-(+pricing.discount||0)/100)*(+pricing.fee||0)/100)}</b></span></div><div className="net-retain">Net retention <b>{pricing.price?(net/pricing.price*100).toFixed(1):0}%</b></div></Card></div></div>}

      {active==="sales"&&<div className="page"><div className="page-head"><div><span className="eyebrow">TRANSACTIONS</span><h2>Penjualan</h2><p>Catat transaksi supaya dashboard dan analytics terus hidup.</p></div></div><div className="two-col"><Card><form onSubmit={addSale}><div className="form-grid"><label>Produk<select value={sale.product} onChange={e=>setSale({...sale,product:e.target.value})}>{products.map(p=><option key={p.id}>{p.name}</option>)}</select></label><label>Channel<select value={sale.channel} onChange={e=>setSale({...sale,channel:e.target.value})}><option>Offline</option><option>GoFood</option><option>GrabFood</option><option>ShopeeFood</option><option>WhatsApp</option></select></label><label>Qty<input type="number" min="1" value={sale.qty} onChange={e=>setSale({...sale,qty:e.target.value})}/></label></div><button className="primary full"><Plus size={16}/> Simpan transaksi</button></form></Card><Card className="mini-summary"><span>Revenue hari ini</span><strong>{rupiah(263000)}</strong><small>+16,8% vs kemarin</small></Card></div><Card className="table-card"><div className="card-head"><div><b>Transaksi terbaru</b><span>Data prototype tersimpan selama sesi</span></div></div><div className="table-wrap"><table><thead><tr><th>Tanggal</th><th>Produk</th><th>Channel</th><th>Qty</th><th>Total</th></tr></thead><tbody>{sales.map(s=><tr key={s.id}><td>{s.date}</td><td><b>{s.product}</b></td><td><span className="tag">{s.channel}</span></td><td>{s.qty}</td><td><b>{rupiah(s.total)}</b></td></tr>)}</tbody></table></div></Card></div>}

      {active==="analytics"&&<div className="page"><div className="page-head"><div><span className="eyebrow">BUSINESS INTELLIGENCE</span><h2>Analytics</h2><p>Ubah data transaksi menjadi keputusan bisnis yang lebih jelas.</p></div></div><div className="kpi-grid"><Kpi icon={TrendingUp} label="Growth" value="+18,4%" change="+3,2%" sub="momentum"/><Kpi icon={CircleDollarSign} label="Gross margin" value="44,8%" change="+2,1%" sub="vs periode lalu"/><Kpi icon={ShoppingBag} label="Best seller" value="Es Kopi" sub="186 unit"/><Kpi icon={Target} label="Target revenue" value="82%" sub="progress"/></div><div className="dashboard-grid"><Card className="chart-card"><div className="card-head"><div><b>Revenue trend</b><span>7 hari terakhir</span></div></div><div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={salesData}><defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#635bff" stopOpacity=".2"/><stop offset="100%" stopColor="#635bff" stopOpacity="0"/></linearGradient></defs><XAxis dataKey="day" axisLine={false} tickLine={false}/><YAxis hide/><Tooltip formatter={v=>rupiah(v)}/><Area type="monotone" dataKey="revenue" stroke="#635bff" strokeWidth={3} fill="url(#a)"/></AreaChart></ResponsiveContainer></div></Card><Card><div className="card-head"><div><b>Actionable insights</b><span>Prioritas yang bisa dicek</span></div></div><div className="action"><Lightbulb size={17}/><div><b>Naikkan AOV</b><p>Coba bundling produk dengan kontribusi margin tinggi.</p></div></div><div className="action"><Calculator size={17}/><div><b>Review HPP</b><p>Pastikan bahan utama dan packaging ikut dihitung.</p></div></div><div className="action"><Tags size={17}/><div><b>Review pricing</b><p>Simulasikan harga setelah diskon dan fee delivery.</p></div></div></Card></div></div>}

      {active==="customers"&&<div className="page"><div className="page-head"><div><span className="eyebrow">CUSTOMER</span><h2>Pelanggan</h2><p>Modul pelanggan untuk memahami siapa yang membeli dan kapan mereka kembali.</p></div></div><div className="empty-state"><Users size={30}/><h3>Customer intelligence segera hadir</h3><p>Struktur modulnya sudah disiapkan untuk menyimpan profil, riwayat pembelian, repeat rate, dan customer value.</p><button className="primary" onClick={()=>go("dashboard")}>Kembali ke dashboard</button></div></div>}
    </main>
    <div className="mobile-nav">{[["dashboard",LayoutDashboard,"Home"],["products",Package,"Produk"],["sales",Receipt,"Sales"],["analytics",BarChart3,"Analytics"]].map(([id,I,l])=><button className={active===id?"active":""} onClick={()=>go(id)} key={id}><I size={19}/><span>{l}</span></button>)}</div>
  </div>
}
