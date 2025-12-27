import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('Initializing kernel...');

  useEffect(() => {
    const tasks = [
      'Loading move validator...',
      'Booting Minimax engine...',
      'Evaluating board heuristics...',
      'Opening socket 0.0.0.0:8080...',
      'READY.'
    ];

    let taskIdx = 0;
    const interval = setInterval(() => {
      setLoadingProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 500);
          return 100;
        }
        if (p % 20 === 0 && taskIdx < tasks.length) {
          setCurrentTask(tasks[taskIdx++]);
        }
        return p + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 p-8 cursor-pointer" onClick={onFinish}>
      <div className="max-w-2xl w-full space-y-8 animate-pulse-slow">
        <div className="text-emerald-500 font-mono text-center leading-tight">
          <pre className="text-[8px] sm:text-xs mb-8 inline-block text-left opacity-80">
{`   _____ _          _ _  _____ _                      
  / ____| |        | | |/ ____| |                     
 | (___ | |__   ___| | | |    | |__   ___  ___ ___    
  \\___ \\| '_ \\ / _ \\ | | |    | '_ \\ / _ \\/ __/ __|   
  ____) | | | |  __/ | | |____| | | |  __/\\__ \\__ \\   
 |_____/|_| |_|\\___|_|_|\\_____|_| |_|\\___||___/___/   
                                                       `}
          </pre>
          <h1 className="text-3xl font-black tracking-widest uppercase mb-2">ShellChess Pro</h1>
          <p className="text-slate-500 text-sm tracking-[0.3em]">Think. Plan. Checkmate.</p>
        </div>

        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="bg-emerald-500 h-full transition-all duration-100 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>

        <div className="flex justify-between items-center mono text-[10px]">
          <span className="text-emerald-500/70">{currentTask}</span>
          <span className="text-slate-600">[{loadingProgress}%]</span>
        </div>

        <div className="pt-12 text-center">
          <span className="text-slate-700 text-[10px] animate-bounce mono">PRESS ANY KEY TO SKIP</span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;