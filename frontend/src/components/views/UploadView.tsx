import React from 'react';
import { Upload, FileText, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { useDropzone } from 'react-dropzone';

interface UploadViewProps {
  files: File[];
  setFiles: (files: File[]) => void;
  isUploading: boolean;
  handleUploadSubmit: () => void;
}

export default function UploadView({
  files,
  setFiles,
  isUploading,
  handleUploadSubmit
}: UploadViewProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
    },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    }
  });

  return (
    <div className="flex-1 p-12 flex flex-col items-center justify-center text-center animate-in slide-in-from-bottom-4 duration-500">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-primary/30 text-primary mb-6 animate-float">
        <Sparkles className="w-4 h-4" />
        <span className="text-xs font-semibold tracking-wide uppercase">AI-Powered Analysis</span>
      </div>
      <h2 className="text-4xl font-bold mb-4 tracking-tight text-white">Upload your dataset</h2>
      <p className="text-muted-foreground mb-10 max-w-lg text-lg">
        Upload CSV files to begin. Nexus AI will automatically analyze the structure, detect anomalies, and prepare actionable insights.
      </p>
      
      <div 
        {...getRootProps()} 
        className={clsx(
          "w-full max-w-2xl h-72 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden group",
          isDragActive ? "border-primary bg-primary/10 scale-105" : "border-white/20 glass hover:border-primary/50 hover:bg-white/5"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <input {...getInputProps()} />
        <div className="w-16 h-16 rounded-full glass flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <p className="font-semibold text-lg text-white">
          {isDragActive ? "Drop the files here" : "Drag & drop files here"}
        </p>
        <p className="text-sm text-muted-foreground mt-2 font-medium">or click to browse from your computer</p>
      </div>

      {files.length > 0 && (
        <div className="w-full max-w-2xl mt-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Selected Files</h4>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">{files.length} file(s)</span>
          </div>
          <div className="space-y-3">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between p-4 glass border border-white/10 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{f.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-end">
            <button 
              onClick={handleUploadSubmit}
              disabled={isUploading}
              className="bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-3 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] disabled:opacity-50 transition-all duration-300 hover:scale-105"
            >
              {isUploading ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <>Analyze Dataset <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
