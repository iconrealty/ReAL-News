import React, { useEffect, useRef } from 'react';
import { AdBanner, AdPlacement } from '../types';
import { ExternalLink, Phone, ShieldCheck, Sparkles, Building, Landmark, HardHat, Home, Award, FileText, Shield } from 'lucide-react';

interface AdBannerRendererProps {
  ads: AdBanner[];
  placement: AdPlacement;
  cityName?: string;
  onOpenManager?: () => void;
  className?: string;
  monetizationEnabled?: boolean;
}

export function AdBannerRenderer({ 
  ads, 
  placement, 
  cityName, 
  onOpenManager, 
  className = '',
  monetizationEnabled 
}: AdBannerRendererProps) {
  const trackedIds = useRef<Set<string>>(new Set());

  // Check if monetization is explicitly disabled via prop or localStorage
  const isEnabled = monetizationEnabled !== undefined 
    ? monetizationEnabled 
    : (typeof localStorage !== 'undefined' ? localStorage.getItem('monetization_enabled') !== 'false' : true);

  if (!isEnabled) {
    return null;
  }

  // Filter active ads matching placement and city
  const matchingAds = ads.filter(ad => {
    if (ad.status !== 'active') return false;
    if (ad.placement !== placement) return false;
    if (cityName && cityName !== 'All' && cityName !== 'Orange County' && ad.targetCity && ad.targetCity !== 'All') {
      return ad.targetCity.toLowerCase() === cityName.toLowerCase();
    }
    return true;
  });

  // Select most recently updated active ad first, so newly saved or edited campaigns immediately take effect
  const selectedAd = [...matchingAds].sort((a, b) => {
    const timeA = new Date(a.updatedAt || a.createdAtMs || 0).getTime();
    const timeB = new Date(b.updatedAt || b.createdAtMs || 0).getTime();
    const timeDiff = timeB - timeA;
    if (Math.abs(timeDiff) > 1000) return timeDiff;

    const priorityWeight = { featured: 3, high: 2, standard: 1 };
    return (priorityWeight[b.priority] || 1) - (priorityWeight[a.priority] || 1);
  })[0];

  useEffect(() => {
    if (selectedAd && !trackedIds.current.has(selectedAd.id)) {
      trackedIds.current.add(selectedAd.id);
      fetch('/api/ads/impression', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedAd.id })
      }).catch(err => console.warn('Impression track error:', err));
    }
  }, [selectedAd]);

  if (!selectedAd) return null;

  const handleAdClick = (e: React.MouseEvent) => {
    fetch('/api/ads/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedAd.id })
    }).catch(err => console.warn('Click track error:', err));

    if (selectedAd.ctaUrl && selectedAd.ctaUrl !== '#') {
      window.open(selectedAd.ctaUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'escrow': return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'lender': return <Landmark className="w-4 h-4 text-blue-600" />;
      case 'contractor': return <HardHat className="w-4 h-4 text-amber-600" />;
      case 'realtor': return <Home className="w-4 h-4 text-[#FA2D48]" />;
      case 'broker': return <Award className="w-4 h-4 text-purple-600" />;
      case 'title': return <ShieldCheck className="w-4 h-4 text-indigo-600" />;
      case 'insurance': return <Shield className="w-4 h-4 text-teal-600" />;
      default: return <Building className="w-4 h-4 text-slate-600" />;
    }
  };

  // --- RENDERING VARIATIONS BASED ON PLACEMENT ---

  // 1. HEADER BANNER (Top Ticker/Marquee under navigation)
  if (placement === 'header-banner') {
    return (
      <div className={`bg-white text-slate-900 rounded-2xl p-3.5 sm:p-4 shadow-2xs border border-slate-200/90 relative overflow-hidden my-3 ${className}`}>
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="p-2 rounded-xl bg-slate-100 shrink-0 border border-slate-200">
              {getCategoryIcon(selectedAd.category)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#FA2D48] text-white px-2 py-0.5 rounded-full">
                  Sponsored
                </span>
                <span className="font-bold text-slate-900 truncate max-w-[180px] sm:max-w-xs">
                  {selectedAd.advertiserName}
                </span>
                {selectedAd.sponsorBadge && (
                  <span className="hidden md:inline-block text-[11px] font-bold text-emerald-600">
                    • {selectedAd.sponsorBadge}
                  </span>
                )}
              </div>
              <p className="text-slate-800 font-semibold text-xs sm:text-sm truncate mt-0.5">
                {selectedAd.title}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end shrink-0">
            {selectedAd.phone && (
              <a
                href={`tel:${selectedAd.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center space-x-1.5 transition-colors border border-slate-200"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{selectedAd.phone}</span>
              </a>
            )}
            <button
              onClick={handleAdClick}
              className="px-4 py-1.5 rounded-xl bg-[#FA2D48] hover:bg-[#E0263E] text-white text-xs font-extrabold flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <span>{selectedAd.ctaText || 'Learn More'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            {onOpenManager && (
              <button
                onClick={(e) => { e.stopPropagation(); onOpenManager(); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Ad Manager & Partner Settings"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. FEED NATIVE (Native Card inside news grid)
  if (placement === 'feed-native') {
    return (
      <div className={`bg-gradient-to-br from-amber-500/5 via-white to-slate-50 border border-amber-200/80 rounded-3xl p-5 sm:p-6 shadow-xs relative overflow-hidden flex flex-col justify-between group hover:border-amber-300 transition-all ${className}`}>
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-extrabold tracking-widest bg-amber-500 text-white px-2.5 py-0.5 rounded-full">
                Featured Local Partner
              </span>
              <span className="text-xs font-bold text-slate-600 flex items-center space-x-1">
                {getCategoryIcon(selectedAd.category)}
                <span className="capitalize">{selectedAd.category}</span>
              </span>
            </div>
            {selectedAd.sponsorBadge && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-lg">
                {selectedAd.sponsorBadge}
              </span>
            )}
          </div>

          {selectedAd.imageUrl && (
            <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-slate-100">
              <img
                src={selectedAd.imageUrl}
                alt={selectedAd.advertiserName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  {selectedAd.advertiserName}
                </p>
              </div>
            </div>
          )}

          <h3 className="text-lg font-black text-slate-900 group-hover:text-[#FA2D48] transition-colors leading-snug mb-2">
            {selectedAd.title}
          </h3>
          {selectedAd.subtitle && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
              {selectedAd.subtitle}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2 mt-2">
          {selectedAd.phone ? (
            <a
              href={`tel:${selectedAd.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center space-x-1"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>{selectedAd.phone}</span>
            </a>
          ) : (
            <span className="text-xs font-medium text-slate-400">Verified Partner</span>
          )}

          <button
            onClick={handleAdClick}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
          >
            <span>{selectedAd.ctaText || 'Contact Partner'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // 3. CALCULATOR SIDEBAR / MARKET TRENDS BANNER
  if (placement === 'calculator-sidebar' || placement === 'market-trends-banner') {
    return (
      <div className={`bg-white text-slate-900 rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200 relative overflow-hidden ${className}`}>
        <div className="relative space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-extrabold bg-[#FA2D48] text-white px-2.5 py-0.5 rounded-full">
              Featured Partner
            </span>
            <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
              {getCategoryIcon(selectedAd.category)}
              <span className="capitalize">{selectedAd.category}</span>
            </span>
          </div>

          <div className="flex items-start space-x-3">
            {selectedAd.imageUrl && (
              <img
                src={selectedAd.imageUrl}
                alt={selectedAd.advertiserName}
                className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-200 shadow-2xs"
              />
            )}
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">
                {selectedAd.advertiserName}
              </h4>
              {selectedAd.sponsorBadge && (
                <p className="text-xs font-bold text-emerald-600 mt-0.5">
                  ✓ {selectedAd.sponsorBadge}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-extrabold text-base text-slate-900 leading-snug">
              {selectedAd.title}
            </h3>
            {selectedAd.subtitle && (
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {selectedAd.subtitle}
              </p>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {selectedAd.phone && (
              <a
                href={`tel:${selectedAd.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center space-x-2 transition-colors border border-slate-200"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call {selectedAd.phone}</span>
              </a>
            )}

            <button
              onClick={handleAdClick}
              className="px-4 py-2 rounded-xl bg-[#FA2D48] hover:bg-[#E0263E] text-white text-xs font-black flex items-center justify-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <span>{selectedAd.ctaText || 'Get Started'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. ARTICLE SPOTLIGHT (Inside story reader)
  if (placement === 'article-spotlight') {
    return (
      <div className={`my-8 bg-slate-50 text-slate-900 rounded-3xl p-6 border border-slate-200 relative overflow-hidden shadow-2xs ${className}`}>
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold uppercase bg-amber-500 text-white px-2 py-0.5 rounded-full">
              Sponsor Spotlight
            </span>
            <span className="text-xs font-bold text-slate-700">
              {selectedAd.advertiserName}
            </span>
          </div>
          {selectedAd.sponsorBadge && (
            <span className="text-xs font-bold text-emerald-600">
              {selectedAd.sponsorBadge}
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-5">
          {selectedAd.imageUrl && (
            <img
              src={selectedAd.imageUrl}
              alt={selectedAd.advertiserName}
              className="w-full md:w-36 h-28 rounded-2xl object-cover shrink-0 border border-slate-200"
            />
          )}

          <div className="space-y-2 flex-1 text-center md:text-left">
            <h4 className="font-black text-lg text-slate-900 leading-tight">
              {selectedAd.title}
            </h4>
            {selectedAd.subtitle && (
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedAd.subtitle}
              </p>
            )}
            
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              {selectedAd.phone && (
                <a
                  href={`tel:${selectedAd.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center space-x-1.5 transition-colors border border-slate-200 shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{selectedAd.phone}</span>
                </a>
              )}
              <button
                onClick={handleAdClick}
                className="px-5 py-2 rounded-xl bg-[#FA2D48] hover:bg-[#E0263E] text-white text-xs font-black flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <span>{selectedAd.ctaText || 'Connect Now'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. STICKY BOTTOM BAR (Mobile / Desktop Bottom Bar)
  if (placement === 'sticky-bottom-bar') {
    return (
      <div className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md text-slate-900 border-t border-slate-200 px-4 py-2.5 shadow-xl ${className}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3 min-w-0">
            <span className="text-[9px] uppercase font-extrabold bg-[#FA2D48] text-white px-2 py-0.5 rounded-md shrink-0">
              Ad
            </span>
            <div className="truncate">
              <span className="font-extrabold text-slate-900 mr-2">{selectedAd.advertiserName}:</span>
              <span className="text-slate-600 font-medium truncate">{selectedAd.title}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {selectedAd.phone && (
              <a
                href={`tel:${selectedAd.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="hidden sm:flex px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs items-center space-x-1 border border-slate-200"
              >
                <Phone className="w-3 h-3 text-emerald-600" />
                <span>{selectedAd.phone}</span>
              </a>
            )}
            <button
              onClick={handleAdClick}
              className="px-3.5 py-1.5 rounded-lg bg-[#FA2D48] hover:bg-[#E0263E] text-white font-black text-xs flex items-center space-x-1 shadow-2xs cursor-pointer"
            >
              <span>{selectedAd.ctaText || 'Visit'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
