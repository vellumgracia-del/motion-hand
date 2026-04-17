import { motion } from 'framer-motion';

export default function ToolLegend({ currentModeName }) {
  const legendItems = [
    { count: 1, label: "Draw (Rose)", color: "#f43f5e", mode: "DRAWING" },
    { count: 2, label: "HUD (Emerald)", color: "#10b981", mode: "HUD MODE" },
    { count: 3, label: "Arc (Cyan)", color: "#06b6d4", mode: "ARC MODE" },
    { count: 5, label: "Wipe Canvas", color: "#f8fafc", mode: "WIPE MEMORY" },
  ];

  return (
    <div className="absolute top-6 right-6 z-30 pointer-events-none">
      <div className="panel p-4 flex flex-col gap-3">
        <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase mb-1">
          Gesture Guide
        </span>
        
        <div className="flex flex-col gap-2.5">
          {legendItems.map((item) => {
            const isActive = currentModeName === item.mode;
            
            return (
              <div 
                key={item.count} 
                className={`flex items-center justify-between gap-6 px-3 py-2 rounded-md transition-smooth ${
                  isActive ? 'bg-slate-700/80 shadow-md transform scale-[1.02]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 flex items-center justify-center rounded text-xs font-bold font-['JetBrains_Mono'] ${
                    isActive ? 'bg-slate-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.count}
                  </span>
                  <span className={`text-sm font-medium ${isActive ? 'text-slate-100' : 'text-slate-400'}`}>
                    {item.label}
                  </span>
                </div>
                
                <div 
                  className={`w-3 h-3 rounded-full ${isActive ? 'shadow-sm' : ''}`}
                  style={{ 
                    backgroundColor: item.color,
                    opacity: isActive ? 1 : 0.4
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
