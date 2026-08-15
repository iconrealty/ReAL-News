import React, { useState, useRef } from 'react';
import { AdBanner, AdCategory, AdPlacement } from '../types';
import { Upload, Image, Sparkles, Trash2, CheckCircle2, Phone, ExternalLink } from 'lucide-react';

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
  { label: 'Escrow & Title', url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80' },
  { label: 'Mortgage Lender', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Contractor & ADU', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Realtor & Luxury', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80' },
  { label: 'Insurance & Legal', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' },
  { label: 'Office & Finance', url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80' }
];

const PRESET_LOGOS = [
  { label: 'Badge Shield', url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80' },
  { label: 'Finance Crest', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=200&q=80' },
  { label: 'Builder Mark', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&q=80' },
  { label: 'Luxury Brand', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80' }
];

const PRESET_BACKGROUNDS = [
  { label: 'None (Clean White)', url: '' },
  { label: 'Luxury Villa', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Ocean Coast', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Modern Office', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Warm Interior', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80' }
];

// Helper to compress and convert uploaded image files to high-performance base64 data URLs
function processUploadedImage(file: File, maxWidth = 1200, maxHeight = 800, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Please select a valid image file (.png, .jpg, .webp, .svg)'));
    }

    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(e.target?.result as string);
        }

        ctx.drawImage(img, 0, 0, width, height);
        const outputMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputMime, quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

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

  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);

  // Custom UI Confirmation States (replaces blocked window.confirm)
  const [adToDelete, setAdToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const confirmExecuteReset = async () => {
    setIsResetting(true);
    try {
      const res = await fetch('/api/admin/ads/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        onShowToast('Loaded sample sponsor catalog across all locations and themes!');
        setShowResetConfirm(false);
        onRefreshAds();
      }
    } catch (e) {
      onShowToast('Failed to load sample sponsors.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleToggleAllCampaignsStatus = async () => {
    const activeAdsCount = ads.filter(a => a.status === 'active').length;
    const nextStatus = activeAdsCount > 0 ? 'paused' : 'active';

    try {
      const updatePromises = ads.map(ad => 
        fetch('/api/admin/ads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...ad, status: nextStatus })
        })
      );
      await Promise.all(updatePromises);
      onShowToast(`Set all ${ads.length} campaigns to ${nextStatus.toUpperCase()}`);
      onRefreshAds();
    } catch (e) {
      onShowToast('Failed to update all campaigns status.');
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
    ctaUrl: '',
    phone: '',
    imageUrl: '',
    logoUrl: '',
    bgImageUrl: '',
    sponsorBadge: '',
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
      advertiserName: '',
      category: 'escrow',
      placement: 'header-banner',
      targetCity: 'All',
      title: '',
      subtitle: '',
      ctaText: 'Learn More',
      ctaUrl: '',
      phone: '',
      imageUrl: PRESET_IMAGES[0].url,
      logoUrl: '',
      bgImageUrl: '',
      sponsorBadge: 'Official Partner',
      status: 'active',
      priority: 'featured'
    });
    setIsEditing(true);
  };

  const handleEdit = (ad: AdBanner) => {
    setCurrentAd({ ...ad });
    setIsEditing(true);
  };

  // Upload handlers
  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const dataUrl = await processUploadedImage(file, 400, 400, 0.9);
      setCurrentAd(prev => ({ ...prev, logoUrl: dataUrl }));
      onShowToast('Partner logo loaded successfully!');
    } catch (err: any) {
      alert(err?.message || 'Failed to process logo image.');
    } finally {
      setUploadingLogo(false);
      if (logoFileInputRef.current) logoFileInputRef.current.value = '';
    }
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const dataUrl = await processUploadedImage(file, 1200, 800, 0.85);
      setCurrentAd(prev => ({ ...prev, imageUrl: dataUrl }));
      onShowToast('Banner photo loaded successfully!');
    } catch (err: any) {
      alert(err?.message || 'Failed to process photo.');
    } finally {
      setUploadingImage(false);
      if (imageFileInputRef.current) imageFileInputRef.current.value = '';
    }
  };

  const handleBgFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBg(true);
    try {
      const dataUrl = await processUploadedImage(file, 1400, 800, 0.82);
      setCurrentAd(prev => ({ ...prev, bgImageUrl: dataUrl }));
      onShowToast('Background photo loaded successfully!');
    } catch (err: any) {
      alert(err?.message || 'Failed to process background photo.');
    } finally {
      setUploadingBg(false);
      if (bgFileInputRef.current) bgFileInputRef.current.value = '';
    }
  };

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAd.advertiserName || !currentAd.title) {
      alert('Please fill out required fields (Advertiser Name & Headline).');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...currentAd,
        id: currentAd.id || `ad-${Date.now()}`,
        impressions: currentAd.impressions || 0,
        clicks: currentAd.clicks || 0,
        createdAtMs: currentAd.createdAtMs || Date.now(),
        updatedAt: new Date().toISOString()
      };

      const res = await fetch('/api/admin/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        onShowToast(currentAd.id ? 'Campaign updated successfully!' : 'New partner campaign created!');
        setIsEditing(false);
        onRefreshAds();
      } else {
        alert(data.error || 'Failed to save campaign');
      }
    } catch (e) {
      alert('Network error saving campaign');
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
        onShowToast(`Campaign status changed to ${nextStatus.toUpperCase()}`);
        onRefreshAds();
      }
    } catch (e) {
      alert('Status toggle failed');
    }
  };

  const confirmExecuteDelete = async () => {
    if (!adToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/ads/${adToDelete.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        onShowToast(`Deleted campaign "${adToDelete.name}"`);
        setAdToDelete(null);
        onRefreshAds();
      } else {
        onShowToast(data.error || 'Failed to delete campaign');
      }
    } catch (e) {
      onShowToast('Network error while deleting campaign');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAd = (id: string, name: string) => {
    setAdToDelete({ id, name });
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
        <div className="bg-white text-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-200 shrink-0">
          <div>
            <h3 className="font-extrabold text-lg tracking-tight text-slate-900">
              Settings
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onRefreshAds}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200"
              title="Refresh Data"
            >
              Refresh
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200"
              title="Close"
            >
              Close
            </button>
          </div>
        </div>

        {/* AUTHENTICATION LOCK OVERLAY IF NOT AUTHENTICATED */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center my-auto max-w-md mx-auto space-y-6">
            <div>
              <h4 className="text-2xl font-black text-slate-900">Passcode Required</h4>
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
                className="w-full py-3.5 rounded-2xl bg-[#FA2D48] hover:bg-[#E0263E] text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center"
              >
                Unlock Settings
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED MANAGER DASHBOARD CONTENT */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Master Monetization Toggle Banner */}
            <div className={`p-5 rounded-3xl border transition-all ${
              isMonetizationEnabled 
                ? 'bg-emerald-50/70 border-emerald-200 text-slate-900 shadow-2xs' 
                : 'bg-rose-50/70 border-rose-200 text-slate-900 shadow-2xs'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${isMonetizationEnabled ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span className="text-sm font-black uppercase tracking-wider text-slate-900">
                      Global Monetization Engine
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                      isMonetizationEnabled 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
                        : 'bg-rose-100 text-rose-700 border-rose-300'
                    }`}>
                      {isMonetizationEnabled ? 'ENABLED (ON)' : 'TURNED OFF (DISABLED)'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (onToggleMonetization) {
                        onToggleMonetization(!isMonetizationEnabled);
                      }
                    }}
                    className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-xs ${
                      isMonetizationEnabled
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isMonetizationEnabled ? 'Turn OFF Monetization' : 'Turn ON Monetization'}
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleAllCampaignsStatus}
                    className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs transition-all cursor-pointer shadow-xs"
                    title="Quickly pause or activate all ad campaigns in the list"
                  >
                    {activeCount > 0 ? 'Pause All Banners' : 'Activate All Banners'}
                  </button>
                </div>
              </div>
            </div>

            {/* Top Analytics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-500">
                  Active Banners
                </span>
                <p className="text-2xl font-black text-slate-900 mt-2">
                  {activeCount} <span className="text-xs font-semibold text-slate-400">/ {ads.length} total</span>
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-500">
                  Total Impressions
                </span>
                <p className="text-2xl font-black text-slate-900 mt-2">
                  {totalImpressions.toLocaleString()}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-500">
                  Clicks & Leads
                </span>
                <p className="text-2xl font-black text-slate-900 mt-2">
                  {totalClicks.toLocaleString()} <span className="text-xs font-bold text-emerald-600">({overallCtr}% CTR)</span>
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-500">
                  Est. Monthly Revenue
                </span>
                <p className="text-2xl font-black text-slate-900 mt-2">
                  ${estimatedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>

            {/* Campaign Editor Drawer / Form OR Campaign List View */}
            {isEditing ? (
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <h4 className="text-lg font-black text-slate-900">
                    {currentAd.id ? 'Edit Partner Campaign' : 'Create New Partner Campaign'}
                  </h4>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel & Back
                  </button>
                </div>

                {/* Hidden File Inputs for Local Uploads */}
                <input
                  type="file"
                  ref={logoFileInputRef}
                  onChange={handleLogoFileUpload}
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  className="hidden"
                />
                <input
                  type="file"
                  ref={imageFileInputRef}
                  onChange={handleImageFileUpload}
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  className="hidden"
                />
                <input
                  type="file"
                  ref={bgFileInputRef}
                  onChange={handleBgFileUpload}
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  className="hidden"
                />

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
                        <option value="calculator-sidebar">Mortgage Calculator (Underneath)</option>
                        <option value="market-trends-banner">Market Trends Sponsor Card</option>
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

                  {/* MEDIA UPLOAD SECTION: LOGO, FEATURED PHOTO, BACKGROUND PHOTO */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-5 shadow-2xs">
                    <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                      <Image className="w-4 h-4 text-[#FA2D48]" />
                      <h5 className="font-extrabold text-sm text-slate-900">
                        Visual Assets & Uploads (Logo, Banner Photo & Background)
                      </h5>
                    </div>

                    {/* 1. PARTNER LOGO UPLOAD & URL */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-800">
                          1. Partner Logo / Brand Avatar
                        </label>
                        <span className="text-[11px] text-slate-500 font-medium">Square .PNG / .SVG / .JPG</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <button
                          type="button"
                          onClick={() => logoFileInputRef.current?.click()}
                          disabled={uploadingLogo}
                          className="px-4 py-2.5 rounded-xl bg-[#FA2D48] hover:bg-[#E0263E] text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs shrink-0"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingLogo ? 'Uploading...' : 'Upload Logo File'}</span>
                        </button>

                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={currentAd.logoUrl || ''}
                            onChange={(e) => setCurrentAd({ ...currentAd, logoUrl: e.target.value })}
                            placeholder="Or paste Logo URL..."
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-[#FA2D48]"
                          />
                          {currentAd.logoUrl && (
                            <button
                              type="button"
                              onClick={() => setCurrentAd({ ...currentAd, logoUrl: '' })}
                              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-rose-600 transition-colors cursor-pointer"
                              title="Clear Logo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {currentAd.logoUrl && (
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                            <img src={currentAd.logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400">Logo Presets:</span>
                        {PRESET_LOGOS.map((logo, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentAd({ ...currentAd, logoUrl: logo.url })}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
                          >
                            {logo.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. MAIN / FEATURED PHOTO UPLOAD & URL */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-800">
                          2. Main / Featured Banner Photo
                        </label>
                        <span className="text-[11px] text-slate-500 font-medium">Used on Feed cards, Sidebars & Article Reader</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <button
                          type="button"
                          onClick={() => imageFileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs shrink-0"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingImage ? 'Uploading...' : 'Upload Photo File'}</span>
                        </button>

                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={currentAd.imageUrl || ''}
                            onChange={(e) => setCurrentAd({ ...currentAd, imageUrl: e.target.value })}
                            placeholder="Or paste Photo URL (Unsplash, CDN)..."
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-[#FA2D48]"
                          />
                          {currentAd.imageUrl && (
                            <button
                              type="button"
                              onClick={() => setCurrentAd({ ...currentAd, imageUrl: '' })}
                              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-rose-600 transition-colors cursor-pointer"
                              title="Clear Photo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {currentAd.imageUrl && (
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-2xs">
                            <img src={currentAd.imageUrl} alt="Photo Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400">Photo Presets:</span>
                        {PRESET_IMAGES.map((img, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setCurrentAd({ ...currentAd, imageUrl: img.url })}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
                          >
                            {img.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. BACKGROUND PHOTO UPLOAD & URL */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-800">
                          3. Custom Banner Background Photo (Optional)
                        </label>
                        <span className="text-[11px] text-slate-500 font-medium">Adds full-bleed imagery behind text with auto-contrast</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <button
                          type="button"
                          onClick={() => bgFileInputRef.current?.click()}
                          disabled={uploadingBg}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs shrink-0"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingBg ? 'Uploading...' : 'Upload Background File'}</span>
                        </button>

                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={currentAd.bgImageUrl || ''}
                            onChange={(e) => setCurrentAd({ ...currentAd, bgImageUrl: e.target.value })}
                            placeholder="Or paste Background Image URL..."
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-[#FA2D48]"
                          />
                          {currentAd.bgImageUrl && (
                            <button
                              type="button"
                              onClick={() => setCurrentAd({ ...currentAd, bgImageUrl: '' })}
                              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-rose-600 transition-colors cursor-pointer"
                              title="Clear Background"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {currentAd.bgImageUrl && (
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-2xs">
                            <img src={currentAd.bgImageUrl} alt="Background Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400">Background Presets:</span>
                        {PRESET_BACKGROUNDS.map((bg, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentAd({ ...currentAd, bgImageUrl: bg.url })}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
                          >
                            {bg.label}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* LIVE BANNER VISUAL PREVIEW */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Live Preview ({currentAd.placement || 'header-banner'})
                      </span>
                    </div>

                    <div 
                      className="p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all"
                      style={currentAd.bgImageUrl ? { backgroundImage: `url(${currentAd.bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundColor: '#ffffff' }}
                    >
                      {currentAd.bgImageUrl && (
                        <div className="absolute inset-0 bg-white/92 backdrop-blur-[2px] pointer-events-none" />
                      )}

                      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center space-x-3 min-w-0">
                          {currentAd.logoUrl ? (
                            <img
                              src={currentAd.logoUrl}
                              alt="Logo"
                              className="w-10 h-10 rounded-xl object-contain bg-white p-1 border border-slate-200 shadow-2xs shrink-0"
                            />
                          ) : currentAd.imageUrl ? (
                            <img
                              src={currentAd.imageUrl}
                              alt="Photo"
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : null}

                          <div className="min-w-0">
                            <div className="flex items-center space-x-2 mb-0.5">
                              <span className="text-[9px] uppercase font-black bg-[#FA2D48] text-white px-2 py-0.5 rounded">
                                Ad
                              </span>
                              <span className="font-extrabold text-xs text-slate-900 truncate">
                                {currentAd.advertiserName || 'Advertiser Name'}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                ✓ {currentAd.sponsorBadge || 'Verified Partner'}
                              </span>
                            </div>
                            <h4 className="font-black text-sm text-slate-950 truncate">
                              {currentAd.title || 'Your Campaign Headline Will Appear Here'}
                            </h4>
                            {currentAd.subtitle && (
                              <p className="text-[11px] text-slate-600 truncate mt-0.5">
                                {currentAd.subtitle}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                          {currentAd.phone && (
                            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center space-x-1">
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>{currentAd.phone}</span>
                            </span>
                          )}
                          <button
                            type="button"
                            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs flex items-center space-x-1 shadow-xs transition-all"
                          >
                            <span>{currentAd.ctaText || 'Learn More'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
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
                        className="px-6 py-2.5 rounded-xl bg-[#FA2D48] hover:bg-[#E0263E] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{saving ? 'Saving to Cloud...' : 'Save & Publish Banner'}</span>
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
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search partners, headlines..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FA2D48]"
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
                    </select>

                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer shrink-0 border border-slate-200"
                      title="Load Sample Sponsors for all locations & themes"
                    >
                      Load Sample Catalog
                    </button>

                    <button
                      onClick={handleCreateNew}
                      className="px-4 py-2 rounded-xl bg-[#FA2D48] hover:bg-[#E0263E] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer shrink-0"
                    >
                      New Partner Ad
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
                                    className="px-2 py-1 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                                    title="Edit Campaign"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAd(ad.id, ad.advertiserName)}
                                    className="px-2 py-1 rounded-lg text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                                    title="Delete Campaign"
                                  >
                                    Delete
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

        {/* IN-MODAL DELETE CONFIRMATION DIALOG */}
        {adToDelete && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900">Delete Campaign?</h4>
                <p className="text-xs text-slate-600">
                  Are you sure you want to permanently delete <span className="font-bold text-slate-900">"{adToDelete.name}"</span>?
                </p>
                <p className="text-[11px] text-slate-400">
                  This campaign will be removed immediately from all active banner rotations.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdToDelete(null)}
                  disabled={isDeleting}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmExecuteDelete}
                  disabled={isDeleting}
                  className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  {isDeleting ? (
                    <span>Deleting...</span>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* IN-MODAL RESET SAMPLE SPONSORS CONFIRMATION */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900">Load Sample Sponsors?</h4>
                <p className="text-xs text-slate-600">
                  Would you like to populate the catalog with standard sample sponsors across all Orange County locations and industry themes?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  disabled={isResetting}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmExecuteReset}
                  disabled={isResetting}
                  className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  {isResetting ? (
                    <span>Loading...</span>
                  ) : (
                    <span>Load Catalog</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
