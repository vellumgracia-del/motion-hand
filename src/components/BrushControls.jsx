import { useState } from 'react';
import { Settings2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BrushControls({ brushSettings, setBrushSettings, activeMode }) {
  const [isOpen, setIsOpen] = useState(false);

  // Colors available in the palette
  const colors = [
    { hex: '#f43f5e', name: 'Rose' },
    { hex: '#8b5cf6', name: 'Violet' },
    { hex: '#6366f1', name: 'Indigo' },
    { hex: '#10b981', name: 'Emerald' },
    { hex: '#06b6d4', name: 'Cyan' },
    { hex: '#f8fafc', name: 'White' },
  ];

  // Only show when in drawing mode or hovering, avoid cluttering when system modes are active
  const shouldShow = activeMode !== 'WIPE MEMORY' && activeMode !== 'NO INPUT';

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-6 left-6 z-30"
        >
          <div className="relative">
            {/* Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-12 h-12 rounded-full bg-slate-800 border border-slate-600 shadow-lg flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isOpen ? <X size={20} /> : <Settings2 size={20} />}
            </button>

            {/* Panel */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, x: 0, y: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: 0, y: 10 }}
                  className="absolute bottom-16 left-0 panel p-5 w-72 flex flex-col gap-5"
                >
                  <div className="border-b border-slate-700 pb-2">
                    <h3 className="font-['Outfit'] font-semibold text-slate-200">Brush Settings</h3>
                    <p className="text-xs text-slate-400">Customize your 1-finger draw mode</p>
                  </div>

                  {/* Size Slider */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-300">Size</span>
                      <span className="text-slate-400 font-['JetBrains_Mono']">{brushSettings.size}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={brushSettings.size}
                      onChange={(e) => setBrushSettings({...brushSettings, size: parseInt(e.target.value)})}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  {/* Opacity Slider */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-300">Opacity</span>
                      <span className="text-slate-400 font-['JetBrains_Mono']">{Math.round(brushSettings.opacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={brushSettings.opacity}
                      onChange={(e) => setBrushSettings({...brushSettings, opacity: parseFloat(e.target.value)})}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  {/* Color Picker */}
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-slate-300">Color Palette</span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {colors.map((c) => (
                        <button
                          key={c.hex}
                          onClick={() => setBrushSettings({...brushSettings, color: c.hex})}
                          className={`w-8 h-8 rounded-full focus:outline-none transition-smooth ${
                            brushSettings.color === c.hex 
                              ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-indigo-500 scale-110' 
                              : 'hover:scale-110'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
