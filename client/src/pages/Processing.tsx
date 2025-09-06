import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FileText, 
  Eye, 
  CheckCircle,
  Clock,
  Zap,
  Brain,
  Search,
  X,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

const Processing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('uploaded');
  const [etaSeconds, setEtaSeconds] = useState(0);
  const [ocrText, setOcrText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const stages = [
    { key: 'uploaded', label: 'Uploading', icon: FileText, color: 'blue' },
    { key: 'ocr', label: 'OCR Scanning', icon: Eye, color: 'purple' },
    { key: 'nlp', label: 'AI Analysis', icon: Brain, color: 'green' },
    { key: 'summary', label: 'Generating Summary', icon: Search, color: 'orange' },
    { key: 'done', label: 'Complete', icon: CheckCircle, color: 'green' }
  ];

  useEffect(() => {
    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/documents/${id}/status`, {
          credentials: 'include'
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch status');
        }

        const data = await response.json();
        setStatus(data.status);
        setEtaSeconds(data.stageETASeconds || 0);

        if (data.status === 'done') {
          // Processing complete, redirect to results
          setTimeout(() => navigate(`/results/${id}`), 1000);
        } else if (data.status === 'failed') {
          setError('Processing failed. Please try again.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check status');
      }
    };

    // Initial poll
    pollStatus();

    // Poll every 2 seconds if not done or failed
    const interval = setInterval(() => {
      if (status !== 'done' && status !== 'failed') {
        pollStatus();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [id, navigate, status]);

  useEffect(() => {
    // Try to fetch OCR text when OCR stage is complete
    const fetchOcrText = async () => {
      if (status === 'nlp' || status === 'summary' || status === 'done') {
        try {
          const response = await fetch(`/api/documents/${id}/ocrText`, {
            credentials: 'include'
          });
          
          if (response.ok) {
            const data = await response.json();
            setOcrText(data.ocrText);
          }
        } catch (err) {
          // OCR text might not be available yet
        }
      }
    };

    fetchOcrText();
  }, [status, id]);

  const getCurrentStageIndex = () => {
    return stages.findIndex(stage => stage.key === status);
  };

  const handleCancel = async () => {
    try {
      await fetch(`/api/documents/${id}/cancel`, {
        method: 'POST',
        credentials: 'include'
      });
      navigate('/upload');
    } catch (err) {
      console.error('Failed to cancel processing:', err);
    }
  };

  const handleRetry = async () => {
    try {
      await fetch(`/api/documents/${id}/retry`, {
        method: 'POST',
        credentials: 'include'
      });
      setError(null);
      setStatus('uploaded');
    } catch (err) {
      console.error('Failed to retry processing:', err);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-white rounded-lg shadow-lg p-8">
            <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Failed</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex space-x-4 justify-center">
              <Button onClick={handleRetry} className="btn-medical-primary">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
              <Button onClick={() => navigate('/upload')} variant="outline">
                Upload New Document
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Processing Your Document</h1>
            <p className="text-gray-600">Our AI is analyzing your medical document for insights</p>
          </div>

          {/* Progress Stepper */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-8">
              {stages.map((stage, index) => {
                const isActive = getCurrentStageIndex() === index;
                const isCompleted = getCurrentStageIndex() > index;
                const IconComponent = stage.icon;
                
                return (
                  <div key={stage.key} className="flex flex-col items-center flex-1">
                    <div className={`relative flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isActive 
                          ? `bg-${stage.color}-500 text-white animate-pulse`
                          : 'bg-gray-200 text-gray-400'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                      {isActive && (
                        <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping"></div>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      isCompleted || isActive ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {stage.label}
                    </span>
                    {isActive && etaSeconds > 0 && (
                      <span className="text-xs text-gray-500 mt-1">
                        ~{etaSeconds}s remaining
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(getCurrentStageIndex() / (stages.length - 1)) * 100}%` }}
              ></div>
            </div>

            {/* Current Stage Info */}
            <div className="text-center mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {stages[getCurrentStageIndex()]?.label}
              </h3>
              <p className="text-gray-600">
                {status === 'uploaded' && 'Preparing your document for analysis...'}
                {status === 'ocr' && 'Extracting text and data from your document...'}
                {status === 'nlp' && 'Analyzing medical content with AI...'}
                {status === 'summary' && 'Generating comprehensive health insights...'}
                {status === 'done' && 'Analysis complete! Redirecting to results...'}
              </p>
            </div>
          </div>

          {/* OCR Preview */}
          {ocrText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-blue-500" />
                Document Text Preview
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {ocrText.length > 1000 ? `${ocrText.substring(0, 1000)}...` : ocrText}
                </pre>
              </div>
              {ocrText.length > 1000 && (
                <p className="text-sm text-gray-500 mt-2">
                  Showing first 1000 characters. Full text will be available in results.
                </p>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={handleCancel}
              variant="outline"
              disabled={status === 'done'}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel Processing
            </Button>
          </div>

          {/* ETA Display */}
          {etaSeconds > 0 && (
            <div className="text-center mt-6">
              <div className="inline-flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                Estimated time remaining: {etaSeconds} seconds
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Processing;