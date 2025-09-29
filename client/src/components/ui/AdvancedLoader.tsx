import { LoaderCircle } from "lucide-react";

interface AdvancedLoaderProps {
  message?: string;
  fullScreen?: boolean;
  compact?: boolean;
}

export function AdvancedLoader({ message, fullScreen, compact }: AdvancedLoaderProps) {
  return (
    <div className={`${fullScreen ? 'h-screen' : ''} w-full flex items-center justify-center`}> 
      <div className={`relative ${compact ? 'p-2' : 'p-6'} rounded-2xl`}>
        <div className="relative flex items-center justify-center">
          <div className={`absolute rounded-full blur-xl opacity-30 ${compact ? 'w-16 h-16' : 'w-40 h-40'} bg-gradient-to-tr from-violet to-pink animate-pulse`}></div>
          <div className={`absolute ${compact ? 'w-16 h-16' : 'w-40 h-40'} rounded-full border-2 border-violet/20`}></div>
          <div className={`absolute ${compact ? 'w-16 h-16' : 'w-40 h-40'} rounded-full border-2 border-pink/20 animate-spin [animation-duration:2.2s]`}></div>
          <LoaderCircle className={`${compact ? 'w-6 h-6' : 'w-10 h-10'} animate-spin text-violet relative`} />
        </div>
        {message && (
          <p className={`text-center mt-4 ${compact ? 'text-xs' : 'text-sm'} text-gray-600`}>{message}</p>
        )}
      </div>
    </div>
  );
}


