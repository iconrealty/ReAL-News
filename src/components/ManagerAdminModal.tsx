import React, { useState } from 'react';
import { AdBanner, AdCategory, AdPlacement } from '../types';
import { 
  X, 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  Eye, 
  MousePointerClick, 
  DollarSign, 
  CheckCircle2, 
  PauseCircle, 
  PlayCircle, 
  Lock, 
  KeyRound, 
  RefreshCw,
  Search,
  Building,
  Landmark,
  HardHat,
  Home,
  ShieldCheck,
  FileText,
  Award,
  Phone,
  ExternalLink,
  Layers,
  Power,
  ShieldAlert
} from 'lucide-react';

interface ManagerAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  ads: AdBanner[];
  onRefreshAds: () => void;
  onShowToast: (msg: string) => void;
  isMonetizationEnabled?: boolean;
  onToggleMonetization?: (enabled: boolean) => void;
}

const PRESET_IMAGES = [
  { label: 'Escrow & Title', url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80' },
  { label: 'Mortgage Lender', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Contractor & ADU', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80' },
  { label: 'Realtor & Luxury', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80' },
  { label: 'Insurance & Legal', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80' },
  { label: 'Office & Finance', url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80' }
];

export function ManagerAdminModal({ 
  isOpen, 
  onClose, 
  ads, 
  onRefreshAds, 
  onShowToast,
  isMonetizationEnabled = true,
  onToggleMonetization
}: ManagerAdminModalProps) {
  // Passcode Lock State
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('ad_manager_auth') === 'true';
  });
  const [authError, setAuthError] = useState<string | null>(null);

  // Form & Management State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [placementFilter, setPlacementFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  const handleResetSampleSponsors = async () => {
    if (!confirm('Would you like to load all sample sponsors across locations and themes into the portal?')) return;
    try {
      const res = await fetch('/api/admin/ads/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        onShowToast('Loaded sample sponsor catalog across all locations and themes!');
        onRefreshAds();
      }
    } catch (e) {
      alert('Failed to load sample sponsors.');
    }
  };

  const handleToggleAllCampaignsStatus = async () => {
    const activeAdsCount = ads.filter(a => a.status === 'active').length;
    const nextStatus = activeAdsCount > 0 ? 'paused' : 'active';
    if (!confirm(`Are you sure you want to set ALL ${ads.length} campaigns to "${nextStatus.toUpperCase()}"?`)) return;

    try {
      const updatePromises = ads.map(ad => 
        fetch('/api/admin/ads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...ad, status: nextStatus })
        })
      );
      await Promise.all(updatePromises);
      onShowToast(`Set all campaigns to ${nextStatus.toUpperCase()}`);
      onRefreshAds();
    } catch (e) {
      alert('Failed to update all campaigns status.');
    }
  };
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentAd, setCurrentAd] = useState<Partial<AdBanner>>({
    advertiserName: '',
    category: 'escrow',
    placement: 'header-banner',
    targetCity: 'All',
    title: '',
    subtitle: '',
    ctaText: 'Learn More',
    ctaUrl: 'https://example.com',
    imageUrl: PRESET_IMAGES[0].url,
    sponsorBadge: 'Official Escrow Partner',
    phone: '',
    status: 'active',
    priority: 'featured'
  });

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'admin123' || passcode.trim() === 'admin' || passcode.trim() === '1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem('ad_manager_auth', 'true');
      setAuthError(null);
    } else {
      setAuthError('Access Denied: Invalid administrative passcode.');
    }
  };

  const handleCreateNew = () => {
    setCurrentAd({
      id: undefined,
      advertiserName: '',
      category: 'escrow',
      placement: 'header-banner',
      targetCity: 'All',
      title: '',
      subtitle: '',
      ctaText: 'Learn More',
      ctaUrl: 'https://example.com',
      imageUrl: PRESET_IMAGES[0].url,
      sponsorBadge: 'Official Escrow Partner',
      phone: '',
      status: 'active',
      priority: 'featured'
    });
    setIsEditing(true);
  };

  const handleEdit = (ad: AdBanner) => {
    setCurrentAd({ ...ad });
    setIsEditing(true);
  };

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAd.advertiserName || !currentAd.title) {
      alert('Advertiser Name and Title are required');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentAd)
      });
      const data = await res.json();
      if (data.success) {
        onShowToast(`Saved campaign for "${currentAd.advertiserName}"`);
        setIsEditing(false);
        onRefreshAds();
      } else {
        alert(data.error || 'Failed to save campaign');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving ad banner');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (ad: AdBanner) => {
    const nextStatus = ad.status === 'active' ? 'paused' : 'active';
    try {
      const res = await fetch('/api/admin/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ad, status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        onShowToast(`${nextStatus === 'active' ? 'Activated' : 'Paused'} campaign "${ad.advertiserName}"`);
        onRefreshAds();
      }
    } catch (e) {
      console.warn('Status toggle failed:', e);
    }
  };

  const handleDeleteAd = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete campaign "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/ads/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        onShowToast(`Deleted campaign "${name}"`);
        onRefreshAds();
      }
    } catch (e) {
      alert('Delete failed');
    }
  };

  // Filtered ads list
  const filteredAds = ads.filter(ad => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      ad.advertiserName.toLowerCase().includes(q) || 
      ad.title.toLowerCase().includes(q) || 
      (ad.sponsorBadge && ad.sponsorBadge.toLowerCase().includes(q));
    
    const matchesCategory = categoryFilter === 'all' || ad.category === categoryFilter;
    const matchesPlacement = placementFilter === 'all' || ad.placement === placementFilter;
    const matchesCity = cityFilter === 'all' || !ad.targetCity || ad.targetCity.toLowerCase() === cityFilter.toLowerCase();

    return matchesQuery && matchesCategory && matchesPlacement && matchesCity;
  });

  // Analytics Metrics
  const totalImpressions = ads.reduce((sum, a) => sum + (a.impressions || 0), 0);
  const totalClicks = ads.reduce((sum, a) => sum + (a.clicks || 0), 0);
  const overallCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0.0';
  const activeCount = ads.filter(a => a.status === 'active').length;
  const estimatedRevenue = (activeCount * 850) + (totalClicks * 2.5); // Approx $850 base/mo per partner + CPC

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FA2D48] flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-lg tracking-tight">
                  Manager Monetization & Ad Portal
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
                  LIVE ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage Escrow, Lender, Contractor & Broker partner banners across all app pages
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onRefreshAds}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Refresh Ads Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AUTHENTICATION LOCK OVERLAY IF NOT AUTHENTICATED */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center my-auto max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 text-[#FA2D48] flex items-center justify-center mx-auto border border-rose-100 shadow-sm">
              <KeyRound className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-slate-900">Manager Passcode Required</h4>
              <p className="text-xs text-slate-500 mt-1">
                Enter your administrative passcode to configure partner marketing campaigns.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-[#FA2D48]"
                  autoFocus
                />
              </div>

              {authError && (
                <p className="text-xs font-bold text-rose-600 bg-rose-50 py-2 px-3 rounded-xl">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#FA2D48] hover:bg-[#E0263E] text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <Lock className="w-4 h-4" />
                <span>Unlock Manager Portal</span>
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED MANAGER DASHBOARD CONTENT */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Master Monetization Toggle Banner */}
            <div className={`p-5 rounded-3xl border transition-all ${
              isMonetizationEnabled 
                ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-emerald-500/40 text-white shadow-md' 
                : 'bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 border-rose-500/40 text-white shadow-md'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${isMonetizationEnabled ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-300">
                      Global Monetization Engine Status
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                      isMonetizationEnabled 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}>
                      {isMonetizationEnabled ? 'ENABLED (ON)' : 'TURNED OFF (DISABLED)'}
                    </span>
                  </div>
                  <h4 className="text-xl font-black tracking-tight text-white">
                    {isMonetizationEnabled ? 'Monetization Manager is Live & Serving Ads' : 'Monetization Manager is Turned OFF'}
                  </h4>
                  <p className="text-xs text-slate-300 max-w-xl">
                    {isMonetizationEnabled 
                      ? 'Partner ad banners, header tickers, native feed cards, and sticky bars are actively rendering for visitors across all 34 cities.'
                      : 'All sponsor ad banners, header promos, and sticky bottom bars are completely OFF and hidden from all site visitors.'
                    }
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (onToggleMonetization) {
                        onToggleMonetization(!isMonetizationEnabled);
                      }
                    }}
                    className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center space-x-2 shadow-md transition-all cursor-pointer ${
                      isMonetizationEnabled
                        ? 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-500'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-400'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    <span>{isMonetizationEnabled ? 'Turn OFF Monetization Manager' : 'Turn ON Monetization Manager'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleAllCampaignsStatus}
                    className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                    title="Quickly pause or activate all ad campaigns in the list"
                  >
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>{activeCount > 0 ? 'Pause All Banners' : 'Activate All Banners'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Top Analytics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-500 flex items-center space-x-1">
                  <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Active Banners</span>
                </span>
                <p className="text-2xl font-black text-slate-900 mt-2">
                  {activeCount} <span className="text-xs font-semibold text-slate-400">/ {ads.length} total</span>
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-500 flex items-center space-x-1">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>Total Impressions</span>
                </span>
                <p className="text-2xl font-black text-slate-900 mt-2">
                  {totalImpressions.toLocaleString()}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-500 flex items-center space-x-1">
                  <MousePointerClick className="w-3.5 h-3.5 text-purple-600" />
                  <span>Clicks & Leads</span>
                </span>
                <p className="text-2xl font-black text-slate-900 mt-2">
                  {totalClicks.toLocaleString()} <span className="text-xs font-bold text-emerald-600">({overallCtr}% CTR)</span>
                </p>
              </div>

              <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-xs">
                <span className="text-xs font-extrabold text-amber-400 flex items-center space-x-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Est. Monthly Revenue</span>
                </span>
                <p className="text-2xl font-black text-white mt-2">
                  ${estimatedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>

            {/* Campaign Editor Drawer / Form OR Campaign List View */}
            {isEditing ? (
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <h4 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                    <Edit3 className="w-5 h-5 text-[#FA2D48]" />
                    <span>{currentAd.id ? 'Edit Partner Campaign' : 'Create New Partner Campaign'}</span>
                  </h4>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel & Back
                  </button>
                </div>

                <form onSubmit={handleSaveAd} className="space-y-6">
                  
                  {/* Row 1: Advertiser Name, Category, Placement */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Advertiser / Partner Name *
                      </label>
                      <input
                        type="text"
                        value={currentAd.advertiserName || ''}
                        onChange={(e) => setCurrentAd({ ...currentAd, advertiserName: e.target.value })}
                        placeholder="e.g. Pacific Coast Escrow"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-[#FA2D48]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Industry Category *
                      </label>
                      <select
                        value={currentAd.category || 'escrow'}
                        onChange={(e) => setCurrentAd({ ...currentAd, category: e.target.value as AdCategory })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-[#FA2D48]"
                      >
                        <option value="escrow">Escrow Company</option>
                        <option value="lender">Mortgage Lender</option>
                        <option value="contractor">General Contractor / ADU</option>
                        <option value="realtor">Realtor Team / Agent</option>
                        <option value="broker">Real Estate Brokerage</option>
                        <option value="title">Title Insurance</option>
                        <option value="insurance">Home Insurance</option>
                        <option value="staging">Home Staging & Interior Design</option>
                        <option value="inspection">Home Inspection</option>
                        <option value="mover">Luxury Moving & Relocation</option>
                        <option value="legal">Real Estate Attorney</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Page Placement *
                      </label>
                      <select
                        value={currentAd.placement || 'header-banner'}
                        onChange={(e) => setCurrentAd({ ...currentAd, placement: e.target.value as AdPlacement })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-[#FA2D48]"
                      >
                        <option value="header-banner">Header Top Banner (Main Page)</option>
                        <option value="feed-native">News Feed Native Card</option>
                        <option value="article-spotlight">Article Reader Spotlight</option>
                        <option value="calculator-sidebar">Mortgage Calculator Sidebar</option>
                        <option value="market-trends-banner">Market Trends Sponsor Card</option>
                        <option value="sticky-bottom-bar">Sticky Bottom Bar</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Title, Subtitle, Sponsor Badge */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Campaign Title / Main Headline *
                      </label>
                      <input
                        type="text"
                        value={currentAd.title || ''}
                        onChange={(e) => setCurrentAd({ ...currentAd, title: e.target.value })}
                        placeholder="e.g. Guaranteed 10-Day Escrow Closing & Concierge Support"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-[#FA2D48]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Sponsor Badge / Trust Tag
                      </label>
                      <input
                        type="text"
                        value={currentAd.sponsorBadge || ''}
                        onChange={(e) => setCurrentAd({ ...currentAd, sponsorBadge: e.target.value })}
                        placeholder="e.g. Official Escrow Partner"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-[#FA2D48]"
                      />
                    </div>
                  </div>

                  {/* Subtitle / Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Description / Value Proposition
                    </label>
                    <textarea
                      value={currentAd.subtitle || ''}
                      onChange={(e) => setCurrentAd({ ...currentAd, subtitle: e.target.value })}
                      placeholder="e.g. Orange County's premier licensed escrow company with dedicated officer support."
                      rows={2}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-[#FA2D48]"
                    />
                  </div>

                  {/* Row 3: CTA Text, CTA Link, Phone, Target City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Call-to-Action Button
                      </label>
                      <input
                        type="text"
                        value={currentAd.ctaText || ''}
                        onChange={(e) => setCurrentAd({ ...currentAd, ctaText: e.target.value })}
                        placeholder="e.g. Open Escrow Now"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-[#FA2D48]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Destination Website URL
                      </label>
                      <input
                        type="url"
                        value={currentAd.ctaUrl || ''}
                        onChange={(e) => setCurrentAd({ ...currentAd, ctaUrl: e.target.value })}
                        placeholder="https://partner-website.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-[#FA2D48]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Direct Phone Number
                      </label>
                      <input
                        type="text"
                        value={currentAd.phone || ''}
                        onChange={(e) => setCurrentAd({ ...currentAd, phone: e.target.value })}
                        placeholder="(949) 555-0144"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-[#FA2D48]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Target City
                      </label>
                      <select
                        value={currentAd.targetCity || 'All'}
                        onChange={(e) => setCurrentAd({ ...currentAd, targetCity: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-[#FA2D48]"
                      >
                        <option value="All">All Cities (Regional)</option>
                        <option value="Irvine">Irvine</option>
                        <option value="Newport Beach">Newport Beach</option>
                        <option value="Costa Mesa">Costa Mesa</option>
                        <option value="Laguna Beach">Laguna Beach</option>
                        <option value="Huntington Beach">Huntington Beach</option>
                        <option value="Austin">Austin</option>
                      </select>
                    </div>
                  </div>

                  {/* Image URL & Preset Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Banner Image / Logo URL
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={currentAd.imageUrl || ''}
                        onChange={(e) => setCurrentAd({ ...currentAd, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-[#FA2D48]"
                      />
                    </div>

                    {/* Presets */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-500">Quick Presets:</span>
                      {PRESET_IMAGES.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCurrentAd({ ...currentAd, imageUrl: img.url })}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                            currentAd.imageUrl === img.url
                              ? 'bg-[#FA2D48] text-white'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {img.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Row 4: Status & Priority */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200">
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={currentAd.status === 'active'}
                          onChange={(e) => setCurrentAd({ ...currentAd, status: e.target.checked ? 'active' : 'paused' })}
                          className="w-4 h-4 text-[#FA2D48] rounded border-slate-300 focus:ring-[#FA2D48]"
                        />
                        <span className="text-xs font-bold text-slate-900">Campaign Active (Live)</span>
                      </label>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-700">Priority:</span>
                        <select
                          value={currentAd.priority || 'featured'}
                          onChange={(e) => setCurrentAd({ ...currentAd, priority: e.target.value as any })}
                          className="px-3 py-1 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-semibold"
                        >
                          <option value="featured">Featured (Top Slot)</option>
                          <option value="high">High Priority</option>
                          <option value="standard">Standard Rotation</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 rounded-xl bg-[#FA2D48] hover:bg-[#E0263E] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-2"
                      >
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        <span>Save & Publish Banner</span>
                      </button>
                    </div>
                  </div>

                </form>
              </div>
            ) : (
              /* CAMPAIGN LIST & FILTERS */
              <div className="space-y-4">
                
                {/* Search & Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 w-full sm:w-auto flex-1 max-w-md">
                    <div className="relative w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search partners, headlines..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FA2D48]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <select
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold"
                    >
                      <option value="all">All Locations</option>
                      <option value="all cities">Regional (All Cities)</option>
                      <option value="irvine">Irvine</option>
                      <option value="newport beach">Newport Beach</option>
                      <option value="austin">Austin</option>
                      <option value="laguna beach">Laguna Beach</option>
                    </select>

                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold"
                    >
                      <option value="all">All Industries / Themes</option>
                      <option value="escrow">Escrow</option>
                      <option value="lender">Mortgage Lender</option>
                      <option value="contractor">Contractors / ADU</option>
                      <option value="realtor">Realtors / Brokerages</option>
                      <option value="title">Title Insurance</option>
                      <option value="insurance">Home Insurance</option>
                      <option value="staging">Staging & Design</option>
                      <option value="inspection">Home Inspection</option>
                      <option value="mover">Luxury Movers</option>
                    </select>

                    <select
                      value={placementFilter}
                      onChange={(e) => setPlacementFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold"
                    >
                      <option value="all">All Placements</option>
                      <option value="header-banner">Header Banner</option>
                      <option value="feed-native">News Feed Native</option>
                      <option value="article-spotlight">Article Reader</option>
                      <option value="calculator-sidebar">Calculator Sidebar</option>
                      <option value="market-trends-banner">Market Trends</option>
                      <option value="sticky-bottom-bar">Sticky Bottom Bar</option>
                    </select>

                    <button
                      onClick={handleResetSampleSponsors}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shrink-0 border border-slate-200"
                      title="Load Sample Sponsors for all locations & themes"
                    >
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                      <span>Load Sample Catalog</span>
                    </button>

                    <button
                      onClick={handleCreateNew}
                      className="px-4 py-2 rounded-xl bg-[#FA2D48] hover:bg-[#E0263E] text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-md transition-all cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Partner Ad</span>
                    </button>
                  </div>
                </div>

                {/* Campaign Table */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 text-[11px] font-extrabold uppercase tracking-wider border-b border-slate-200">
                          <th className="p-3.5">Partner / Industry</th>
                          <th className="p-3.5">Headline & Placement</th>
                          <th className="p-3.5 text-center">Status</th>
                          <th className="p-3.5 text-right">Impressions</th>
                          <th className="p-3.5 text-right">Clicks (CTR)</th>
                          <th className="p-3.5 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-xs font-medium">
                        {filteredAds.map((ad) => {
                          const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : '0.0';
                          return (
                            <tr key={ad.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3.5">
                                <div className="flex items-center space-x-2.5">
                                  {ad.imageUrl && (
                                    <img
                                      src={ad.imageUrl}
                                      alt={ad.advertiserName}
                                      className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                                    />
                                  )}
                                  <div>
                                    <p className="font-extrabold text-slate-900">{ad.advertiserName}</p>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                      {ad.category} • {ad.targetCity || 'All'}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="p-3.5 max-w-xs">
                                <p className="font-bold text-slate-900 truncate" title={ad.title}>
                                  {ad.title}
                                </p>
                                <div className="flex items-center space-x-2 mt-0.5">
                                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                    {ad.placement}
                                  </span>
                                  {ad.sponsorBadge && (
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                      {ad.sponsorBadge}
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="p-3.5 text-center">
                                <button
                                  onClick={() => handleToggleStatus(ad)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold cursor-pointer transition-colors ${
                                    ad.status === 'active'
                                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                  }`}
                                >
                                  {ad.status === 'active' ? '● LIVE' : 'PAUSED'}
                                </button>
                              </td>

                              <td className="p-3.5 text-right font-mono font-bold text-slate-700">
                                {ad.impressions.toLocaleString()}
                              </td>

                              <td className="p-3.5 text-right font-mono">
                                <span className="font-extrabold text-slate-900">{ad.clicks}</span>
                                <span className="text-[10px] text-slate-500 ml-1 font-sans">({ctr}%)</span>
                              </td>

                              <td className="p-3.5 text-center">
                                <div className="flex items-center justify-center space-x-1">
                                  <button
                                    onClick={() => handleEdit(ad)}
                                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                                    title="Edit Campaign"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAd(ad.id, ad.advertiserName)}
                                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                                    title="Delete Campaign"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                        {filteredAds.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-500">
                              No campaigns found matching your search.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* Modal Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700">
              Firebase Firestore Ad Engine Synchronized
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-[11px] text-slate-400 font-semibold">
              Restricted Portal Access
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
