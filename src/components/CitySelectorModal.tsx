import React, { useState } from 'react';
import { CityInfo } from '../types';
import { CITIES } from '../data/mockNews';

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
      state: 'CA',
      avgSqftPrice: '$680 / sqft',
      tagline: `Local Housing Trends in ${customCityInput}`,
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
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-black font-serif">
              Select Your City
            </h2>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-black font-bold text-sm transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Preset Orange County Cities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      ? 'bg-rose-50 border-2 border-[#FA2D48] ring-2 ring-rose-300 shadow-sm'
                      : 'bg-[#F8F8FC] hover:bg-slate-100 border-slate-300'
                  }`}
                >
                  <div className="flex flex-col justify-between">
                    <span className="text-xl sm:text-2xl font-black text-black font-serif">
                      {city.name}
                    </span>
                    <p className="text-base sm:text-lg font-bold text-[#FA2D48] font-mono mt-1">
                      Avg. {city.avgSqftPrice}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom City Form */}
          <div className="border-t border-slate-200 pt-5">
            <h3 className="text-sm sm:text-base font-black text-black uppercase tracking-wider mb-2 font-mono">
              Or Type Any City
            </h3>
            <form onSubmit={handleCustomCitySubmit} className="flex gap-2">
              <input
                type="text"
                value={customCityInput}
                onChange={(e) => setCustomCityInput(e.target.value)}
                placeholder="Type any city..."
                className="flex-1 bg-[#EBEBEF] focus:bg-white border border-slate-300 focus:border-[#FA2D48] rounded-xl px-4 py-3 text-sm sm:text-base text-black font-bold placeholder-slate-400 outline-none transition-all"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-[#FA2D48] hover:bg-[#E0263E] text-white font-black text-sm sm:text-base shrink-0 cursor-pointer shadow-xs active:scale-95 transition-all"
              >
                Add City
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
