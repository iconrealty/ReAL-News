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
      <div 
        className={`relative rounded-2xl p-3.5 sm:p-4 shadow-sm border border-slate-200/90 overflow-hidden my-3 ${className}`}
        style={selectedAd.bgImageUrl ? { backgroundImage: `url(${selectedAd.bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundColor: '#ffffff' }}
      >
        {/* Background Overlay if custom bg is present */}
        {selectedAd.bgImageUrl && (
          <div className="absolute inset-0 bg-white/92 backdrop-blur-[2px] pointer-events-none" />
        )}

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-900">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {selectedAd.logoUrl && (
              <img
                src={selectedAd.logoUrl}
                alt={selectedAd.advertiserName}
                className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 border border-slate-200 shadow-2xs shrink-0"
              />
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-0.5">
                <span className="text-[10px] uppercase tracking-wider font-black bg-[#FA2D48] text-white px-2 py-0.5 rounded-md">
                  Ad
                </span>
                <span className="font-extrabold text-slate-900 truncate max-w-[180px] sm:max-w-xs">
                  {selectedAd.advertiserName}
                </span>
                {/* Proposal #4: Editorial "Verified Partner" Trust Ribbon */}
                <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                  <span>✓</span>
                  <span>{selectedAd.sponsorBadge || `Verified Local Partner`}</span>
                </span>
              </div>
              <p className="text-slate-950 font-black text-sm sm:text-base tracking-tight truncate">
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
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black flex items-center space-x-1.5 transition-all shadow-xs hover:shadow-sm cursor-pointer"
            >
              <span>{selectedAd.ctaText || 'Learn More'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. FEED NATIVE (Native Card inside news grid)
  if (placement === 'feed-native') {
    return (
      <div 
        className={`border border-slate-200 hover:border-slate-300 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden flex flex-col justify-between transition-all ${className}`}
        style={selectedAd.bgImageUrl ? { backgroundImage: `url(${selectedAd.bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundColor: '#ffffff' }}
      >
        {/* Background Overlay if custom bg is present */}
        {selectedAd.bgImageUrl && (
          <div className="absolute inset-0 bg-white/94 backdrop-blur-[2px] pointer-events-none" />
        )}

        <div className="relative">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-black tracking-widest bg-slate-900 text-white px-2.5 py-0.5 rounded-md">
                Ad
              </span>
              {selectedAd.logoUrl && (
                <img
                  src={selectedAd.logoUrl}
                  alt={selectedAd.advertiserName}
                  className="w-5 h-5 rounded-md object-contain bg-white border border-slate-200"
                />
              )}
              <span className="text-xs font-semibold text-slate-500 capitalize">
                {selectedAd.category}
              </span>
            </div>
            {/* Proposal #4 Trust Ribbon Badge */}
            <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/90 shadow-2xs">
              <span>✓</span>
              <span>{selectedAd.sponsorBadge || 'Verified Partner'}</span>
            </span>
          </div>

          {selectedAd.imageUrl && (
            <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-slate-100 border border-slate-100">
              <img
                src={selectedAd.imageUrl}
                alt={selectedAd.advertiserName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white flex items-center space-x-2">
                {selectedAd.logoUrl && (
                  <img
                    src={selectedAd.logoUrl}
                    alt=""
                    className="w-5 h-5 rounded object-contain bg-white/90 p-0.5"
                  />
                )}
                <p className="text-xs font-black text-amber-300 uppercase tracking-wider">
                  {selectedAd.advertiserName}
                </p>
              </div>
            </div>
          )}

          <h3 className="text-xl sm:text-2xl font-black text-slate-950 leading-tight mb-2 tracking-tight">
            {selectedAd.title}
          </h3>
          {selectedAd.subtitle && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
              {selectedAd.subtitle}
            </p>
          )}
        </div>

        <div className="relative pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
          {selectedAd.phone ? (
            <a
              href={`tel:${selectedAd.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center space-x-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{selectedAd.phone}</span>
            </a>
          ) : (
            <span className="text-xs font-medium text-slate-400">Verified Local Partner</span>
          )}

          <button
            onClick={handleAdClick}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
          >
            <span>{selectedAd.ctaText || 'Contact Partner'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // 3. CALCULATOR SIDEBAR (Compact, Low-Height Sponsor Ribbon under Calculator)
  if (placement === 'calculator-sidebar') {
    return (
      <div 
        className={`text-slate-900 rounded-2xl px-3.5 sm:px-5 py-2.5 sm:py-3 shadow-xs border border-slate-200/90 relative overflow-hidden transition-all bg-white hover:border-slate-300 ${className}`}
        style={selectedAd.bgImageUrl ? { backgroundImage: `url(${selectedAd.bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundColor: '#ffffff' }}
      >
        {/* Background Overlay if custom bg is present */}
        {selectedAd.bgImageUrl && (
          <div className="absolute inset-0 bg-white/94 backdrop-blur-[1px] pointer-events-none" />
        )}

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
          {/* Left: Ad Badge, Logo, Advertiser & Verified Badge */}
          <div className="flex items-center space-x-2.5 min-w-0 w-full sm:w-auto">
            <span className="text-[9px] uppercase tracking-wider font-black bg-[#FA2D48] text-white px-2 py-0.5 rounded-md shrink-0">
              Ad
            </span>

            {selectedAd.logoUrl ? (
              <img
                src={selectedAd.logoUrl}
                alt={selectedAd.advertiserName}
                className="w-7 h-7 rounded-lg object-contain bg-white p-0.5 border border-slate-200 shrink-0"
              />
            ) : selectedAd.imageUrl ? (
              <img
                src={selectedAd.imageUrl}
                alt={selectedAd.advertiserName}
                className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0"
              />
            ) : null}

            <div className="min-w-0 flex-1 sm:flex-none">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xs text-slate-900 truncate">
                  {selectedAd.advertiserName}
                </span>
                <span className="inline-flex items-center space-x-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md border border-emerald-200/70 shrink-0">
                  <span>✓</span>
                  <span>{selectedAd.sponsorBadge || 'Verified'}</span>
                </span>
              </div>
              <p className="font-bold text-xs sm:text-sm text-slate-950 truncate max-w-xs md:max-w-md lg:max-w-xl">
                {selectedAd.title}
              </p>
            </div>
          </div>

          {/* Right: Phone & Action Button */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            {selectedAd.phone && (
              <a
                href={`tel:${selectedAd.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center space-x-1 transition-colors border border-slate-200"
              >
                <Phone className="w-3 h-3 text-emerald-600" />
                <span className="hidden md:inline">{selectedAd.phone}</span>
                <span className="md:hidden">Call</span>
              </a>
            )}

            <button
              onClick={handleAdClick}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-black flex items-center space-x-1.5 shadow-2xs cursor-pointer transition-all"
            >
              <span>{selectedAd.ctaText || 'Get Quote'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3b. MARKET TRENDS BANNER (Streamlined Sponsor Card)
  if (placement === 'market-trends-banner') {
    return (
      <div 
        className={`text-slate-900 rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 relative overflow-hidden transition-all bg-white ${className}`}
        style={selectedAd.bgImageUrl ? { backgroundImage: `url(${selectedAd.bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundColor: '#ffffff' }}
      >
        {/* Background Overlay if custom bg is present */}
        {selectedAd.bgImageUrl && (
          <div className="absolute inset-0 bg-white/93 backdrop-blur-[2px] pointer-events-none" />
        )}

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <span className="text-[10px] uppercase tracking-widest font-black bg-[#FA2D48] text-white px-2 py-0.5 rounded-md shrink-0">
              Ad
            </span>

            {selectedAd.logoUrl ? (
              <img
                src={selectedAd.logoUrl}
                alt={selectedAd.advertiserName}
                className="w-10 h-10 rounded-xl object-contain bg-white p-1 border border-slate-200 shadow-2xs shrink-0"
              />
            ) : selectedAd.imageUrl ? (
              <img
                src={selectedAd.imageUrl}
                alt={selectedAd.advertiserName}
                className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
              />
            ) : null}

            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xs text-slate-900">
                  {selectedAd.advertiserName}
                </span>
                <span className="inline-flex items-center space-x-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                  <span>✓</span>
                  <span>{selectedAd.sponsorBadge || 'Verified Partner'}</span>
                </span>
              </div>
              <h4 className="font-black text-sm sm:text-base text-slate-950 truncate leading-snug">
                {selectedAd.title}
              </h4>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end shrink-0">
            {selectedAd.phone && (
              <a
                href={`tel:${selectedAd.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center space-x-1.5 transition-colors border border-slate-200"
              >
                <Phone className="w-3 h-3 text-emerald-600" />
                <span>Call {selectedAd.phone}</span>
              </a>
            )}

            <button
              onClick={handleAdClick}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-black flex items-center space-x-1.5 shadow-2xs cursor-pointer transition-all"
            >
              <span>{selectedAd.ctaText || 'Get Started'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. ARTICLE SPOTLIGHT (Inside story reader)
  if (placement === 'article-spotlight') {
    return (
      <div 
        className={`my-8 text-slate-900 rounded-3xl p-6 border border-slate-200 relative overflow-hidden shadow-2xs ${className}`}
        style={selectedAd.bgImageUrl ? { backgroundImage: `url(${selectedAd.bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundColor: '#f8fafc' }}
      >
        {selectedAd.bgImageUrl && (
          <div className="absolute inset-0 bg-white/93 backdrop-blur-[2px] pointer-events-none" />
        )}

        <div className="relative">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase bg-amber-500 text-white px-2.5 py-0.5 rounded-full">
                Ad
              </span>
              {selectedAd.logoUrl && (
                <img
                  src={selectedAd.logoUrl}
                  alt=""
                  className="w-5 h-5 rounded object-contain bg-white border border-slate-200"
                />
              )}
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
            {selectedAd.imageUrl ? (
              <img
                src={selectedAd.imageUrl}
                alt={selectedAd.advertiserName}
                className="w-full md:w-36 h-28 rounded-2xl object-cover shrink-0 border border-slate-200"
              />
            ) : selectedAd.logoUrl ? (
              <img
                src={selectedAd.logoUrl}
                alt={selectedAd.advertiserName}
                className="w-24 h-24 rounded-2xl object-contain bg-white p-2 shrink-0 border border-slate-200"
              />
            ) : null}

            <div className="space-y-2 flex-1 text-center md:text-left">
              <h4 className="font-black text-xl sm:text-2xl text-slate-950 leading-tight tracking-tight">
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
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <span>{selectedAd.ctaText || 'Connect Now'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
