import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import FileUploader from './components/FileUploader';
import ReceiptViewer from './components/ReceiptViewer';
import DataSheet from './components/DataSheet';
import { extractReceiptData } from './services/geminiService';
import { ReceiptData, AppState } from './types';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auth Effect
  useEffect(() => {
    const storedEmail = localStorage.getItem('billscanner_user_email');
    if (storedEmail) {
        setUserEmail(storedEmail);
    }
  }, []);

  const handleLogin = (email: string) => {
    localStorage.setItem('billscanner_user_email', email);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('billscanner_user_email');
    setUserEmail(null);
    handleRemoveFile();
  };

  const handleFileSelect = (selectedFile: File) => {
    setReceiptData(null);
    setError(null);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
    setFile(selectedFile);
    
    setAppState(AppState.PROCESSING);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setImagePreview(null);
    setReceiptData(null);
    setAppState(AppState.IDLE);
    setError(null);
  };

  useEffect(() => {
    if (appState === AppState.PROCESSING && file && imagePreview) {
      const processImage = async () => {
        try {
          const base64Data = imagePreview.split(',')[1];
          const mimeType = file.type;

          const data = await extractReceiptData(base64Data, mimeType);
          setReceiptData(data);
          setAppState(AppState.SUCCESS);
        } catch (err: any) {
          console.error(err);
          setError(err.message || "Failed to extract data. Please try a clearer image.");
          setAppState(AppState.ERROR);
        }
      };

      processImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState, file, imagePreview]);

  // If not logged in, show Login Screen
  if (!userEmail) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-6">
      <Header userEmail={userEmail} onLogout={handleLogout} />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 py-6">
        
        {/* Intro / Hero - Only show if no file selected */}
        {!file && (
          <div className="text-center mb-8 mt-4 space-y-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back!
            </h1>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              Ready to digitize your expenses? Scan a new bill to get started.
            </p>
          </div>
        )}

        {/* Upload Section */}
        {!file && (
            <div className="mb-8">
                <FileUploader onFileSelect={handleFileSelect} isLoading={false} />
            </div>
        )}

        {/* Main Content Area */}
        {file && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Image Viewer */}
            <div className="lg:col-span-4 order-2 lg:order-1">
               <div className="lg:sticky lg:top-24">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 hidden lg:block">
                    Source
                  </h3>
                  {imagePreview && (
                    <ReceiptViewer imageSrc={imagePreview} onRemove={handleRemoveFile} />
                  )}
               </div>
            </div>

            {/* Results Area */}
            <div className="lg:col-span-8 order-1 lg:order-2">
                
                {/* Processing State */}
                {appState === AppState.PROCESSING && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                            <div className="relative bg-white p-3 rounded-full shadow-sm border border-slate-100">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-slate-800">Reading Receipt...</h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Hang tight, we are extracting the numbers.
                        </p>
                    </div>
                )}

                {/* Error State */}
                {appState === AppState.ERROR && (
                    <div className="bg-red-50 rounded-2xl border border-red-200 p-6 text-center">
                        <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <h3 className="text-base font-semibold text-red-900 mb-1">Extraction Failed</h3>
                        <p className="text-sm text-red-700 mb-4">{error}</p>
                        <button 
                            onClick={handleRemoveFile}
                            className="w-full py-3 bg-white border border-red-300 text-red-700 rounded-xl hover:bg-red-50 font-medium transition-colors text-sm"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Success State - Results */}
                {appState === AppState.SUCCESS && receiptData && (
                    <div className="animate-fade-in-up">
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-4 flex items-center text-emerald-800 text-xs font-medium">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Success! Check your data below.
                        </div>
                        <DataSheet data={receiptData} />
                        
                        {/* Mobile 'Scan Another' button at the bottom */}
                         <div className="mt-8 pt-6 border-t border-slate-200 text-center lg:hidden">
                            <button 
                                onClick={handleRemoveFile}
                                className="text-blue-600 font-medium text-sm hover:underline"
                            >
                                Scan another bill
                            </button>
                         </div>
                    </div>
                )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;