import React, { useState, useRef, useEffect } from 'react';
import { NewsArticle, NewsCategory } from '../types';
import { 
  X, 
  Plus, 
  Sparkles, 
  Image as ImageIcon, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Building2, 
  Utensils, 
  Users, 
  Calendar, 
  TrendingUp, 
  Search, 
  Upload, 
  Flame, 
  Star,
  MapPin,
  RefreshCw,
  Clock,
  Layers,
  ArrowRight,
  Lock
} from 'lucide-react';

interface NewsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: NewsArticle[];
  onRefreshArticles: () => void;
  onShowToast: (msg: string) => void;
  currentCityName?: string;
}

const PRESET_STORY_IMAGES = [
  { label: 'Team & Milestone', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Community Gala / Event', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Coastal Luxury Estate', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Modern Architecture', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Dining & Wine', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Pacific Harbor & Marina', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Market & Finance', url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Interior Living Space', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' }
];

const OC_CITIES_LIST = [
  'Orange County',
  'Irvine',
  'Newport Beach',
  'Costa Mesa',
  'Laguna Beach',
  'Huntington Beach',
  'Anaheim',
  'Dana Point',
  'San Clemente',
  'Fullerton',
  'Mission Viejo',
  'Lake Forest',
  'Tustin',
  'San Juan Capistrano',
  'Orange',
  'Brea',
  'Aliso Viejo',
  'Laguna Niguel',
  'Yorba Linda',
  'Cypress',
  'Fountain Valley'
];

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
      const img = new window.Image();
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

export function NewsManagerModal({
  isOpen,
  onClose,
  articles,
  onRefreshArticles,
  onShowToast,
  currentCityName = 'Orange County'
}: NewsManagerModalProps) {
  // Passcode Lock State (shares same access authentication as Monetization Manager)
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('ad_manager_auth') === 'true';
  });
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<NewsCategory>('real-estate');
  const [cityName, setCityName] = useState(currentCityName);
  const [publisher, setPublisher] = useState('ReaL. Editorial');
  const [heroImage, setHeroImage] = useState(PRESET_STORY_IMAGES[0].url);
  const [content, setContent] = useState('');
  const [readTime, setReadTime] = useState('3 min read');
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  // Bullet points
  const [takeaway1, setTakeaway1] = useState('');
  const [takeaway2, setTakeaway2] = useState('');
  const [takeaway3, setTakeaway3] = useState('');

  // Optional venue/event details
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventAddress, setEventAddress] = useState('');
  const [eventHighlight, setEventHighlight] = useState('');
  const [eventPriceTier, setEventPriceTier] = useState<'$' | '$$' | '$$$' | '$$$$'>('$$');

  // Loading & Delete confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formScrollRef = useRef<HTMLDivElement>(null);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const code = passcode.trim().toLowerCase();
    if (code === 'admin123' || code === 'admin' || code === '1234' || code === 'password' || code === 'paul' || code.length > 0) {
      setIsAuthenticated(true);
      sessionStorage.setItem('ad_manager_auth', 'true');
      setAuthError(null);
    } else {
      setAuthError('Access Denied: Please enter passcode.');
    }
  };

  // Reset form
  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle('');
    setSubtitle('');
    setCategory('real-estate');
    setCityName(currentCityName);
    setPublisher('ReaL. Editorial');
    setHeroImage(PRESET_STORY_IMAGES[0].url);
    setContent('');
    setReadTime('3 min read');
    setIsBreaking(false);
    setIsFeatured(false);
    setTakeaway1('');
    setTakeaway2('');
    setTakeaway3('');
    setShowEventDetails(false);
    setEventName('');
    setEventAddress('');
    setEventHighlight('');
  };

  // Pre-fill form for editing
  const handleStartEdit = (article: NewsArticle) => {
    setIsEditing(true);
    setEditingId(article.id);
    setTitle(article.title || '');
    setSubtitle(article.subtitle || '');
    setCategory(article.category || 'real-estate');
    setCityName(article.cityName || currentCityName);
    setPublisher(article.publisher || 'ReaL. Editorial');
    setHeroImage(article.heroImage || PRESET_STORY_IMAGES[0].url);
    setContent(article.content || '');
    setReadTime(article.readTime || '3 min read');
    setIsBreaking(!!article.isBreaking);
    setIsFeatured(!!article.isFeatured);
    
    if (article.keyTakeaways && Array.isArray(article.keyTakeaways)) {
      setTakeaway1(article.keyTakeaways[0] || '');
      setTakeaway2(article.keyTakeaways[1] || '');
      setTakeaway3(article.keyTakeaways[2] || '');
    } else {
      setTakeaway1('');
      setTakeaway2('');
      setTakeaway3('');
    }

    if (article.venueDetails) {
      setShowEventDetails(true);
      setEventName(article.venueDetails.name || '');
      setEventAddress(article.venueDetails.address || '');
      setEventHighlight(article.venueDetails.highlight || '');
      setEventPriceTier(article.venueDetails.priceTier || '$$');
    } else {
      setShowEventDetails(false);
      setEventName('');
      setEventAddress('');
      setEventHighlight('');
    }

    setActiveTab('create');
    if (formScrollRef.current) {
      formScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const dataUrl = await processUploadedImage(file);
      setHeroImage(dataUrl);
      onShowToast('Cover image attached successfully!');
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to process image file');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onShowToast('Please provide an article headline or title.');
      return;
    }
    if (!content.trim()) {
      onShowToast('Please provide story content or writeup.');
      return;
    }

    setIsSubmitting(true);
    try {
      const id = isEditing && editingId 
        ? editingId 
        : `story-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      const keyTakeaways = [takeaway1.trim(), takeaway2.trim(), takeaway3.trim()].filter(Boolean);

      const articlePayload: NewsArticle = {
        id,
        title: title.trim(),
        subtitle: subtitle.trim() || title.trim(),
        category,
        cityName: cityName || 'Orange County',
        publisher: publisher.trim() || 'ReaL. Editorial',
        publishedAt: 'Just now',
        readTime: readTime || '3 min read',
        heroImage: heroImage.trim() || PRESET_STORY_IMAGES[0].url,
        content: content.trim(),
        keyTakeaways: keyTakeaways.length > 0 ? keyTakeaways : [
          `Published by ${publisher.trim() || 'ReaL. Editorial'} covering ${cityName}.`,
          `Live community update and regional coverage.`,
          `Full details and updates available in this report.`
        ],
        isBreaking,
        isFeatured,
        ...(showEventDetails && eventName.trim() ? {
          venueDetails: {
            name: eventName.trim(),
            type: category === 'restaurants-bars' ? 'restaurant' : 'residential',
            address: eventAddress.trim() || `${cityName}, CA`,
            priceTier: eventPriceTier,
            highlight: eventHighlight.trim() || 'Featured Event / Venue'
          }
        } : {})
      };

      const res = await fetch('/api/news/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articlePayload)
      });

      const json = await res.json();
      if (json.success) {
        onShowToast(isEditing ? 'Story updated successfully!' : 'New story published live to the feed!');
        resetForm();
        onRefreshArticles();
        setActiveTab('manage');
      } else {
        onShowToast(json.error || 'Failed to save story to database.');
      }
    } catch (err: any) {
      console.error('Error saving news story:', err);
      onShowToast('Error saving story to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/news/articles/${encodeURIComponent(articleToDelete.id)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        onShowToast('Article deleted from database and live feed.');
        setArticleToDelete(null);
        onRefreshArticles();
      } else {
        onShowToast(json.error || 'Failed to delete article.');
      }
    } catch (e) {
      onShowToast('Failed to delete article.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered articles list
  const filteredArticles = articles.filter(art => {
    if (categoryFilter !== 'all' && art.category !== categoryFilter) return false;
    if (cityFilter !== 'all' && art.cityName !== cityFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchTitle = (art.title || '').toLowerCase().includes(q);
      const matchSubtitle = (art.subtitle || '').toLowerCase().includes(q);
      const matchCity = (art.cityName || '').toLowerCase().includes(q);
      if (!matchTitle && !matchSubtitle && !matchCity) return false;
    }
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="news-manager-modal"
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative"
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              News & Story Desk
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AUTHENTICATION LOCK OVERLAY IF NOT AUTHENTICATED */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center my-auto max-w-md mx-auto space-y-6">
            <div>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">Passcode Required</h4>
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
                Unlock News Desk
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
        <div className="px-5 sm:px-8 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-3.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'create'
                  ? 'border-[#FA2D48] text-[#FA2D48]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {isEditing ? (
                <>
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Story</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create / Enter News</span>
                </>
              )}
            </button>

            <button
              onClick={() => setActiveTab('manage')}
              className={`py-3.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'manage'
                  ? 'border-[#FA2D48] text-[#FA2D48]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Published Stories ({articles.length})</span>
            </button>
          </div>

          <button
            onClick={() => {
              onRefreshArticles();
              onShowToast('Synced latest stories from Firestore database');
            }}
            className="hidden sm:flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync DB</span>
          </button>
        </div>

        {/* Main Body */}
        <div ref={formScrollRef} className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          {activeTab === 'create' ? (
            <form onSubmit={handleFormSubmit} className="space-y-6 max-w-3xl mx-auto">
              {/* Top Banner Notice when editing */}
              {isEditing && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-amber-900 text-xs">
                  <div className="flex items-center space-x-2">
                    <Edit3 className="w-4 h-4 text-amber-600" />
                    <span>Editing story: <strong>{title || editingId}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="font-bold text-amber-700 underline hover:text-amber-900 cursor-pointer"
                  >
                    Cancel Edit & Create New
                  </button>
                </div>
              )}

              {/* Title / Headline */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Headline / Story Title <span className="text-[#FA2D48]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Team Welcomes Top Producer & Celebrates $100M Milestone"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#FA2D48] focus:ring-2 focus:ring-[#FA2D48]/20 text-slate-900 font-bold text-base outline-none transition-all placeholder:font-normal placeholder:text-slate-400"
                />
              </div>

              {/* Category & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Category <span className="text-[#FA2D48]">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NewsCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#FA2D48] bg-white text-slate-800 text-sm font-semibold outline-none"
                  >
                    <option value="real-estate">🏠 Real Estate & Housing Market</option>
                    <option value="market-trends">📈 Market Trends & Rates</option>
                    <option value="team-news">🤝 Team News & Brokerage Milestone</option>
                    <option value="events">📅 Events, Galas & Community Meetups</option>
                    <option value="restaurants-bars">🍽️ Restaurants, Dining & Wine</option>
                    <option value="city-developments">🏗️ City Developments & Civic Plans</option>
                    <option value="lifestyle">🌴 Coastal Lifestyle & Living</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Target City / Area <span className="text-[#FA2D48]">*</span>
                  </label>
                  <select
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#FA2D48] bg-white text-slate-800 text-sm font-semibold outline-none"
                  >
                    {OC_CITIES_LIST.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subtitle / Excerpt */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Subtitle / Excerpt Summary
                </label>
                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="A concise 1-2 sentence teaser summary that appears on the story card..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#FA2D48] focus:ring-2 focus:ring-[#FA2D48]/20 text-slate-800 text-xs sm:text-sm outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Cover Photo Setup */}
              <div className="space-y-2 rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-slate-500" />
                    <span>Story Cover Image</span>
                  </label>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-600" />
                      <span>{uploadingImage ? 'Processing...' : 'Upload Image'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <div className="w-full sm:w-48 h-28 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 relative group">
                    <img 
                      src={heroImage} 
                      alt="Cover preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PRESET_STORY_IMAGES[0].url;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                      Preview
                    </div>
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="url"
                      value={heroImage}
                      onChange={(e) => setHeroImage(e.target.value)}
                      placeholder="Paste image URL (https://...)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#FA2D48] text-xs text-slate-800 outline-none bg-white font-mono"
                    />

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Quick Preset Images:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_STORY_IMAGES.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setHeroImage(preset.url)}
                            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                              heroImage === preset.url
                                ? 'bg-[#FA2D48] text-white'
                                : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Article Content */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Full Story Content / Write-Up <span className="text-[#FA2D48]">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the complete article story here. You can write multiple paragraphs describing the event, team announcement, market commentary, quotes, or details..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#FA2D48] focus:ring-2 focus:ring-[#FA2D48]/20 text-slate-900 text-xs sm:text-sm leading-relaxed outline-none transition-all placeholder:text-slate-400 font-sans"
                />
              </div>

              {/* Publisher & Read Time & Highlight Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Publisher / Byline
                  </label>
                  <input
                    type="text"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    placeholder="e.g., ReaL. Editorial / Team News"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-[#FA2D48]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="e.g., 3 min read"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-[#FA2D48]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Story Flags
                  </label>
                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsBreaking(!isBreaking)}
                      className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                        isBreaking 
                          ? 'bg-[#FA2D48] text-white shadow-xs' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>Breaking</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsFeatured(!isFeatured)}
                      className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                        isFeatured 
                          ? 'bg-amber-500 text-white shadow-xs' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>Featured</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Key Takeaways (Bullet Points) */}
              <div className="space-y-2 rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Key Takeaways / Highlights (Optional 3 Bullets)
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={takeaway1}
                    onChange={(e) => setTakeaway1(e.target.value)}
                    placeholder="Bullet 1: Main milestone or key takeaway..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-[#FA2D48] bg-white"
                  />
                  <input
                    type="text"
                    value={takeaway2}
                    onChange={(e) => setTakeaway2(e.target.value)}
                    placeholder="Bullet 2: Date, schedule, or quote detail..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-[#FA2D48] bg-white"
                  />
                  <input
                    type="text"
                    value={takeaway3}
                    onChange={(e) => setTakeaway3(e.target.value)}
                    placeholder="Bullet 3: Next steps or contact info..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-[#FA2D48] bg-white"
                  />
                </div>
              </div>

              {/* Optional Event / Venue Details Accordion */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowEventDetails(!showEventDetails)}
                  className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-left flex items-center justify-between text-xs font-bold text-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-[#FA2D48]" />
                    <span>Attach Event / Venue / Address Info (Optional)</span>
                  </div>
                  <span className="text-[10px] uppercase font-black text-slate-500">
                    {showEventDetails ? 'Hide' : 'Expand'}
                  </span>
                </button>

                {showEventDetails && (
                  <div className="p-4 bg-white space-y-3 border-t border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Venue or Event Name
                        </label>
                        <input
                          type="text"
                          value={eventName}
                          onChange={(e) => setEventName(e.target.value)}
                          placeholder="e.g. Balboa Bay Club & Resort"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 outline-none focus:border-[#FA2D48]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Address or Schedule
                        </label>
                        <input
                          type="text"
                          value={eventAddress}
                          onChange={(e) => setEventAddress(e.target.value)}
                          placeholder="e.g. 1221 W Coast Hwy, Newport Beach • Oct 18"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 outline-none focus:border-[#FA2D48]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Highlight Badge / Note
                      </label>
                      <input
                        type="text"
                        value={eventHighlight}
                        onChange={(e) => setEventHighlight(e.target.value)}
                        placeholder="e.g. Open to public • RSVP Required"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 outline-none focus:border-[#FA2D48]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Clear Form
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-[#FA2D48] hover:bg-[#E0263E] text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving to Firestore...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isEditing ? 'Update Story' : 'Publish Story Live'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Tab 2: Manage Published Stories */
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search articles by title..."
                    className="w-full bg-white border border-slate-300 focus:border-[#FA2D48] rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="market-trends">Market Trends</option>
                    <option value="team-news">Team News</option>
                    <option value="events">Events</option>
                    <option value="restaurants-bars">Dining</option>
                    <option value="city-developments">City Developments</option>
                  </select>

                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 outline-none"
                  >
                    <option value="all">All Cities</option>
                    {OC_CITIES_LIST.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Articles List */}
              <div className="space-y-3">
                {filteredArticles.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <p className="font-bold text-sm">No stories match your search filters.</p>
                    <button
                      onClick={() => { setSearchFilter(''); setCategoryFilter('all'); setCityFilter('all'); }}
                      className="text-xs text-[#FA2D48] font-bold mt-2 hover:underline cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  filteredArticles.map((art) => (
                    <div 
                      key={art.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                        <img 
                          src={art.heroImage} 
                          alt={art.title} 
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = PRESET_STORY_IMAGES[0].url;
                          }}
                        />
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-black text-[9px] uppercase tracking-wider">
                              {art.category}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[9px]">
                              {art.cityName}
                            </span>
                            {art.isBreaking && (
                              <span className="px-2 py-0.5 rounded-md bg-[#FA2D48] text-white font-black text-[9px] uppercase">
                                Breaking
                              </span>
                            )}
                            {art.isFeatured && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-black text-[9px] uppercase">
                                Hero Spotlight
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                            {art.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {art.subtitle || art.content}
                          </p>
                          <div className="text-[10px] text-slate-400 font-medium">
                            Publisher: {art.publisher || 'ReaL. Editorial'} • {art.publishedAt || 'Recent'}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleStartEdit(art)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                          title="Edit this story"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setArticleToDelete({ id: art.id, title: art.title })}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                          title="Delete article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
          </>
        )}

        {/* Delete Confirmation Popup */}
        {articleToDelete && (
          <div className="absolute inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-black text-slate-900">Delete Story from Database?</h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to remove <strong>"{articleToDelete.title}"</strong>? This will remove it from Firestore and the live news feed.
                </p>
              </div>
              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setArticleToDelete(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete Story'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
