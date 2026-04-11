import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  RefreshCw,
  Printer,
  Download,
  Calendar,
} from "lucide-react";
import { AdminContext } from "../../../context/AdminContext";

const COLORS = [
  "#145faf",
  "#D93A6A",
  "#16a34a",
  "#f59e0b",
  "#a855f7",
  "#06b6d4",
];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const fmt = (n) =>
  n >= 100000
    ? `Rs.${(n / 100000).toFixed(1)}L`
    : n >= 1000
      ? `Rs.${(n / 1000).toFixed(1)}K`
      : `Rs.${(n || 0).toLocaleString()}`;
const fmtFull = (n) => `Rs. ${(n || 0).toLocaleString()}`;

// ── SVG Bar Chart ─────────────────────────────────────────────────────────────
const BarChart = ({ data, color = "#145faf" }) => {
  const W = 540,
    H = 170,
    PL = 48,
    PB = 28,
    PT = 8,
    PR = 8;
  const iW = W - PL - PR,
    iH = H - PB - PT;
  const max = Math.max(...data.map((d) => d.value), 1);
  const bw = Math.floor(iW / data.length) - 6;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[0, 0.5, 1].map((p, i) => {
        const y = PT + iH - p * iH;
        return (
          <g key={i}>
            <line
              x1={PL}
              x2={PL + iW}
              y1={y}
              y2={y}
              stroke="#f1f5f9"
              strokeWidth="1"
            />
            <text
              x={PL - 6}
              y={y + 4}
              textAnchor="end"
              fontSize="9"
              fill="#94a3b8"
            >
              {p === 0 ? "0" : p === 0.5 ? fmt(max / 2) : fmt(max)}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const x = PL + i * (iW / data.length) + 3;
        const bh = Math.max(3, (d.value / max) * iH);
        const y = PT + iH - bh;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={bw}
              height={bh}
              rx="3"
              fill={color}
              opacity="0.85"
            >
              <title>
                {d.label}: {fmtFull(d.value)}
              </title>
            </rect>
            <text
              x={x + bw / 2}
              y={H - PB + 14}
              textAnchor="middle"
              fontSize="9"
              fill="#64748b"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ── SVG Line Chart ────────────────────────────────────────────────────────────
const LineChart = ({ data, color = "#D93A6A", unit = "" }) => {
  const W = 540,
    H = 150,
    PL = 44,
    PB = 26,
    PT = 12,
    PR = 12;
  const iW = W - PL - PR,
    iH = H - PB - PT;
  const max = Math.max(...data.map((d) => d.value), 1);
  const pts = data.map((d, i) => ({
    x: PL + (i / Math.max(data.length - 1, 1)) * iW,
    y: PT + iH - (d.value / max) * iH,
    ...d,
  }));
  const pathD = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const areaD =
    pts.length > 1
      ? `${pathD} L${pts[pts.length - 1].x},${PT + iH} L${pts[0].x},${PT + iH} Z`
      : "";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <defs>
        <linearGradient
          id={`lg-${color.replace("#", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((p, i) => {
        const y = PT + iH - p * iH;
        return (
          <g key={i}>
            <line
              x1={PL}
              x2={PL + iW}
              y1={y}
              y2={y}
              stroke="#f1f5f9"
              strokeWidth="1"
            />
            <text
              x={PL - 5}
              y={y + 4}
              textAnchor="end"
              fontSize="9"
              fill="#94a3b8"
            >
              {p === 0 ? "0" : Math.round(max * p)}
              {unit}
            </text>
          </g>
        );
      })}
      {areaD && <path d={areaD} fill={`url(#lg-${color.replace("#", "")})`} />}
      {pathD && (
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {pts.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r="4"
            fill={color}
            stroke="#fff"
            strokeWidth="2"
          >
            <title>
              {p.label}: {p.value}
              {unit}
            </title>
          </circle>
          <text
            x={p.x}
            y={H - PB + 14}
            textAnchor="middle"
            fontSize="9"
            fill="#64748b"
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

// ── Donut Chart ───────────────────────────────────────────────────────────────
const DonutChart = ({ data, size = 130 }) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const R = 46,
    CX = 65,
    CY = 65,
    SW = 22,
    circ = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div className="flex items-center gap-5">
      <svg
        viewBox="0 0 130 130"
        style={{ width: size, height: size, flexShrink: 0 }}
      >
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={SW}
        />
        {data.map((d, i) => {
          const pct = d.value / total;
          const seg = (
            <circle
              key={i}
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={SW}
              strokeDasharray={`${pct * circ} ${circ}`}
              strokeDashoffset={-offset * circ}
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: `${CX}px ${CY}px`,
              }}
            >
              <title>
                {d.label}: {d.value}
              </title>
            </circle>
          );
          offset += pct;
          return seg;
        })}
        <text
          x={CX}
          y={CY - 4}
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill="#1e293b"
        >
          {data.length}
        </text>
        <text
          x={CX}
          y={CY + 12}
          textAnchor="middle"
          fontSize="8"
          fill="#94a3b8"
        >
          types
        </text>
      </svg>
      <div className="space-y-1.5 min-w-0 flex-1">
        {data.slice(0, 6).map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="text-gray-500 truncate capitalize">{d.label}</span>
            <span className="font-bold text-gray-800 ml-auto">
              {Math.round((d.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── KPI Card ─────────────────────────────────────────────────────────────────
const KPICard = ({ icon, label, value, sub, trend, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 print-card">
    <div className="flex items-start justify-between mb-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: color + "1a" }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      {trend !== undefined && (
        <span
          className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full ${trend >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
        >
          {trend >= 0 ? (
            <ArrowUpRight size={11} />
          ) : (
            <ArrowDownRight size={11} />
          )}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    {sub && <p className="text-xs text-gray-300 mt-1">{sub}</p>}
  </div>
);

// ── Main ReportsPage ──────────────────────────────────────────────────────────
const ReportsPage = () => {
  const { getAllOrders, getAllProducts, getAllUsers } =
    useContext(AdminContext);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");
  const printRef = useRef();

  const load = async () => {
    setLoading(true);
    try {
      const [o, p, u] = await Promise.all([
        getAllOrders(),
        getAllProducts(),
        getAllUsers(),
      ]);
      setOrders(Array.isArray(o) ? o : []);
      setProducts(Array.isArray(p) ? p : []);
      setUsers(Array.isArray(u) ? u : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const an = useMemo(() => {
    const now = new Date(),
      cm = now.getMonth(),
      cy = now.getFullYear();
    const inPeriod = (s) => {
      const d = new Date(s);
      if (period === "month")
        return d.getMonth() === cm && d.getFullYear() === cy;
      if (period === "year") return d.getFullYear() === cy;
      return true;
    };
    const prevMonth = (s) => {
      const d = new Date(s),
        pm = cm === 0 ? 11 : cm - 1,
        py = cm === 0 ? cy - 1 : cy;
      return d.getMonth() === pm && d.getFullYear() === py;
    };
    const pOrd = orders.filter((o) => inPeriod(o.createdAt)),
      prevOrd = orders.filter((o) => prevMonth(o.createdAt));
    const rev = pOrd.reduce((s, o) => s + (o.totalPrice || 0), 0),
      prevRev = prevOrd.reduce((s, o) => s + (o.totalPrice || 0), 0);
    const revTrend =
      prevRev === 0 ? 100 : Math.round(((rev - prevRev) / prevRev) * 100);
    const ordTrend =
      prevOrd.length === 0
        ? 100
        : Math.round(
            ((pOrd.length - prevOrd.length) / Math.max(prevOrd.length, 1)) *
              100,
          );
    const pUsers = users.filter((u) => inPeriod(u.createdAt)),
      prevUsers = users.filter((u) => prevMonth(u.createdAt));
    const userTrend =
      prevUsers.length === 0
        ? 0
        : Math.round(
            ((pUsers.length - prevUsers.length) /
              Math.max(prevUsers.length, 1)) *
              100,
          );

    // 6-month charts
    const months6 = Array.from({ length: 6 }, (_, i) => {
      const mIdx = (cm - 5 + i + 12) % 12,
        yr = mIdx > cm ? cy - 1 : cy;
      return { mIdx, yr, label: MONTHS[mIdx] };
    });
    const mRevenue = months6.map(({ mIdx, yr, label }) => ({
      label,
      value: orders
        .filter((o) => {
          const d = new Date(o.createdAt);
          return d.getMonth() === mIdx && d.getFullYear() === yr;
        })
        .reduce((s, o) => s + (o.totalPrice || 0), 0),
    }));
    const mOrders = months6.map(({ mIdx, yr, label }) => ({
      label,
      value: orders.filter((o) => {
        const d = new Date(o.createdAt);
        return d.getMonth() === mIdx && d.getFullYear() === yr;
      }).length,
    }));
    const mUsers = months6.map(({ mIdx, yr, label }) => ({
      label,
      value: users.filter((u) => {
        const d = new Date(u.createdAt);
        return d.getMonth() === mIdx && d.getFullYear() === yr;
      }).length,
    }));

    // Status map
    const statusMap = {};
    orders.forEach((o) => {
      const s = o.status || "pending";
      statusMap[s] = (statusMap[s] || 0) + 1;
    });
    const statusData = Object.entries(statusMap).map(([label, value]) => ({
      label,
      value,
    }));

    // Category map
    const catMap = {};
    products.forEach((p) => {
      const c = p.category || "other";
      catMap[c] = (catMap[c] || 0) + 1;
    });
    const catData = Object.entries(catMap).map(([label, value]) => ({
      label,
      value,
    }));

    // Payment map
    const payMap = {};
    orders.forEach((o) => {
      const m = o.paymentMethod || "unknown";
      payMap[m] = (payMap[m] || 0) + 1;
    });
    const payData = Object.entries(payMap).map(([label, value]) => ({
      label,
      value,
    }));

    // Top products
    const topProducts = products.slice(0, 5).map((p, i) => {
      const cnt = orders.filter((o) =>
        o.orderItems?.some(
          (oi) =>
            String(oi.product) === String(p._id) ||
            String(oi.product?._id) === String(p._id),
        ),
      ).length;
      return { name: p.name, cnt, color: COLORS[i % COLORS.length] };
    });
    const maxCnt = Math.max(...topProducts.map((p) => p.cnt), 1);
    topProducts.forEach((p) => {
      p.pct = Math.max(4, Math.round((p.cnt / maxCnt) * 100));
    });

    return {
      rev,
      prevRev,
      revTrend,
      orderCount: pOrd.length,
      ordTrend,
      newCustomers: pUsers.length,
      userTrend,
      activeProducts: products.filter((p) => p.isActive !== false).length,
      mRevenue,
      mOrders,
      mUsers,
      statusData,
      catData,
      payData,
      topProducts,
      avgOrder: pOrd.length ? Math.round(rev / pOrd.length) : 0,
      delivered: orders.filter((o) => o.status === "delivered").length,
      pending: orders.filter((o) => o.status === "pending").length,
      totalRev: orders.reduce((s, o) => s + (o.totalPrice || 0), 0),
    };
  }, [orders, products, users, period]);

  // ── Print handler ───────────────────────────────────────────────────────────
  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank");
    const periodLabel =
      period === "month"
        ? "This Month"
        : period === "year"
          ? "This Year"
          : "All Time";
    win.document
      .write(`<!DOCTYPE html><html><head><title>Radhana Art - Report (${periodLabel})</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:'Poppins',sans-serif;font-size:12px;color:#1e293b;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
      .wrap{max-width:1000px;margin:auto;padding:32px}
      .header{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;padding-bottom:18px;border-bottom:2px solid #f1f5f9}
      .company{font-size:20px;font-weight:700;color:#0f172a}
      .report-meta{text-align:right;font-size:11px;color:#94a3b8}
      .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
      .kpi{background:#f8fafc;border-radius:10px;padding:14px;border:1px solid #e2e8f0}
      .kpi-val{font-size:22px;font-weight:700;color:#0f172a;margin-bottom:2px}
      .kpi-label{font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em}
      .kpi-trend-up{color:#16a34a;font-size:10px;font-weight:600}
      .kpi-trend-down{color:#ef4444;font-size:10px;font-weight:600}
      .section{background:#f8fafc;border-radius:10px;padding:16px;border:1px solid #e2e8f0;margin-bottom:16px}
      .section-title{font-size:12px;font-weight:600;color:#475569;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.05em}
      .chart-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
      .chart-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:16px}
      table{width:100%;border-collapse:collapse}
      th{text-align:left;padding:8px 10px;font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid #e2e8f0}
      td{padding:8px 10px;font-size:11px;border-bottom:1px solid #f1f5f9}
      .bar-wrap{background:#e2e8f0;border-radius:4px;height:8px;overflow:hidden;margin-top:4px}
      .bar-fill{height:100%;border-radius:4px}
      svg{width:100%}
      .badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600}
      .footer{margin-top:24px;padding-top:14px;border-top:1px solid #f1f5f9;text-align:center;font-size:10px;color:#94a3b8}
      @media print{body{margin:0}@page{size:A4;margin:15mm}}
    </style></head><body><div class="wrap">${content}</div></body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 600);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-gray-400">
        <RefreshCw size={26} className="animate-spin mb-3 text-primary-600" />
        <p className="text-sm font-medium">Loading analytics…</p>
      </div>
    );

  const periodLabel =
    period === "month"
      ? "This Month"
      : period === "year"
        ? "This Year"
        : "All Time";

  return (
    <div className="space-y-5 font-poppins">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Live data from orders, products and customers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-xl p-1 text-xs font-medium">
            {[
              ["month", "This Month"],
              ["year", "This Year"],
              ["all", "All Time"],
            ].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setPeriod(v)}
                className={`px-3 py-1.5 rounded-lg transition-all ${period === v ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                {l}
              </button>
            ))}
          </div>
          <button
            onClick={load}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-900 transition-colors shadow-sm"
          >
            <Printer size={13} /> Print / PDF
          </button>
        </div>
      </div>

      {/* ── Printable content ── */}
      <div ref={printRef}>
        {/* Print-only header */}
        <div className="hidden" style={{ display: "none" }} id="print-header">
          <div className="header">
            <div>
              <div className="company">Radhana Enterprises</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>
                PAN: 128464005 · Sitapaila, Kathmandu
              </div>
            </div>
            <div className="report-meta">
              <div style={{ fontWeight: 600, fontSize: 13 }}>
                Business Report — {periodLabel}
              </div>
              <div>
                Generated:{" "}
                {new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 kpi-grid">
          <KPICard
            icon={<IndianRupee size={18} />}
            label="Revenue"
            value={fmt(an.rev)}
            sub={`Prev: ${fmt(an.prevRev)}`}
            trend={an.revTrend}
            color="#145faf"
          />
          <KPICard
            icon={<ShoppingBag size={18} />}
            label="Orders"
            value={an.orderCount}
            sub={`${an.pending} pending`}
            trend={an.ordTrend}
            color="#D93A6A"
          />
          <KPICard
            icon={<Users size={18} />}
            label="New Customers"
            value={an.newCustomers}
            sub={`${users.length} total`}
            trend={an.userTrend}
            color="#16a34a"
          />
          <KPICard
            icon={<Package size={18} />}
            label="Active Products"
            value={an.activeProducts}
            sub={`${products.length} total`}
            color="#f59e0b"
          />
        </div>

        {/* Revenue + Orders charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 chart-row">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 section">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  Monthly Revenue
                </p>
                <p className="text-xs text-gray-400">Last 6 months</p>
              </div>
              <BarChart2 size={15} className="text-primary-600" />
            </div>
            <BarChart data={an.mRevenue} color="#145faf" />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 section">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  Order Volume
                </p>
                <p className="text-xs text-gray-400">Last 6 months</p>
              </div>
              <TrendingUp size={15} className="text-accent-600" />
            </div>
            <LineChart data={an.mOrders} color="#D93A6A" />
          </div>
        </div>

        {/* Status + Payment + Customers charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 chart-row-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 section">
            <p className="font-semibold text-gray-800 text-sm mb-4">
              Orders by Status
            </p>
            {an.statusData.length > 0 ? (
              <DonutChart data={an.statusData} />
            ) : (
              <p className="text-xs text-gray-300 py-8 text-center">
                No data yet
              </p>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 section">
            <p className="font-semibold text-gray-800 text-sm mb-4">
              Payment Methods
            </p>
            <div className="space-y-3">
              {an.payData.length > 0 ? (
                an.payData.map((d, i) => {
                  const tot = an.payData.reduce((s, x) => s + x.value, 0);
                  const pct = Math.round((d.value / tot) * 100);
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="capitalize text-gray-600 font-medium">
                          {d.label}
                        </span>
                        <span className="font-bold text-gray-800">
                          {d.value}{" "}
                          <span className="text-gray-400">({pct}%)</span>
                        </span>
                      </div>
                      <div className="bar-wrap h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="bar-fill h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: COLORS[i % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-gray-300 py-8 text-center">
                  No data yet
                </p>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 section">
            <p className="font-semibold text-gray-800 text-sm mb-4">
              New Customers
            </p>
            <LineChart data={an.mUsers} color="#16a34a" />
          </div>
        </div>

        {/* Top Products + Category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 chart-row">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 section">
            <p className="font-semibold text-gray-800 text-sm mb-4">
              Top Products by Orders
            </p>
            {an.topProducts.length > 0 ? (
              <div className="space-y-4">
                {an.topProducts.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: p.color }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-700 font-medium truncate">
                          {p.name}
                        </span>
                        <span className="text-gray-400 shrink-0 ml-2">
                          {p.cnt} orders
                        </span>
                      </div>
                      <div className="bar-wrap h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="bar-fill h-full rounded-full"
                          style={{ width: `${p.pct}%`, background: p.color }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-300 py-8 text-center">
                No product data yet
              </p>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 section">
            <p className="font-semibold text-gray-800 text-sm mb-4">
              Products by Category
            </p>
            {an.catData.length > 0 ? (
              <DonutChart data={an.catData} />
            ) : (
              <p className="text-xs text-gray-300 py-8 text-center">
                No data yet
              </p>
            )}
          </div>
        </div>

        {/* Summary table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 section">
          <p className="font-semibold text-gray-800 text-sm mb-4">
            Business Summary — {periodLabel}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2.5 px-3 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Metric
                  </th>
                  <th className="text-right py-2.5 px-3 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    {periodLabel}
                  </th>
                  <th className="text-right py-2.5 px-3 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    All Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    label: "Total Revenue",
                    cur: fmtFull(an.rev),
                    all: fmtFull(an.totalRev),
                  },
                  {
                    label: "Order Count",
                    cur: an.orderCount,
                    all: orders.length,
                  },
                  {
                    label: "Avg. Order Value",
                    cur: fmtFull(an.avgOrder),
                    all: fmtFull(
                      orders.length
                        ? Math.round(an.totalRev / orders.length)
                        : 0,
                    ),
                  },
                  {
                    label: "New Customers",
                    cur: an.newCustomers,
                    all: users.length,
                  },
                  { label: "Delivered Orders", cur: "—", all: an.delivered },
                  { label: "Pending Orders", cur: "—", all: an.pending },
                  {
                    label: "Active Products",
                    cur: "—",
                    all: an.activeProducts,
                  },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/40"}`}
                  >
                    <td className="py-2.5 px-3 text-gray-700 font-medium text-sm">
                      {row.label}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-primary-600 text-sm">
                      {row.cur}
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-500 text-sm">
                      {row.all}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Print footer */}
        <div className="footer hidden print:block mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
          Radhana Enterprises · Sitapaila, Kathmandu · +977 9823939106 ·
          radhanaart@gmail.com &nbsp;|&nbsp; Report generated{" "}
          {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
