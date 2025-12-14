import React, { useCallback, useRef, useState } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, FileText } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  }, [onFileSelect]);

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      <div
        className={`relative group rounded-3xl border-2 border-dashed transition-all duration-300 ease-in-out py-12 px-6 flex flex-col items-center justify-center text-center cursor-pointer touch-manipulation
          ${dragActive 
            ? "border-blue-500 bg-blue-50" 
            : "border-slate-300 bg-white active:bg-slate-50 active:border-blue-400"
          }
          ${isLoading ? "opacity-50 pointer-events-none grayscale" : ""}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*,application/pdf"
          onChange={handleChange}
        />
        
        <div className="bg-blue-100 p-4 rounded-full mb-6 group-active:scale-95 transition-transform duration-200">
          <UploadCloud className="w-8 h-8 text-blue-600" />
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Tap to Scan Bill
        </h3>
        <p className="text-slate-500 mb-8 max-w-xs text-sm">
          Upload an image or PDF. We'll extract the data automatically.
        </p>
        
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center justify-center text-sm">
                <FileText className="w-4 h-4 mr-2" />
                Upload File
            </button>
             {/* Mobile-first Camera Input */}
             <div className="relative overflow-hidden flex-1">
                <button className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl font-semibold shadow-md hover:bg-slate-800 transition-colors flex items-center justify-center text-sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Camera
                </button>
                <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
                    onChange={handleChange}
                    onClick={(e) => e.stopPropagation()} 
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;