import { motion, AnimatePresence } from 'framer-motion';
import { Pen, Layout, Circle, Trash2, MousePointer, HelpCircle, Hand } from 'lucide-react';

// Map icon names to Lucide components
const IconMap = {
  'pen': Pen,
  'layout': Layout,
  'circle': Circle,
  'trash': Trash2,
  'mouse-pointer': MousePointer,
  'help': HelpCircle,
  'hand': Hand
};

export default function HudOverlay({ modeData, fingerCount }) {
  const IconComponent = IconMap[modeData.icon] || HelpCircle;

  return (
    <div className="absolute top-6 left-6 z-30 flex flex-col gap-4 pointer-events-none">
      
      {/* Status Panel */}
      <motion.div 
        layout
        className="panel py-3 px-5 flex flex-col gap-1 min-w-[200px]"
      >
        <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase font-['Inter']">
          System Status
        </span>
        
        <div className="flex items-center gap-3 mt-1">
          <motion.div 
            key={modeData.name}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-8 h-8 rounded-md flex items-center justify-center bg-slate-700/50"
            style={{ color: modeData.color }}
          >
            <IconComponent size={18} strokeWidth={2.5} />
          </motion.div>
          
          <motion.span 
            key={modeData.name + "-text"}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-lg font-bold font-['Outfit'] tracking-wide"
            style={{ color: modeData.color }}
          >
            {modeData.name}
          </motion.span>
        </div>
      </motion.div>

      {/* Info Badge */}
      <motion.div 
        layout
        className="panel py-2 px-4 flex items-center gap-3 self-start"
      >
        <span className="text-xs text-slate-400 font-medium font-['Inter']">FINGERS DETECTED</span>
        <div className="flex items-center justify-center bg-indigo-500/20 text-indigo-400 rounded px-2.5 py-0.5 font-['JetBrains_Mono'] font-bold">
          {fingerCount}
        </div>
      </motion.div>

    </div>
  );
}
