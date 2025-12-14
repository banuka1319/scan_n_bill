import React from 'react';
import { X, FileText } from 'lucide-react';

interface ReceiptViewerProps {
  imageSrc: string;
  onRemove: () => void;
}

const ReceiptViewer: React.FC<ReceiptViewerProps> = ({ imageSrc, onRemove }) => {
  const isPdf = imageSrc.startsWith('data:application/pdf');

  return (
    <div className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
      <div className="aspect-[3/4] w-full relative bg-slate-100 flex items-center justify-center overflow-hidden">
        {isPdf ? (
             <div className="w-full h-full flex flex-col items-center justify-center p-4">
                 <iframe 
                    src={`${imageSrc}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full pointer-events-none border-none" 
                    title="PDF Preview"
                />
                 {/* Overlay to prevent interaction stealing on mobile scrolling if iframe is used, or just to indicate it's a preview */}
                 <div className="absolute inset-0 bg-transparent" />
             </div>
        ) : (
            <img 
                src={imageSrc} 
                alt="Receipt" 
                className="object-contain w-full h-full max-h-[600px]" 
            />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
      </div>
      
      <button 
        onClick={onRemove}
        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-slate-200 text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors z-10"
        title="Remove file"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="absolute bottom-2 left-2 right-2 pointer-events-none">
         <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-slate-600 shadow-sm text-center border border-slate-100 flex items-center justify-center gap-2">
            {isPdf ? <FileText className="w-3 h-3" /> : null}
            {isPdf ? "PDF Document" : "Original Receipt"}
         </div>
      </div>
    </div>
  );
};

export default ReceiptViewer;