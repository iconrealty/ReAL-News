import React, { useState } from 'react';
import { CityInfo } from '../types';
import { CITIES } from '../data/mockNews';
import { Search, X } from 'lucide-react';

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
  const [filterQuery, setFilterQuery] = useState('');
  const [customCityInput, setCustomCityInput] = useState('');

  if (!isOpen) return null;

  const filteredCities = CITIES.filter(c => 
    c.name.toLowerCase().includes(filterQuery.toLowerCase().trim())
  );

  const handleCustomCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCityInput.trim()) return;

    const newCity: CityInfo = {
      id: customCityInput.toLowerCase().replace(/\s+/g, '-'),
      name: customCityInput.trim(),
      state: 'CA',
      avgSqftPrice: '$680 sqft',
      tagline: `Local Housing Trends in ${customCityInput}`,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    };

    onSelectCity(newCity);
    setCustomCityInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200/90 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-0 sm:my-8 text-slate-900 max-h-[88vh] flex flex-col font-sans">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-white space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-serif tracking-tight text-slate-950">
                Select Location
              </h2>
              <p className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase mt-0.5">
                Orange County, CA
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Instant Filter Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search Orange County cities..."
              className="w-full bg-[#F2F2F7] focus:bg-white border border-slate-200/80 focus:border-[#FA2D48] rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all"
            />
          </div>
        </div>

        {/* Modal Body - City Grid */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto bg-slate-50/50">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredCities.map((city) => {
              const isSelected = currentCity.id === city.id;
              return (
                <button
                  key={city.id}
                  onClick={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                  className={`group relative overflow-hidden rounded-xl p-3.5 text-left transition-all duration-150 cursor-pointer flex items-center justify-between border ${
                    isSelected
                      ? 'bg-rose-50/90 border-2 border-[#FA2D48] ring-1 ring-rose-200 shadow-xs'
                      : 'bg-white hover:bg-slate-100/80 border-slate-200/80'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-base sm:text-lg font-bold font-serif tracking-tight text-slate-950">
                      {city.name}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FA2D48] shadow-xs shrink-0 ml-2" />
                  )}
                </button>
              );
            })}

            {filteredCities.length === 0 && (
              <div className="col-span-full text-center py-8 text-slate-400 text-sm font-sans font-medium">
                No cities matching "{filterQuery}"
              </div>
            )}
          </div>

          {/* Custom City Form */}
          <div className="border-t border-slate-200/80 pt-4">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">
              Add Custom Location
            </h3>
            <form onSubmit={handleCustomCitySubmit} className="flex gap-2">
              <input
                type="text"
                value={customCityInput}
                onChange={(e) => setCustomCityInput(e.target.value)}
                placeholder="Enter city name..."
                className="flex-1 bg-[#F2F2F7] focus:bg-white border border-slate-200/80 focus:border-[#FA2D48] rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shrink-0 cursor-pointer transition-all active:scale-95"
              >
                Add
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
