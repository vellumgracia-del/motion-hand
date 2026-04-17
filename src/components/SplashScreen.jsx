import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0f172a] text-slate-50"
        >
          <div className="flex flex-col items-center gap-6 max-w-sm w-full mx-4">
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2 text-indigo-400 font-['Outfit']">
                Z11
              </h1>
              <h2 className="text-lg text-slate-400 font-['Inter'] tracking-wider uppercase">
                Air Canvas System
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-full"
            >
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-1/2"
                />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-sm text-slate-500 font-['JetBrains_Mono'] uppercase tracking-widest mt-4"
            >
              Initializing Neural Network...
            </motion.p>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
