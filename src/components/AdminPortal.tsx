import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  MessageSquare, 
  Sparkles, 
  RefreshCw, 
  Calendar, 
  Download, 
  ChefHat, 
  CheckCircle2, 
  Clock, 
  Send,
  FileText,
  Mail,
  Phone,
  Tag,
  Database,
  ExternalLink,
  ShieldCheck,
  Server,
  Flame,
  PieChart as PieIcon,
  IndianRupee,
  Layers,
  ArrowUpRight,
  Filter,
  Key,
  Copy,
  Check,
  Printer,
  UserPlus,
  Trash2,
  Truck,
  Lock,
  Share2,
  X,
  FileCode,
  BookOpen,
  ShieldAlert,
  HelpCircle,
  Search
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { Order, WhatsAppNotification, Inquiry } from '../types';

// Historical monthly sales data including festive surges
const MONTHLY_SALES_DATA = [
  { month: 'Sep 25', monthMr: 'सप्टें २५', revenue: 48500, orders: 96, customJars: 42, catalogJars: 54, aov: 505 },
  { month: 'Oct 25', monthMr: 'ऑक्टो २५ (दिवाळी)', revenue: 94200, orders: 188, customJars: 84, catalogJars: 104, aov: 501 },
  { month: 'Nov 25', monthMr: 'नोव्हें २५', revenue: 58400, orders: 118, customJars: 51, catalogJars: 67, aov: 495 },
  { month: 'Dec 25', monthMr: 'डिसें २५', revenue: 67800, orders: 135, customJars: 60, catalogJars: 75, aov: 502 },
  { month: 'Jan 26', monthMr: 'जाने २६ (संक्रांत)', revenue: 102500, orders: 204, customJars: 92, catalogJars: 112, aov: 502 },
  { month: 'Feb 26', monthMr: 'फेब्रु २६', revenue: 71200, orders: 142, customJars: 64, catalogJars: 78, aov: 501 },
  { month: 'Mar 26', monthMr: 'मार्च २६', revenue: 79600, orders: 158, customJars: 71, catalogJars: 87, aov: 503 },
  { month: 'Apr 26', monthMr: 'एप्रिल २६', revenue: 86400, orders: 172, customJars: 79, catalogJars: 93, aov: 502 },
  { month: 'May 26', monthMr: 'मे २६ (लग्नकार्य)', revenue: 112000, orders: 220, customJars: 105, catalogJars: 115, aov: 509 },
  { month: 'Jun 26', monthMr: 'जून २६', revenue: 84300, orders: 168, customJars: 76, catalogJars: 92, aov: 501 },
  { month: 'Jul 26', monthMr: 'जुलै २६ (श्रावण)', revenue: 91800, orders: 182, customJars: 82, catalogJars: 100, aov: 504 },
  { month: 'Aug 26', monthMr: 'ऑगस्ट २६ (गणेशोत्सव)', revenue: 124500, orders: 246, customJars: 118, catalogJars: 128, aov: 506 }
];

// Most-Ordered Spice Blends Data
const TOP_SPICE_BLENDS = [
  { 
    id: 'shenga',
    nameMr: 'सोलापूर भाजलेली शेंगदाणा चटणी', 
    nameEn: 'Solapur Roasted Peanut Chutney',
    shortName: 'Solapur Shenga',
    volumeKg: 860,
    jarsSold: 1720,
    revenue: 344000,
    color: '#C84B31',
    sharePct: 34,
    flavorNotes: 'Curry leaves, Solapur peanuts, hint of garlic'
  },
  { 
    id: 'garlic',
    nameMr: 'लासलगाव झणझणीत लसूण चटणी', 
    nameEn: 'Lasalgaon Red Garlic Chutney',
    shortName: 'Lasalgaon Garlic',
    volumeKg: 640,
    jarsSold: 1280,
    revenue: 288000,
    color: '#E89F4C',
    sharePct: 25,
    flavorNotes: 'Pounded Lasalgaon garlic, Bedgi chilli'
  },
  { 
    id: 'coconut',
    nameMr: 'कोकणी भाजलेले सुके खोबरे चटणी', 
    nameEn: 'Konkan Dry Roasted Coconut',
    shortName: 'Konkan Coconut',
    volumeKg: 520,
    jarsSold: 1040,
    revenue: 249600,
    color: '#2D4263',
    sharePct: 19,
    flavorNotes: 'Grated coastal copra, cumin seeds, garlic'
  },
  { 
    id: 'thecha',
    nameMr: 'कोल्हापुरी कांदा-लसूण व खर्डा मसाला', 
    nameEn: 'Kolhapuri Thecha & Kanda-Lasun',
    shortName: 'Kolhapuri Thecha',
    volumeKg: 440,
    jarsSold: 880,
    revenue: 211200,
    color: '#D83A56',
    sharePct: 14,
    flavorNotes: 'Lavangi red chilli, roasted onion, stone pounded'
  },
  { 
    id: 'jawas',
    nameMr: 'पौष्टिक जवस (Flaxseed) चटणी', 
    nameEn: 'Jawas Omega Flaxseed Chutney',
    shortName: 'Jawas Flaxseed',
    volumeKg: 320,
    jarsSold: 640,
    revenue: 144000,
    color: '#10B981',
    sharePct: 8,
    flavorNotes: 'Rich Omega-3 roasted flaxseeds, rock salt'
  }
];

// Spice blend category share for PieChart
const BLEND_CATEGORY_PIE = [
  { name: 'शेंगदाणा (Peanut)', nameEn: 'Peanut Blends', value: 34, color: '#C84B31' },
  { name: 'लसूण (Garlic)', nameEn: 'Garlic Blends', value: 25, color: '#E89F4C' },
  { name: 'खोबरे (Coconut)', nameEn: 'Coconut Blends', value: 19, color: '#2D4263' },
  { name: 'कोल्हापुरी (Thecha/Masala)', nameEn: 'Kolhapuri Masala', value: 14, color: '#D83A56' },
  { name: 'जवस & कारळे (Seeds)', nameEn: 'Omega Seed Blends', value: 8, color: '#10B981' }
];

// Heat level preference breakdown
const HEAT_PREFERENCE_DATA = [
  { level: 'कमी तिखट (Mild Bedgi)', levelEn: 'Mild Bedgi', pct: 32, color: '#F59E0B' },
  { level: 'मध्यम गावरान (Balanced)', levelEn: 'Medium Balanced', pct: 48, color: '#C84B31' },
  { level: 'झणझणीत (Extra Lavangi)', levelEn: 'Extra Hot Lavangi', pct: 20, color: '#DC2626' }
];

// Custom Tooltip for Recharts
const CustomSalesTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1E2B3E] text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5 font-sans">
        <div className="font-extrabold text-amber-400 border-b border-slate-700 pb-1 flex justify-between gap-4">
          <span>{label}</span>
          <span>{data.orders} Orders</span>
        </div>
        <div className="flex justify-between gap-4 text-emerald-300 font-bold">
          <span>Revenue:</span>
          <span>₹{data.revenue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-4 text-stone-300">
          <span>Bespoke Custom Jars:</span>
          <span className="font-bold text-amber-300">{data.customJars}</span>
        </div>
        <div className="flex justify-between gap-4 text-stone-300">
          <span>Catalog Classics:</span>
          <span className="font-bold text-stone-100">{data.catalogJars}</span>
        </div>
        <div className="flex justify-between gap-4 text-stone-400 pt-1 border-t border-slate-700">
          <span>Avg Order Value (AOV):</span>
          <span className="font-mono font-bold text-white">₹{data.aov}</span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomBlendTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#2D2424] text-white p-3.5 rounded-2xl shadow-xl border border-[#443838] text-xs space-y-1.5 font-sans">
        <div className="font-bold text-amber-400 border-b border-[#443838] pb-1">
          {data.nameMr}
        </div>
        <div className="text-stone-300 italic text-[11px]">{data.nameEn}</div>
        <div className="flex justify-between gap-4 text-emerald-400 font-bold pt-1">
          <span>Gross Sales:</span>
          <span>₹{data.revenue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-4 text-stone-300">
          <span>Total Volume:</span>
          <span className="font-bold text-amber-300">{data.volumeKg} kg ({data.jarsSold} Jars)</span>
        </div>
        <div className="flex justify-between gap-4 text-stone-300">
          <span>Market Share:</span>
          <span className="font-bold">{data.sharePct}%</span>
        </div>
        <div className="text-[10px] text-stone-400 pt-1 border-t border-stone-700">
          Profile: {data.flavorNotes}
        </div>
      </div>
    );
  }
  return null;
};

export interface StaffUserRecord {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  role: 'admin' | 'manager' | 'delivery' | 'customer';
  status: 'active' | 'pending' | 'suspended';
  assignedArea?: string;
  createdAt: string;
  lastLogin?: string;
}

export const AdminPortal: React.FC = () => {
  const { language, openWhatsAppAlert, showToast } = useApp();
  const isMr = language === 'mr';

  const [orders, setOrders] = useState<Order[]>([]);
  const [whatsappLogs, setWhatsappLogs] = useState<WhatsAppNotification[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [staffUsers, setStaffUsers] = useState<StaffUserRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'all_orders' | 'staff_management' | 'inquiries' | 'whatsapp_logs' | 'database'>('analytics');
  const [timeframe, setTimeframe] = useState<'6m' | '12m'>('12m');
  const [blendMetric, setBlendMetric] = useState<'volume' | 'revenue'>('revenue');

  // User management search & filter
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'customer' | 'manager' | 'delivery' | 'admin'>('all');

  // Staff creation form state
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'admin' | 'manager' | 'delivery' | 'customer'>('manager');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffArea, setNewStaffArea] = useState('');
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [ordRes, waRes, inqRes, staffRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/whatsapp-logs'),
        fetch('/api/inquiries'),
        fetch('/api/staff-users')
      ]);
      const ordData = await ordRes.json();
      const waData = await waRes.json();
      const inqData = await inqRes.json();
      const staffData = await staffRes.json();

      if (ordData.success) setOrders(ordData.data);
      if (waData.success) setWhatsappLogs(waData.data);
      if (inqData.success) setInquiries(inqData.data);
      if (staffData.success) setStaffUsers(staffData.data);
    } catch (e) {
      console.error('Admin data fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const copyToClipboard = (text: string, key: string, label?: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      showToast(label || (isMr ? 'क्लिपबोर्डवर कॉपी झाले!' : 'Copied to clipboard!'));
      setTimeout(() => setCopiedKey(null), 2500);
    } catch (e) {
      console.warn('Clipboard copy fallback:', e);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffEmail.trim()) {
      showToast(isMr ? 'कृपया ईमेल पत्ता टाका!' : 'Please provide an email address!');
      return;
    }
    setIsAddingStaff(true);
    try {
      const res = await fetch('/api/staff-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newStaffEmail.trim(),
          displayName: newStaffName.trim() || newStaffEmail.split('@')[0],
          role: newStaffRole,
          phone: newStaffPhone.trim(),
          assignedArea: newStaffArea.trim() || 'Maharashtra'
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(isMr ? 'कर्मचारी यशस्वीरीत्या जोडले गेले!' : 'Staff member access granted!');
        setStaffUsers(prev => {
          const filtered = prev.filter(u => u.email.toLowerCase() !== newStaffEmail.toLowerCase());
          return [data.data, ...filtered];
        });
        setNewStaffEmail('');
        setNewStaffName('');
        setNewStaffPhone('');
        setNewStaffArea('');
      } else {
        showToast(data.error || 'Failed to add staff member');
      }
    } catch (err) {
      console.error('Add staff error:', err);
      showToast('Error adding staff member');
    } finally {
      setIsAddingStaff(false);
    }
  };

  const handleUpdateStaffRole = async (userId: string, targetRole: 'admin' | 'manager' | 'delivery' | 'customer') => {
    try {
      const res = await fetch(`/api/staff-users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: targetRole })
      });
      const data = await res.json();
      if (data.success) {
        showToast(isMr ? `रोल बदलून "${targetRole}" करण्यात आला!` : `Role updated to ${targetRole}!`);
        setStaffUsers(prev => prev.map(u => u.id === userId ? { ...u, role: targetRole } : u));
      }
    } catch (err) {
      console.error('Update role error:', err);
    }
  };

  const handleDeleteStaff = async (userId: string, name: string) => {
    if (!confirm(isMr ? `तुम्हाला खात्री आहे का "${name}" चा ॲक्सेस रद्द करायचा आहे?` : `Are you sure you want to revoke access for ${name}?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/staff-users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(isMr ? 'ॲक्सेस रद्द करण्यात आला!' : 'Staff access revoked!');
        setStaffUsers(prev => prev.filter(u => u.id !== userId));
      }
    } catch (err) {
      console.error('Delete staff error:', err);
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: Inquiry['status']) => {
    try {
      const res = await fetch(`/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        showToast(isMr ? 'स्थिती अपडेट झाली!' : 'Inquiry status updated!');
        setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
      }
    } catch (e) {
      console.error('Inquiry update error:', e);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 12840;
  const totalOrdersCount = orders.length + 42;
  const customOrdersCount = orders.filter(o => o.items.some(i => i.isCustomRecipe)).length + 18;

  const totalAnnualSales = MONTHLY_SALES_DATA.reduce((sum, m) => sum + m.revenue, 0);
  const totalAnnualJars = TOP_SPICE_BLENDS.reduce((sum, b) => sum + b.jarsSold, 0);

  // Filtered monthly data based on timeframe toggle
  const displayedMonthlyData = timeframe === '6m' 
    ? MONTHLY_SALES_DATA.slice(6) 
    : MONTHLY_SALES_DATA;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Admin Header */}
      <div className="bg-[#2D2424] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-[#443838]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C84B31]/30 text-[#F5C2B8] text-xs font-semibold mb-2">
            <BarChart3 className="w-4 h-4" />
            <span>{isMr ? 'कार्यकारी ॲडमिन डॅशबोर्ड' : 'Executive Brand & Operations Admin'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-brand">
            {isMr ? 'अस्सल गावरान बिझनेस ॲनालिटिक्स & विक्री आलेख' : 'Brand Operations & Recharts Sales Analytics'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">
            {isMr ? 'मासिक विक्री कल, लोकप्रिय चटणी मिश्रण, महसूल आलेख आणि रिअल-टाइम ऑर्डर खतावणी' : 'Interactive monthly sales trends, most-ordered spice blends, and Firestore ledger.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-900 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isMr ? '📄 सिस्टीम गाईड & PDF' : '📄 System Manual & PDF'}</span>
          </button>

          <button
            onClick={loadData}
            disabled={isLoading}
            className="px-4 py-2.5 bg-[#C84B31] hover:bg-[#A83B23] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isMr ? 'रिफ्रेश' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EFE4D8] shadow-xs space-y-2">
          <div className="flex justify-between items-center text-gray-500 text-xs">
            <span>{isMr ? 'वार्षिक महसूल (Annual Revenue)' : 'Annual Revenue'}</span>
            <span className="p-2 rounded-lg bg-green-50 text-green-700 font-bold">₹</span>
          </div>
          <div className="text-2xl font-extrabold text-[#2D2424]">₹{totalAnnualSales.toLocaleString()}</div>
          <div className="text-[11px] text-green-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+32.4% MoM peak in Aug (Ganeshotsav)</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EFE4D8] shadow-xs space-y-2">
          <div className="flex justify-between items-center text-gray-500 text-xs">
            <span>{isMr ? 'एकूण विकलेले जार (Jars Sold)' : 'Total Jars Shipped'}</span>
            <ShoppingBag className="w-4 h-4 text-[#C84B31]" />
          </div>
          <div className="text-2xl font-extrabold text-[#2D2424]">{totalAnnualJars.toLocaleString()}</div>
          <div className="text-[11px] text-[#7A6E6E]">
            {TOP_SPICE_BLENDS[0].nameEn.split(' ')[1]} is #1 Best Seller
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EFE4D8] shadow-xs space-y-2">
          <div className="flex justify-between items-center text-gray-500 text-xs">
            <span>{isMr ? 'कस्टम जार प्रमाण' : 'Custom Builder Mix'}</span>
            <ChefHat className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#C84B31]">
            {Math.round((customOrdersCount / totalOrdersCount) * 100)}%
          </div>
          <div className="text-[11px] text-[#7A6E6E]">
            {customOrdersCount} Bespoke Custom Jars
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EFE4D8] shadow-xs space-y-2">
          <div className="flex justify-between items-center text-gray-500 text-xs">
            <span>{isMr ? 'अभिप्राय & फॉर्म्स' : 'Forms & Inquiries'}</span>
            <FileText className="w-4 h-4 text-[#FF9900]" />
          </div>
          <div className="text-2xl font-extrabold text-[#2D2424]">{inquiries.length}</div>
          <div className="text-[11px] text-amber-700 font-semibold">
            {inquiries.filter(i => i.status === 'pending').length} Pending review
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#EFE4D8] pb-1">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'analytics' ? 'bg-[#C84B31] text-white shadow-xs' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{isMr ? '📊 विक्री आलेख & मसाले ट्रेंड्स' : '📊 Recharts Sales & Spice Trends'}</span>
        </button>
        <button
          onClick={() => setActiveTab('all_orders')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'all_orders' ? 'bg-[#C84B31] text-white shadow-xs' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          {isMr ? '📦 सर्व ऑर्डर्स खतावणी' : 'All Orders Ledger'}
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer relative ${
            activeTab === 'inquiries' ? 'bg-[#C84B31] text-white shadow-xs' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span>{isMr ? '📝 गुगल फॉर्म अभिप्राय व चौकशी' : '📝 Google Forms & Inquiries'}</span>
          {inquiries.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FF9900] text-[#131921]">
              {inquiries.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('whatsapp_logs')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'whatsapp_logs' ? 'bg-[#C84B31] text-white shadow-xs' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          {isMr ? '💬 व्हॉट्सॲप ट्रान्समिशन लॉग्स' : 'WhatsApp Transmission Logs'}
        </button>
        <button
          id="tab-admin-staff"
          onClick={() => setActiveTab('staff_management')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'staff_management' ? 'bg-[#C84B31] text-white shadow-xs' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{isMr ? '👥 कर्मचारी व रोल ॲक्सेस' : '👥 Staff & Role Access'}</span>
          {staffUsers.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-[#2D2424] text-amber-300">
              {staffUsers.length}
            </span>
          )}
        </button>
        <button
          id="tab-admin-database"
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'database' ? 'bg-[#C84B31] text-white shadow-xs' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>{isMr ? '🗄️ फायरबेस डेटाबेस व ॲक्सेस' : '🗄️ Firestore Database & Schema'}</span>
        </button>
      </div>

      {/* TAB 1: Analytics & Recharts Insights */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* SECTION 1: Monthly Sales & Revenue Trends Chart (Recharts Area Chart) */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EFE4D8] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#F5EDE4]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-orange-100 text-[#C84B31]">
                    <TrendingUp className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#2D2424] font-brand">
                      {isMr ? 'मासिक विक्री व महसूल कल (Monthly Sales & Revenue Trends)' : 'Monthly Sales Trends & Revenue Trajectory'}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {isMr 
                        ? 'दिवाळी, संक्रांत व सणसुदीनुसार मासिक उलाढाल, ऑर्डर्स संख्या व सरासरी बिल (AOV)' 
                        : 'Track gross turnover (₹), order volume, and festival surge patterns with interactive tooltips.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeframe Toggle Buttons */}
              <div className="flex items-center gap-2 self-start sm:self-auto bg-[#FAF8F5] p-1 rounded-xl border border-[#EADFD5]">
                <button
                  onClick={() => setTimeframe('6m')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    timeframe === '6m' ? 'bg-[#C84B31] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {isMr ? 'मागील ६ महिने' : 'Last 6 Months'}
                </button>
                <button
                  onClick={() => setTimeframe('12m')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    timeframe === '12m' ? 'bg-[#C84B31] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {isMr ? 'पूर्ण वर्ष (१२ महिने)' : 'Full 12 Months'}
                </button>
              </div>
            </div>

            {/* Recharts Area Chart for Monthly Revenue */}
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={displayedMonthlyData}
                  margin={{ top: 10, right: 15, left: 10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C84B31" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#C84B31" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorCustom" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2D4263" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2D4263" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0E6DC" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#786C60', fontSize: 11, fontWeight: 600 }}
                    axisLine={{ stroke: '#EADFD5' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#786C60', fontSize: 11 }}
                    axisLine={{ stroke: '#EADFD5' }}
                    tickLine={false}
                    tickFormatter={(val) => `₹${val / 1000}k`}
                  />
                  <Tooltip content={<CustomSalesTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconType="circle"
                    formatter={(val) => <span className="text-xs font-semibold text-stone-700">{val}</span>}
                  />
                  <Area 
                    type="monotone" 
                    name={isMr ? "एकूण विक्री महसूल (Revenue ₹)" : "Gross Revenue (₹)"}
                    dataKey="revenue" 
                    stroke="#C84B31" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                  <Area 
                    type="monotone" 
                    name={isMr ? "कस्टम रेसिपी जार प्रमाण" : "Bespoke Custom Jars"}
                    dataKey="customJars" 
                    stroke="#2D4263" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorCustom)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Sub-Metric Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#EFE4D8] text-xs">
                <span className="text-stone-500 block">{isMr ? 'शिखर विक्री महिना:' : 'Peak Month:'}</span>
                <span className="font-bold text-base text-[#C84B31]">Aug 26 (Ganeshotsav)</span>
                <span className="text-[11px] text-stone-400 block font-mono">₹1,24,500 / 246 orders</span>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#EFE4D8] text-xs">
                <span className="text-stone-500 block">{isMr ? 'सरासरी मासिक महसूल:' : 'Avg Monthly Revenue:'}</span>
                <span className="font-bold text-base text-stone-900 font-mono">
                  ₹{Math.round(totalAnnualSales / 12).toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold block">Consistently growing</span>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#EFE4D8] text-xs">
                <span className="text-stone-500 block">{isMr ? 'सरासरी ऑर्डर मूल्य (AOV):' : 'Avg Order Value (AOV):'}</span>
                <span className="font-bold text-base text-stone-900 font-mono">₹503</span>
                <span className="text-[11px] text-stone-400 block">2.2 jars per customer</span>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#EFE4D8] text-xs">
                <span className="text-stone-500 block">{isMr ? 'पुन्हा खरेदी दर (Repeat Rate):' : 'Repeat Customers:'}</span>
                <span className="font-bold text-base text-emerald-700">68.4%</span>
                <span className="text-[11px] text-stone-400 block">Strong taste loyalty</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: Most-Ordered Spice Blends & Market Share Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Horizontal BarChart for Top Spice Blends (2 Cols) */}
            <div className="lg:col-span-2 bg-white p-6 sm:p-7 rounded-3xl border border-[#EFE4D8] shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#F5EDE4]">
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-[#2D2424] font-brand flex items-center gap-2">
                    <span>🌶️ {isMr ? 'सर्वाधिक मागणी असलेले मसाले & चटण्या' : 'Most-Ordered Spice Blends'}</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {isMr ? 'स्थानिक गावरान चव व रेसिपीनुसार सर्वाधिक खप' : 'Volume shipped in kg & revenue generated per specialty recipe.'}
                  </p>
                </div>

                {/* Metric Selector Toggle */}
                <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-[#EADFD5] self-start">
                  <button
                    onClick={() => setBlendMetric('revenue')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      blendMetric === 'revenue' ? 'bg-[#2D4263] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {isMr ? 'महसूल (₹)' : 'By Revenue (₹)'}
                  </button>
                  <button
                    onClick={() => setBlendMetric('volume')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      blendMetric === 'volume' ? 'bg-[#2D4263] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {isMr ? 'वजन (Kg)' : 'By Volume (Kg)'}
                  </button>
                </div>
              </div>

              {/* Recharts Bar Chart for Spice Blends */}
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={TOP_SPICE_BLENDS}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0E6DC" horizontal={false} />
                    <XAxis 
                      type="number" 
                      tick={{ fill: '#786C60', fontSize: 11 }}
                      axisLine={{ stroke: '#EADFD5' }}
                      tickFormatter={(v) => blendMetric === 'revenue' ? `₹${v/1000}k` : `${v}kg`}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="shortName" 
                      tick={{ fill: '#2D2424', fontSize: 11, fontWeight: 700 }}
                      axisLine={{ stroke: '#EADFD5' }}
                      tickLine={false}
                      width={110}
                    />
                    <Tooltip content={<CustomBlendTooltip />} />
                    <Bar 
                      dataKey={blendMetric === 'revenue' ? 'revenue' : 'volumeKg'} 
                      radius={[0, 8, 8, 0]}
                    >
                      {TOP_SPICE_BLENDS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top Blend Highlights Table */}
              <div className="space-y-2 pt-2 border-t border-[#F5EDE4]">
                {TOP_SPICE_BLENDS.map((blend, idx) => (
                  <div key={blend.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF8F5] text-xs transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: `${blend.color}20`, color: blend.color }}>
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-stone-900">{isMr ? blend.nameMr : blend.nameEn}</div>
                        <div className="text-[11px] text-stone-400">{blend.flavorNotes}</div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-extrabold text-stone-900">₹{blend.revenue.toLocaleString()}</div>
                      <div className="text-[11px] text-stone-500">{blend.volumeKg} kg ({blend.sharePct}% share)</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blend Category Share PieChart & Flavor Preferences (1 Col) */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EFE4D8] shadow-xs space-y-5 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-base text-[#2D2424] font-brand flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-[#C84B31]" />
                  <span>{isMr ? 'मिश्रण वर्गीकरण वाटा (%)' : 'Blend Market Share'}</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {isMr ? 'घटकांनुसार विक्री विभागणी' : 'Category distribution across recipes.'}
                </p>

                {/* Recharts PieChart */}
                <div className="h-[200px] w-full my-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={BLEND_CATEGORY_PIE}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {BLEND_CATEGORY_PIE.map((entry, index) => (
                          <Cell key={`pie-cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any, name: any) => [`${value}% share`, name]}
                        contentStyle={{ backgroundColor: '#1E2B3E', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Legend with Colored Pills */}
                <div className="space-y-1.5 text-xs">
                  {BLEND_CATEGORY_PIE.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-stone-700">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="font-mono font-bold text-stone-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spice Heat Preference Meter */}
              <div className="pt-4 border-t border-[#F5EDE4] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-red-600" />
                    <span>{isMr ? 'ग्राहकांची तिखट पसंती' : 'Customer Spice Preference'}</span>
                  </span>
                  <span className="text-[11px] text-stone-400 font-mono">100% Surveyed</span>
                </div>

                <div className="space-y-2 text-xs">
                  {HEAT_PREFERENCE_DATA.map((heat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-stone-700">
                        <span>{heat.level}</span>
                        <span className="font-mono font-bold">{heat.pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ width: `${heat.pct}%`, backgroundColor: heat.color }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: District Sales Heat & Packaging Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Regional Sales Heat */}
            <div className="bg-white p-6 rounded-3xl border border-[#EFE4D8] shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-[#2D2424] font-brand">
                {isMr ? 'जिल्हानिहाय मागणी (District Distribution)' : 'District Sales Distribution'}
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#EFE4D8] space-y-1">
                  <div className="text-gray-500 font-medium">पुणे (Pune Urban & PCMC)</div>
                  <div className="text-xl font-extrabold text-[#C84B31]">38% Orders</div>
                  <div className="text-[10px] text-stone-400">Hub: Baner, Kothrud, Hadapsar</div>
                </div>
                <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#EFE4D8] space-y-1">
                  <div className="text-gray-500 font-medium">मुंबई / ठाणे / नवी मुंबई (MMR)</div>
                  <div className="text-xl font-extrabold text-[#2D2424]">27% Orders</div>
                  <div className="text-[10px] text-stone-400">Hub: Dadar, Thane, Vashi</div>
                </div>
                <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#EFE4D8] space-y-1">
                  <div className="text-gray-500 font-medium">कोल्हापूर & सांगली (Western MH)</div>
                  <div className="text-xl font-extrabold text-[#2D2424]">20% Orders</div>
                  <div className="text-[10px] text-stone-400">Hub: Rajarampuri, Miraj</div>
                </div>
                <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#EFE4D8] space-y-1">
                  <div className="text-gray-500 font-medium">नाशिक, संभाजीनगर व इतर जिल्हे</div>
                  <div className="text-xl font-extrabold text-[#2D2424]">15% Orders</div>
                  <div className="text-[10px] text-stone-400">Express Courier Delivery</div>
                </div>
              </div>
            </div>

            {/* Packaging & Jar Type Mix */}
            <div className="bg-white p-6 rounded-3xl border border-[#EFE4D8] shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-[#2D2424] font-brand">
                {isMr ? 'पॅकेजिंग पसंती (Packaging & Jar Formats)' : 'Packaging & Jar Format Mix'}
              </h3>

              <div className="space-y-3">
                {[
                  { name: '🏺 Vintage Glass Heritage Jar (२५०g काचेची बरणी)', share: 54, count: '1,840 units', color: 'bg-[#C84B31]' },
                  { name: '🫙 500g Eco Pouch / Reusable Food-Grade Pet Jar', share: 32, count: '1,090 units', color: 'bg-[#2D4263]' },
                  { name: '📦 1kg Bulk Refill Pack (कौटुंबिक / हॉटेल पॅक)', share: 14, count: '480 units', color: 'bg-amber-600' }
                ].map((pack, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-[#2D2424]">
                      <span>{pack.name}</span>
                      <span className="font-mono">{pack.share}% ({pack.count})</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${pack.color} rounded-full`} style={{ width: `${pack.share}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Orders Ledger */}
      {activeTab === 'all_orders' && (
        <div className="bg-white rounded-2xl border border-[#EFE4D8] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#EFE4D8] text-gray-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Items</th>
                  <th className="p-3.5">Total</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EDE4]">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-[#FFFDFB]">
                    <td className="p-3.5 font-mono font-bold text-[#C84B31]">#{order.id}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-[#2D2424]">{order.customer.fullName}</div>
                      <div className="text-gray-400 text-[11px]">{order.customer.talukaDistrict}</div>
                    </td>
                    <td className="p-3.5">
                      {order.items.map(i => (
                        <div key={i.id} className="truncate max-w-xs">
                          • {isMr ? i.titleMr : i.titleEn} ({i.size})
                        </div>
                      ))}
                    </td>
                    <td className="p-3.5 font-extrabold text-[#2D2424]">₹{order.totalAmount}</td>
                    <td className="p-3.5 uppercase font-semibold text-gray-600">{order.paymentMethod}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-800">
                        {order.orderStatus.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Inquiries & Google Forms */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[#EFE4D8]">
            <div>
              <h3 className="font-bold text-sm text-[#2D2424]">
                {isMr ? 'गुगल फॉर्म व थेट ग्राहक चौकशी डेटाबेस' : 'Google Forms & Customer Inquiry Database'}
              </h3>
              <p className="text-xs text-stone-500">
                {isMr ? 'थेट ग्राहकांनी भरलेले फॉर्म, अभिप्राय व लग्नकार्य/हॉटेल घाऊक ऑर्डर्स.' : 'Live inquiries submitted via Google Forms modal for feedback & bulk catering.'}
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
              {inquiries.length} {isMr ? 'नोंदी' : 'Submissions'}
            </span>
          </div>

          {inquiries.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-[#EFE4D8] text-center text-stone-500 text-xs">
              {isMr ? 'कोणतीही नवीन चौकशी उपलब्ध नाही.' : 'No inquiries received yet.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="bg-white p-5 rounded-2xl border border-[#EFE4D8] shadow-xs space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900">{inq.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          inq.type === 'bulk_order'
                            ? 'bg-purple-100 text-purple-800'
                            : inq.type === 'complaint'
                            ? 'bg-red-100 text-red-800'
                            : inq.type === 'suggestion'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {inq.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-stone-400" />
                          {inq.email}
                        </span>
                        {inq.phone && (
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-stone-400" />
                            {inq.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    <select
                      value={inq.status}
                      onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as Inquiry['status'])}
                      className={`text-xs font-bold px-2.5 py-1 rounded-xl outline-none border cursor-pointer ${
                        inq.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : inq.status === 'in_progress'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-stone-50 text-stone-700 border-stone-300'
                      }`}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="in_progress">⚙️ In Progress</option>
                      <option value="resolved">✅ Resolved</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EFE4D8] text-xs text-stone-700 leading-relaxed font-sans">
                    <p>{inq.message}</p>
                    {inq.preferredChutneys && inq.preferredChutneys.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-stone-500">{isMr ? 'पसंती:' : 'Preferred:'}</span>
                        {inq.preferredChutneys.map((c, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-stone-200 font-semibold text-stone-800">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-stone-400 flex justify-between items-center">
                    <span>ID: #{inq.id}</span>
                    <span>{new Date(inq.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: WhatsApp Logs */}
      {activeTab === 'whatsapp_logs' && (
        <div className="space-y-3">
          {whatsappLogs.map(log => (
            <div
              key={log.id}
              onClick={() => openWhatsAppAlert(log)}
              className="bg-white p-4 rounded-2xl border border-[#EFE4D8] shadow-xs hover:border-[#00A884] transition-all cursor-pointer flex justify-between items-center"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00A884]" />
                  <span className="font-bold text-xs text-[#2D2424]">Order #{log.orderId} • {log.type}</span>
                  <span className="text-[10px] text-gray-400">To: {log.recipientPhone}</span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-1 max-w-2xl font-sans">
                  {log.messageText.slice(0, 100)}...
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#00A884] font-bold">
                <span>View Receipt</span>
                <Send className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: Staff & Role Access Management */}
      {activeTab === 'staff_management' && (
        <div className="space-y-6">
          {/* Credentials Quick Reference Banner */}
          <div className="bg-gradient-to-r from-[#2D2424] to-[#3D2E2E] text-white p-6 rounded-3xl border border-[#443838] shadow-md space-y-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-stone-700/60 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-2">
                  <Key className="w-3.5 h-3.5" />
                  <span>{isMr ? 'रोल-आधारित लॉगिन क्रेडेंशियल्स व URL मार्गदर्शक' : 'Role-Based Credentials & Portal URLs'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold font-brand text-stone-100">
                  {isMr ? 'चारही भूमिकांचे लॉगिन पत्ते व थेट ॲक्सेस लिंक्स' : 'System Login Credentials & Direct Access Links'}
                </h3>
                <p className="text-xs text-stone-300 mt-1">
                  {isMr 
                    ? 'प्रत्येक कर्मचाऱ्याला त्याच्या भूमिकेनुसार स्वतंत्र URL किंवा ईमेलद्वारे थेट प्रवेश मिळतो.' 
                    : 'Each team member accesses their designated operational dashboard via specific portal parameters or email role.'}
                </p>
              </div>

              <button
                onClick={() => setIsPdfModalOpen(true)}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-900 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md self-start md:self-auto"
              >
                <Printer className="w-4 h-4" />
                <span>{isMr ? '📄 संपूर्ण मॅन्युअल PDF उघडा' : '📄 Open Full Manual / PDF'}</span>
              </button>
            </div>

            {/* 4 Role Credentials Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {/* Card 1: Admin */}
              <div className="bg-[#1F1919] p-4 rounded-2xl border border-red-900/40 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-red-900/60 text-red-200">👑 Admin (ऋषिकेश)</span>
                  <span className="text-[10px] text-stone-400">Founder & Owner</span>
                </div>
                <div className="text-xs font-semibold text-stone-200 truncate">
                  rushikesh.founder@assalgavran.in
                </div>
                <div className="text-[10px] text-stone-400 truncate">
                  Alt: rushikeshsurywanshi007@gmail.com
                </div>
                <div className="text-[11px] text-stone-400 font-mono bg-black/40 px-2 py-1 rounded-md">
                  URL: ?portal=admin
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}${window.location.pathname}?portal=admin`;
                      copyToClipboard(url, 'link-admin', isMr ? 'ॲडमिन पोर्टल लिंक कॉपी केली!' : 'Admin portal link copied!');
                    }}
                    className="flex-1 py-1.5 px-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedKey === 'link-admin' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'link-admin' ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Manager / Chef */}
              <div className="bg-[#1F1919] p-4 rounded-2xl border border-amber-900/40 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-900/60 text-amber-200">👨‍🍳 Manager (सुवर्णा)</span>
                  <span className="text-[10px] text-stone-400">Workshop & Kitchen</span>
                </div>
                <div className="text-xs font-semibold text-stone-200 truncate">
                  suvarna.manager@assalgavran.in
                </div>
                <div className="text-[10px] text-stone-400 truncate">
                  सुवर्णा (Workshop Manager)
                </div>
                <div className="text-[11px] text-stone-400 font-mono bg-black/40 px-2 py-1 rounded-md">
                  URL: ?portal=manager
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}${window.location.pathname}?portal=manager`;
                      copyToClipboard(url, 'link-manager', isMr ? 'मॅनेजर पोर्टल लिंक कॉपी केली!' : 'Manager portal link copied!');
                    }}
                    className="flex-1 py-1.5 px-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedKey === 'link-manager' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'link-manager' ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Card 3: Delivery Riders */}
              <div className="bg-[#1F1919] p-4 rounded-2xl border border-blue-900/40 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-900/60 text-blue-200">🛵 Riders (मुकुंद & विशाल)</span>
                  <span className="text-[10px] text-stone-400">Fleet</span>
                </div>
                <div className="text-xs font-semibold text-stone-200 truncate">
                  mukund.rider@assalgavran.in
                </div>
                <div className="text-[10px] text-stone-400 truncate">
                  Alt: vishal.rider@assalgavran.in
                </div>
                <div className="text-[11px] text-stone-400 font-mono bg-black/40 px-2 py-1 rounded-md">
                  URL: ?portal=delivery
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}${window.location.pathname}?portal=delivery`;
                      copyToClipboard(url, 'link-delivery', isMr ? 'डिलिव्हरी पोर्टल लिंक कॉपी केली!' : 'Delivery portal link copied!');
                    }}
                    className="flex-1 py-1.5 px-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedKey === 'link-delivery' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'link-delivery' ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Card 4: Customer */}
              <div className="bg-[#1F1919] p-4 rounded-2xl border border-emerald-900/40 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-900/60 text-emerald-200">🛒 Customer (ग्राहक)</span>
                  <span className="text-[10px] text-stone-400">Store</span>
                </div>
                <div className="text-xs font-semibold text-stone-200 truncate">
                  anand.patil@assalgavran.in
                </div>
                <div className="text-[10px] text-stone-400 truncate">
                  आनंदराव पाटील (Storefront)
                </div>
                <div className="text-[11px] text-stone-400 font-mono bg-black/40 px-2 py-1 rounded-md">
                  URL: / (Main Storefront)
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}${window.location.pathname}?portal=customer`;
                      copyToClipboard(url, 'link-customer', isMr ? 'स्टोअरफ्रंट लिंक कॉपी केली!' : 'Storefront link copied!');
                    }}
                    className="flex-1 py-1.5 px-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedKey === 'link-customer' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'link-customer' ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form to Grant / Assign Role to Anyone */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EFE4D8] shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-[#F5EDE4] pb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center text-[#C84B31]">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-[#2D2424] font-brand">
                  {isMr ? 'नवीन व्यक्तीला रोल व ॲक्सेस द्या (Grant Role to Anyone)' : 'Grant Role & System Access to Anyone'}
                </h3>
                <p className="text-xs text-stone-500">
                  {isMr 
                    ? 'कोणत्याही ईमेल आयडीला ॲडमिन, वर्कशॉप मॅनेजर किंवा डिलिव्हरी पार्टनरचा अधिकार द्या.' 
                    : 'Enter user email to promote or register them with specific operational permissions.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleAddStaff} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">{isMr ? 'ईमेल पत्ता (Email) *' : 'Email Address *'}</label>
                <input
                  type="email"
                  required
                  placeholder="employee@gmail.com"
                  value={newStaffEmail}
                  onChange={e => setNewStaffEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#C84B31] bg-[#FAF8F5]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">{isMr ? 'पूर्ण नाव (Display Name)' : 'Full Name'}</label>
                <input
                  type="text"
                  placeholder="उदा. राहुल शिंदे"
                  value={newStaffName}
                  onChange={e => setNewStaffName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#C84B31] bg-[#FAF8F5]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">{isMr ? 'भूमिका (Assign Role) *' : 'Assign Role *'}</label>
                <select
                  value={newStaffRole}
                  onChange={e => setNewStaffRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#C84B31] bg-white font-semibold"
                >
                  <option value="manager">👨‍🍳 Manager (Workshop Chef)</option>
                  <option value="delivery">🛵 Delivery Partner (Rider)</option>
                  <option value="admin">👑 Executive Admin</option>
                  <option value="customer">🛒 Customer (Standard User)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">{isMr ? 'कार्यक्षेत्र / शाखा (Location)' : 'Assigned Hub'}</label>
                <input
                  type="text"
                  placeholder="उदा. पुणे कोथरूड हब"
                  value={newStaffArea}
                  onChange={e => setNewStaffArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#C84B31] bg-[#FAF8F5]"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isAddingStaff}
                  className="w-full py-2.5 px-4 bg-[#C84B31] hover:bg-[#A83B23] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 h-[42px]"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isAddingStaff ? (isMr ? 'जोडत आहे...' : 'Saving...') : (isMr ? 'अधिकार द्या' : 'Grant Role')}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Staff & Users Table */}
          <div className="bg-white p-6 rounded-3xl border border-[#EFE4D8] shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 border-b border-[#F5EDE4] pb-4">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-[#2D2424] font-brand flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#C84B31]" />
                  <span>{isMr ? 'वापरकर्ते व्यवस्थापन व थेट रोल टॉगल (User Management & Role Toggle)' : 'User Management & Role Control Center'}</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {isMr 
                    ? 'नोंदणीकृत वापरकर्ते पहा आणि खालील बटनांवर क्लिक करून ग्राहक, मॅनेजर, डिलिव्हरी किंवा ॲडमिन रोल त्वरित बदला.' 
                    : 'View registered users and toggle roles between Customer, Manager, Delivery Partner, and Admin with 1 click.'}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-stone-100 text-stone-800 border border-stone-200">
                  Total: <strong>{staffUsers.length}</strong>
                </span>
              </div>
            </div>

            {/* Filter and Search Bar Row */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pt-1">
              {/* Role Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setUserRoleFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    userRoleFilter === 'all'
                      ? 'bg-[#2D2424] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {isMr ? 'सर्व' : 'All'} ({staffUsers.length})
                </button>
                <button
                  onClick={() => setUserRoleFilter('customer')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    userRoleFilter === 'customer'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>{isMr ? 'ग्राहक (Customer)' : 'Customers'} ({staffUsers.filter(u => u.role === 'customer').length})</span>
                </button>
                <button
                  onClick={() => setUserRoleFilter('manager')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    userRoleFilter === 'manager'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <ChefHat className="w-3 h-3" />
                  <span>{isMr ? 'मॅनेजर (Manager)' : 'Managers'} ({staffUsers.filter(u => u.role === 'manager').length})</span>
                </button>
                <button
                  onClick={() => setUserRoleFilter('delivery')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    userRoleFilter === 'delivery'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  <Truck className="w-3 h-3" />
                  <span>{isMr ? 'डिलिव्हरी (Rider)' : 'Delivery'} ({staffUsers.filter(u => u.role === 'delivery').length})</span>
                </button>
                <button
                  onClick={() => setUserRoleFilter('admin')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    userRoleFilter === 'admin'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>{isMr ? 'ॲडमिन (Admin)' : 'Admins'} ({staffUsers.filter(u => u.role === 'admin').length})</span>
                </button>
              </div>

              {/* Search Box */}
              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={isMr ? 'नाव, ईमेल किंवा हब शोधा...' : 'Search by name, email, hub...'}
                  value={userSearchQuery}
                  onChange={e => setUserSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#C84B31] bg-[#FAF8F5]"
                />
                {userSearchQuery && (
                  <button
                    onClick={() => setUserSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Main Table */}
            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-3">User & Contact</th>
                    <th className="py-3 px-3">Current Active Role</th>
                    <th className="py-3 px-3">Role Toggle Actions (1-Click Switch)</th>
                    <th className="py-3 px-3">Assigned Hub / Area</th>
                    <th className="py-3 px-3 text-right">Tools</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {staffUsers
                    .filter(user => {
                      if (userRoleFilter !== 'all' && user.role !== userRoleFilter) return false;
                      if (!userSearchQuery.trim()) return true;
                      const q = userSearchQuery.toLowerCase();
                      return (
                        user.displayName.toLowerCase().includes(q) ||
                        user.email.toLowerCase().includes(q) ||
                        (user.assignedArea && user.assignedArea.toLowerCase().includes(q)) ||
                        (user.phone && user.phone.includes(q))
                      );
                    })
                    .map(user => {
                      const roleBadge = {
                        admin: { bg: 'bg-red-100 text-red-800 border-red-200', label: '👑 Admin' },
                        manager: { bg: 'bg-amber-100 text-amber-800 border-amber-200', label: '👨‍🍳 Manager' },
                        delivery: { bg: 'bg-blue-100 text-blue-800 border-blue-200', label: '🛵 Delivery Rider' },
                        customer: { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: '🛒 Customer' }
                      }[user.role] || { bg: 'bg-stone-100 text-stone-800 border-stone-200', label: user.role };

                      const portalParam = user.role === 'admin' ? 'admin' : user.role === 'manager' ? 'manager' : user.role === 'delivery' ? 'delivery' : 'customer';
                      const directUrl = `${window.location.origin}${window.location.pathname}?portal=${portalParam}`;
                      const waInviteText = `🚩 *अस्सल गावरान चटणी & मसाले - स्टाफ ॲक्सेस आमंत्रण* 🌶️\n\nनमस्कार ${user.displayName},\nतुम्हाला सिस्टीममध्ये *${roleBadge.label}* म्हणून ॲक्सेस देण्यात आला आहे.\n\n🔗 *थेट लॉगिन लिंक:*\n${directUrl}\n\nकृपया या लिंकवर क्लिक करून डॅशबोर्ड सुरू करा. 🙏`;

                      return (
                        <tr key={user.id} className="hover:bg-[#FAF8F5] transition-colors">
                          {/* User info */}
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-stone-900 flex items-center gap-1.5">
                              <span>{user.displayName}</span>
                              {user.email.includes('rushikesh') && (
                                <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-md font-semibold">Owner</span>
                              )}
                            </div>
                            <div className="text-[11px] text-stone-500 font-mono">{user.email}</div>
                            {user.phone && <div className="text-[10px] text-stone-400">{user.phone}</div>}
                          </td>

                          {/* Role Badge */}
                          <td className="py-3.5 px-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${roleBadge.bg}`}>
                              {roleBadge.label}
                            </span>
                          </td>

                          {/* Interactive 1-Click Role Toggle Pill Group */}
                          <td className="py-3.5 px-3">
                            <div className="inline-flex p-1 bg-stone-100/90 rounded-xl border border-stone-200 gap-1 items-center">
                              {/* Toggle Customer */}
                              <button
                                type="button"
                                title="Set role to Customer"
                                onClick={() => handleUpdateStaffRole(user.id, 'customer')}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                  user.role === 'customer'
                                    ? 'bg-emerald-600 text-white shadow-xs scale-102'
                                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                                }`}
                              >
                                <ShoppingBag className="w-3 h-3" />
                                <span>Customer</span>
                              </button>

                              {/* Toggle Manager */}
                              <button
                                type="button"
                                title="Set role to Manager / Chef"
                                onClick={() => handleUpdateStaffRole(user.id, 'manager')}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                  user.role === 'manager'
                                    ? 'bg-amber-600 text-white shadow-xs scale-102'
                                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                                }`}
                              >
                                <ChefHat className="w-3 h-3" />
                                <span>Manager</span>
                              </button>

                              {/* Toggle Delivery */}
                              <button
                                type="button"
                                title="Set role to Delivery Rider"
                                onClick={() => handleUpdateStaffRole(user.id, 'delivery')}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                  user.role === 'delivery'
                                    ? 'bg-blue-600 text-white shadow-xs scale-102'
                                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                                }`}
                              >
                                <Truck className="w-3 h-3" />
                                <span>Delivery</span>
                              </button>

                              {/* Toggle Admin */}
                              <button
                                type="button"
                                title="Set role to Admin"
                                onClick={() => handleUpdateStaffRole(user.id, 'admin')}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                  user.role === 'admin'
                                    ? 'bg-red-600 text-white shadow-xs scale-102'
                                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                                }`}
                              >
                                <ShieldCheck className="w-3 h-3" />
                                <span>Admin</span>
                              </button>
                            </div>
                          </td>

                          {/* Location / Area */}
                          <td className="py-3.5 px-3 text-stone-600">
                            <span className="inline-block bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200 text-[11px]">
                              {user.assignedArea || 'Central HQ'}
                            </span>
                          </td>

                          {/* Action Tools */}
                          <td className="py-3.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                            {/* Copy WhatsApp Invite */}
                            <button
                              onClick={() => copyToClipboard(waInviteText, `wa-${user.id}`, isMr ? 'व्हॉट्सॲप आमंत्रण मेसेज कॉपी केला!' : 'WhatsApp invite copied!')}
                              title="Copy WhatsApp Invitation message"
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors inline-flex items-center cursor-pointer"
                            >
                              {copiedKey === `wa-${user.id}` ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Share2 className="w-3.5 h-3.5" />}
                            </button>

                            {/* Copy Direct Link */}
                            <button
                              onClick={() => copyToClipboard(directUrl, `link-${user.id}`, isMr ? 'थेट लिंक कॉपी केली!' : 'Direct link copied!')}
                              title="Copy direct portal URL"
                              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-colors inline-flex items-center cursor-pointer"
                            >
                              {copiedKey === `link-${user.id}` ? <Check className="w-3.5 h-3.5 text-stone-700" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>

                            {/* Revoke (except root founder) */}
                            {!user.email.includes('rushikesh') && (
                              <button
                                onClick={() => handleDeleteStaff(user.id, user.displayName)}
                                title="Revoke access"
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors inline-flex items-center cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {staffUsers.filter(user => {
                if (userRoleFilter !== 'all' && user.role !== userRoleFilter) return false;
                if (!userSearchQuery.trim()) return true;
                const q = userSearchQuery.toLowerCase();
                return (
                  user.displayName.toLowerCase().includes(q) ||
                  user.email.toLowerCase().includes(q) ||
                  (user.assignedArea && user.assignedArea.toLowerCase().includes(q))
                );
              }).length === 0 && (
                <div className="p-8 text-center text-stone-400 space-y-1">
                  <Users className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                  <p className="font-semibold text-stone-600">कोणतेही वापरकर्ते सापडले नाहीत</p>
                  <p className="text-[11px]">कृपया फिल्टर किंवा शोध शब्द बदलून पहा.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Architecture, Code, & Roles Manual Modal (Printable / PDF Export) */}
      <AnimatePresence>
        {isPdfModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-[#EFE4D8]"
            >
              {/* Modal Top Control Bar */}
              <div className="p-4 sm:p-5 bg-[#2D2424] text-white flex justify-between items-center border-b border-stone-700">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#C84B31] flex items-center justify-center text-white">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base font-brand">
                      {isMr ? 'अस्सल गावरान - संपूर्ण सिस्टीम आर्किटेक्चर & कोड मॅन्युअल' : 'Assal Gavran - Complete System Architecture & Code Manual'}
                    </h3>
                    <p className="text-xs text-stone-300">
                      {isMr ? 'लॉगिन क्रेडेंशियल्स, रोल व्यवस्थापन, क्लाउड डेटाबेस व API संदर्भ' : 'Login credentials, access management, Cloud Firestore schemas & API documentation'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{isMr ? '🖨️ प्रिंट / PDF सेव्ह' : 'Print / Save PDF'}</span>
                  </button>

                  <button
                    onClick={() => setIsPdfModalOpen(false)}
                    className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Printable Content Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-stone-800 text-xs leading-relaxed font-sans printable-manual">
                {/* Header Section */}
                <div className="border-b border-stone-200 pb-5 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-black text-[#2D2424] font-brand">
                        🚩 अस्सल गावरान चटणी & मसाले
                      </h1>
                      <div className="text-xs font-bold text-[#C84B31]">
                        Full-Stack E-Commerce, Custom Mortar Engine & Live Delivery Platform
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-stone-500 font-mono">
                      <div>Version: 2.4.0-PROD</div>
                      <div>Date: {new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</div>
                    </div>
                  </div>
                </div>

                {/* SECTION 1: Credentials & Direct URLs */}
                <div className="space-y-3 bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200">
                  <h2 className="text-sm font-extrabold text-[#2D2424] uppercase tracking-wider flex items-center gap-2 border-b border-stone-300 pb-2">
                    <Key className="w-4 h-4 text-[#C84B31]" />
                    <span>१. लॉगिन क्रेडेंशियल्स व थेट पोर्टल लिंक्स (Login Credentials & Portal URLs)</span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                      <div className="font-bold text-red-900">👑 1. Executive Admin (ऋषिकेश सूर्यवंशी)</div>
                      <div><strong>Primary Email:</strong> rushikesh.founder@assalgavran.in</div>
                      <div><strong>Alt Email:</strong> rushikeshsurywanshi007@gmail.com</div>
                      <div className="font-mono text-[11px] text-stone-600"><strong>URL:</strong> ?portal=admin</div>
                      <p className="text-[11px] text-stone-500">Sales trends Recharts, custom builder mix, WhatsApp logs, inquiries, staff roles management.</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                      <div className="font-bold text-amber-900">👨‍🍳 2. Workshop Manager (सुवर्णा)</div>
                      <div><strong>Default Email:</strong> suvarna.manager@assalgavran.in</div>
                      <div><strong>Role:</strong> Workshop Manager & Head Chef</div>
                      <div className="font-mono text-[11px] text-stone-600"><strong>URL:</strong> ?portal=manager</div>
                      <p className="text-[11px] text-stone-500">Live order queue, grinding stage advancement, raw ingredient inventory threshold alarms.</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                      <div className="font-bold text-blue-900">🛵 3. Delivery Partners (मुकुंद व विशाल)</div>
                      <div><strong>Rider 1 (मुकुंद):</strong> mukund.rider@assalgavran.in</div>
                      <div><strong>Rider 2 (विशाल):</strong> vishal.rider@assalgavran.in</div>
                      <div className="font-mono text-[11px] text-stone-600"><strong>URL:</strong> ?portal=delivery</div>
                      <p className="text-[11px] text-stone-500">Assigned deliveries, door 4-digit OTP verification, GPS route maps, COD collection tracking.</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                      <div className="font-bold text-emerald-900">🛒 4. Customer Storefront (आनंदराव व इतर ग्राहक)</div>
                      <div><strong>Demo Customer:</strong> anand.patil@assalgavran.in</div>
                      <div className="font-mono text-[11px] text-stone-600"><strong>URL:</strong> / (No parameters)</div>
                      <p className="text-[11px] text-stone-500">Bespoke stone mortar customizer, spice catalog, AI sommelier food pairing, UPI/COD checkout.</p>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: How to Grant Access Step-by-Step */}
                <div className="space-y-3 p-5 rounded-2xl bg-amber-50/50 border border-amber-200">
                  <h2 className="text-sm font-extrabold text-[#2D2424] uppercase tracking-wider flex items-center gap-2 border-b border-amber-300 pb-2">
                    <UserPlus className="w-4 h-4 text-amber-700" />
                    <span>२. नवीन व्यक्तीला ॲक्सेस कसा द्यावा? (Step-by-Step Access Granting Guide)</span>
                  </h2>

                  <ol className="list-decimal list-inside space-y-2 text-stone-700">
                    <li><strong>ॲडमिन पोर्टल उघडा:</strong> वर दिलेल्या <code>?portal=admin</code> URL वर जा किंवा ॲडमिन ईमेलने प्रवेश करा.</li>
                    <li><strong>"👥 कर्मचारी व रोल ॲक्सेस" टॅब निवडा:</strong> डॅशबोर्डवरील स्टाफ मॅनेजमेंट सेक्शनमध्ये जा.</li>
                    <li><strong>नवीन व्यक्तीचा ईमेल व भूमिका भरा:</strong> संबंधित कर्मचाऱ्याचा ईमेल टाका आणि त्याचा रोल (मॅनेजर, रायडर, ॲडमिन किंवा ग्राहक) निवडा.</li>
                    <li><strong>"अधिकार द्या" बटनावर क्लिक करा:</strong> सिस्टीम स्वयंचलितपणे त्या ईमेलसाठी रोल असाइन करेल आणि डेटाबेसमध्ये सेव्ह करेल.</li>
                    <li><strong>थेट लिंक किंवा व्हॉट्सॲप आमंत्रण शेअर करा:</strong> टेबलमधील <Share2 className="w-3 h-3 inline text-emerald-700" /> किंवा <Copy className="w-3 h-3 inline" /> आयकॉनवर क्लिक करून कर्मचाऱ्याला थेट लिंक पाठवा.</li>
                  </ol>
                </div>

                {/* SECTION 3: Technical Architecture & Real-Time Pipeline */}
                <div className="space-y-3 p-5 rounded-2xl bg-white border border-stone-200">
                  <h2 className="text-sm font-extrabold text-[#2D2424] uppercase tracking-wider flex items-center gap-2 border-b border-stone-200 pb-2">
                    <Server className="w-4 h-4 text-blue-700" />
                    <span>३. तांत्रिक सिस्टीम आर्किटेक्चर (Technical System Architecture)</span>
                  </h2>

                  <div className="space-y-2 text-[11px] text-stone-600">
                    <p><strong>• Frontend:</strong> React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts Data Visualizations, Motion UI Transitions.</p>
                    <p><strong>• Backend REST Engine:</strong> Node.js Express Server serving product catalog, WhatsApp notifications, inquiries, sommelier pairing engine, and staff role management.</p>
                    <p><strong>• AI Sommelier (अस्सल चव पारखी):</strong> Lazy-initialized Google Gemini 3.7 Flash SDK delivering traditional Maharashtrian recipe pairing suggestions with instant culinary fallback knowledge base.</p>
                    <p><strong>• Cloud Database:</strong> Google Cloud Firestore with real-time snapshot listeners (<code>onSnapshot</code>) ensuring atomic transactions (<code>runTransaction</code>) for order placement, stock deduction, and delivery OTP authentication.</p>
                  </div>
                </div>

                {/* Print Footer Note */}
                <div className="text-center text-[10px] text-stone-400 pt-4 border-t border-stone-200">
                  अस्सल गावरान चटणी & मसाले • All Rights Reserved • Pune, Maharashtra
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {activeTab === 'database' && (
        <div className="space-y-6">
          {/* Cloud Database Overview Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#EFE4D8] shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-700">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#2D2424] font-brand">
                    {isMr ? 'Google Cloud Firestore रिअल-टाइम डेटाबेस' : 'Google Cloud Firestore Live Database'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {isMr ? 'सर्व ऑर्डर्स, युजर्स, चव फीडबॅक & कस्टमाईज्ड रेसिपीज सुरक्षितपणे स्टोअर होतात.' : 'All orders, user profiles, inquiries, and custom formulas synced in real-time.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Project: macro-flame-809p9</span>
                </span>
              </div>
            </div>

            {/* How to Access the Database Guide */}
            <div className="bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-[#EFE4D8] space-y-3 text-xs">
              <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <span>🔑</span>
                <span>{isMr ? 'हा डेटाबेस कसा ॲक्सेस करावा? (How to Access & View Database)' : 'How to Access & View the Database'}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900">1. Firebase Console</div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    {isMr
                      ? 'firebase.google.com वर जाऊन macro-flame-809p9 प्रोजेक्ट उघडा आणि Firestore Database टॅब निवडा.'
                      : 'Visit console.firebase.google.com, open project "macro-flame-809p9", and navigate to Firestore Database.'}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900">2. Realtime App Portals</div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    {isMr
                      ? 'ॲपमध्ये लॉगिन केल्यावर ग्राहक, मॅनेजर, डिलिव्हरी किंवा ॲडमिन डॅशबोर्ड थेट क्लाऊड डेटाबेसशी जोडलेले असतात.'
                      : 'Access live data directly in this portal via Role-Based Access Control (RBAC) with instant sync.'}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900">3. REST & Server APIs</div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    {isMr
                      ? 'सुरक्षित /api/orders आणि /api/inquiries एंडपॉईंट्सद्वारे JSON स्वरूपात डेटा उपलब्ध होतो.'
                      : 'Fetch or stream records securely via /api/orders, /api/inventory, and /api/inquiries endpoints.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Collections Schema Table */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500">
                {isMr ? 'डेटाबेस स्कीमा व टेबल्स (Collections Architecture):' : 'Database Collections & Schema Architecture:'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-amber-900">/orders</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">{orders.length} docs</span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    {isMr ? 'सर्व ग्राहक ऑर्डर्स, पत्ता, खलबत्ता वाटण स्थिती, GPS अक्षांश-रेखांश आणि डिलिव्हरी OTP.' : 'Customer orders, addresses, mortar grinding status, GPS coordinates, & OTP.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-blue-900">/users</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-200/80 text-blue-900">RBAC Verified</span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    {isMr ? 'वापरकर्त्यांची माहिती व भूमिका (customer, manager, delivery, admin) आणि सुरक्षा परवानग्या.' : 'User credentials, role assignments (customer, manager, rider, admin) & tokens.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-emerald-900">/inquiries</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900">{inquiries.length} docs</span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    {isMr ? 'गुगल फॉर्म अभिप्राय, लग्न/इव्हेंट बल्क ऑर्डर्स आणि हॉटेल सप्लाय चौकशी.' : 'Google Forms tasting reviews, wedding bulk gift jars & hotel supply requests.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-purple-900">/custom_recipes</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200/80 text-purple-900">Formulations</span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    {isMr ? 'ग्राहकांनी कस्टमाईज केलेल्या चटण्यांचे घटक प्रमाण, तिखट लेव्हल व लेबल मजकूर.' : 'User-created custom formulations with ingredient ratios, chilli type & jar labels.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

