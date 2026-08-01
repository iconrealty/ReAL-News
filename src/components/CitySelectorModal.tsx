import React, { useState } from 'react';
import { CityInfo } from '../types';
import { CITIES } from '../data/mockNews';
import { MapPin, Plus, Check, X, Building2 } from 'lucide-react';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: CityInfo;
  onSelectCity: (city: CityInfo) => void;
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  isOpen,
  onClose,
  currentCity,
  onSelectCity,
}) => {
  const [customCityInput, setCustomCityInput] = useState('');

  if (!isOpen) return null;

  const handleCustomCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCityInput.trim()) return;

    const newCity: CityInfo = {
      id: customCityInput.toLowerCase().replace(/\s+/g, '-'),
      name: customCityInput.trim(),
      state: 'US',
      tagline: `Local Housing Trends, Dining & City Pulse in ${customCityInput}`,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    };

    onSelectCity(newCity);
    setCustomCityInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-0 sm:my-8 text-slate-900 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-rose-50 text-[#FA2D48] border border-rose-200">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-serif">
                Select Your City Edition
              </h2>
              <p className="text-xs text-slate-500">
                Switch city channels to explore targeted real estate, dining openings, and urban updates.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Preset Major Cities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {CITIES.map((city) => {
              const isSelected = currentCity.id === city.id;
              return (
                <button
                  key={city.id}
                  onClick={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                  className={`group relative overflow-hidden rounded-2xl p-4 text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-50/80 border-[#FA2D48] ring-2 ring-rose-300'
                      : 'bg-[#F8F8FC] hover:bg-slate-100 border-slate-200/90'
                  }`}
                >
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-slate-900 font-serif">{city.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#FA2D48] border border-slate-200 font-bold">
                          {city.state}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {city.tagline}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="p-1 rounded-full bg-[#FA2D48] text-white shadow-xs shrink-0 ml-2">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom City Form */}
          <div className="border-t border-slate-200 pt-5">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
              <Building2 className="w-3.5 h-3.5 text-[#FA2D48]" />
              <span>Or Type Any City Worldwide</span>
            </h3>
            <form onSubmit={handleCustomCitySubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={customCityInput}
                  onChange={(e) => setCustomCityInput(e.target.value)}
                  placeholder="e.g. Seattle, Dallas, Chicago, San Diego..."
                  className="w-full bg-[#EBEBEF] focus:bg-white border border-transparent focus:border-[#FA2D48] rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#FA2D48] hover:bg-[#E0263E] text-white font-bold text-xs flex items-center space-x-1 shrink-0 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add City</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
