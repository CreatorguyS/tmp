import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FileText, 
  Share2, 
  Download, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Activity,
  TrendingUp,
  Calendar,
  Pill,
  Heart,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

interface Entity {
  type: 'medication' | 'symptom' | 'date' | 'lab' | 'condition';
  value: string;
  confidence: number;
}

interface Condition {
  name: string;
  confidence: number;
}

interface TimelineItem {
  dateOrEstimate: string;
  evidenceSnippet: string;
  page?: number;
}

interface RiskAssessment {
  risk: string;
  severity: 'low' | 'moderate' | 'high';
  consequence: string;
}

interface EvidenceHighlight {
  quote: string;
  page: number;
  bbox?: number[];
}

interface Recommendation {
  text: string;
  urgency: 'normal' | 'soon' | 'urgent';
}

interface Analysis {
  documentId: string;
  ocrText: string;
  entities: Entity[];
  conditions: Condition[];
  healthScore: number;
  timeline: TimelineItem[];
  clinicalContext: string;
  riskAssessment: RiskAssessment[];
  evidenceHighlights: EvidenceHighlight[];
  recommendations: Recommendation[];
}

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRawOCR, setShowRawOCR] = useState(false);

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const fetchAnalysis = async () => {
    try {
      const response = await fetch(`/api/documents/${id}/analysis`, {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch analysis');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'normal': return 'text-green-600 bg-green-100';
      case 'soon': return 'text-yellow-600 bg-yellow-100';
      case 'urgent': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'normal': return '🟢';
      case 'soon': return '🟡';
      case 'urgent': return '🔴';
      default: return '⚪';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analysis results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Analysis Not Available</h2>
            <p className="text-gray-600 mb-4">{error || 'Analysis results not found'}</p>
            <Button onClick={() => navigate('/upload')} className="btn-medical-primary">
              Upload New Document
            </Button>
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
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis Results</h1>
            <p className="text-gray-600">Comprehensive health insights from your medical document</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* Detected Conditions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    Detected Conditions
                  </h2>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Overall Health Score</p>
                    <p className={`text-2xl font-bold ${getHealthScoreColor(analysis.healthScore)}`}>
                      {analysis.healthScore}/100
                    </p>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {analysis.conditions.map((condition, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-1">{condition.name}</h3>
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${condition.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {Math.round(condition.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Timeline Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                  Timeline Analysis
                </h2>
                
                <div className="space-y-4">
                  {analysis.timeline.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.dateOrEstimate}</p>
                        <p className="text-gray-600">{item.evidenceSnippet}</p>
                        {item.page && (
                          <p className="text-sm text-gray-500 mt-1">Page {item.page}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Clinical Context */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-green-500" />
                  Clinical Context
                </h2>
                <p className="text-gray-700 leading-relaxed">{analysis.clinicalContext}</p>
              </motion.div>

              {/* Risk Assessment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                  Risk Assessment
                </h2>
                
                <div className="space-y-4">
                  {analysis.riskAssessment.map((risk, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{risk.risk}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(risk.severity)}`}>
                          {risk.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600">{risk.consequence}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Evidence Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-purple-500" />
                  Evidence Highlights
                </h2>
                
                <div className="space-y-3">
                  {analysis.evidenceHighlights.map((highlight, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <p className="text-gray-900 italic">"{highlight.quote}"</p>
                      <p className="text-sm text-gray-500 mt-1">Page {highlight.page}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Recommendations
                </h2>
                
                <div className="space-y-4">
                  {analysis.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="text-lg">{getUrgencyIcon(recommendation.urgency)}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(recommendation.urgency)}`}>
                            {recommendation.urgency.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-700">{recommendation.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* OCR Text Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Raw Document Text</h2>
                  <Button
                    onClick={() => setShowRawOCR(!showRawOCR)}
                    variant="outline"
                  >
                    {showRawOCR ? 'Hide' : 'Show'} Raw Text
                  </Button>
                </div>
                
                {showRawOCR && (
                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                      {analysis.ocrText}
                    </pre>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                
                {/* Entity Chips */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Pill className="w-4 h-4 mr-2 text-blue-500" />
                    Key Entities
                  </h3>
                  
                  <div className="space-y-3">
                    {['medication', 'condition', 'lab', 'symptom', 'date'].map(type => {
                      const entities = analysis.entities.filter(e => e.type === type);
                      if (entities.length === 0) return null;
                      
                      return (
                        <div key={type}>
                          <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                            {type}s
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {entities.map((entity, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {entity.value}
                                <span className="ml-1 text-blue-600">
                                  {Math.round(entity.confidence * 100)}%
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                  
                  <div className="space-y-3">
                    <Button 
                      onClick={() => navigate(`/viewer/${id}`)}
                      className="w-full btn-medical-primary"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Open Viewer
                    </Button>
                    
                    <Button 
                      onClick={() => window.open(`/api/documents/export/pdf/${id}`, '_blank')}
                      variant="outline" 
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                    
                    <Button 
                      onClick={async () => {
                        try {
                          const response = await fetch(`/api/documents/share/${id}`, {
                            method: 'POST',
                            credentials: 'include'
                          });
                          const data = await response.json();
                          navigator.clipboard.writeText(data.shareUrl);
                          alert('Share link copied to clipboard!');
                        } catch (err) {
                          alert('Failed to create share link');
                        }
                      }}
                      variant="outline" 
                      className="w-full"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Secure Link
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;