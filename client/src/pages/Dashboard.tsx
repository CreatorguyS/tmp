import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Brain,
  TrendingUp,
  Calendar,
  Download,
  Eye,
  Search,
  Filter,
  Plus,
  BarChart3,
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Share2,
  User,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock analysis history data
  const analysisHistory = [
    {
      id: "HAS_2025_001234",
      date: "2025-01-06",
      time: "14:30",
      documents: ["Blood Test Results.pdf", "Cholesterol Panel.pdf"],
      riskLevel: "Moderate",
      confidence: 94,
      status: "completed",
      keyFindings: ["Elevated cholesterol", "Normal glucose"],
      processingTime: "47s"
    },
    {
      id: "HAS_2025_001235",
      date: "2025-01-05",
      time: "09:15",
      documents: ["X-Ray Report.pdf"],
      riskLevel: "Low",
      confidence: 97,
      status: "completed",
      keyFindings: ["Clear chest X-ray", "No abnormalities"],
      processingTime: "31s"
    },
    {
      id: "HAS_2025_001236",
      date: "2025-01-03",
      time: "16:45",
      documents: ["Prescription.jpg", "Lab Results.pdf"],
      riskLevel: "High",
      confidence: 91,
      status: "completed",
      keyFindings: ["Blood pressure elevated", "Medication review needed"],
      processingTime: "52s"
    },
    {
      id: "HAS_2025_001237",
      date: "2025-01-02",
      time: "11:20",
      documents: ["MRI Scan.pdf"],
      riskLevel: "Low",
      confidence: 98,
      status: "completed",
      keyFindings: ["Normal brain imaging", "No lesions detected"],
      processingTime: "43s"
    }
  ];

  const stats = {
    totalAnalyses: analysisHistory.length,
    averageConfidence: Math.round(analysisHistory.reduce((sum, analysis) => sum + analysis.confidence, 0) / analysisHistory.length),
    documentsProcessed: analysisHistory.reduce((sum, analysis) => sum + analysis.documents.length, 0),
    lastAnalysis: analysisHistory[0]?.date
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low": return "text-green-400 bg-green-900/30 border-green-700";
      case "moderate": return "text-yellow-400 bg-yellow-900/30 border-yellow-700";
      case "high": return "text-red-400 bg-red-900/30 border-red-700";
      default: return "text-gray-400 bg-gray-900/30 border-gray-700";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low": return <CheckCircle className="w-4 h-4" />;
      case "moderate": return <AlertTriangle className="w-4 h-4" />;
      case "high": return <AlertTriangle className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const filteredAnalyses = analysisHistory.filter(analysis => {
    const matchesSearch = analysis.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         analysis.documents.some(doc => doc.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === "all" || analysis.riskLevel.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen cosmic-bg">
      <div className="absolute inset-0 stars-pattern opacity-30"></div>
      
      <Navbar />
      
      <main className="pt-8 relative z-10">
        <section className="py-12 md:py-20">
          <div className="medical-container">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h1 className="text-4xl font-bold text-medical-title">Medical Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Track your health analysis history and insights
                </p>
              </div>
              
              <Button 
                onClick={() => navigate('/upload')}
                className="btn-medical-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Analysis
              </Button>
            </motion.div>

            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
              <div className="card-medical p-6 border-l-4 border-l-blue-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Analyses</p>
                    <p className="text-2xl font-bold text-blue-400">{stats.totalAnalyses}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              
              <div className="card-medical p-6 border-l-4 border-l-green-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Confidence</p>
                    <p className="text-2xl font-bold text-green-400">{stats.averageConfidence}%</p>
                  </div>
                  <Brain className="w-8 h-8 text-green-400" />
                </div>
              </div>
              
              <div className="card-medical p-6 border-l-4 border-l-purple-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Documents</p>
                    <p className="text-2xl font-bold text-purple-400">{stats.documentsProcessed}</p>
                  </div>
                  <FileText className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              
              <div className="card-medical p-6 border-l-4 border-l-yellow-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Last Analysis</p>
                    <p className="text-2xl font-bold text-yellow-400">{stats.lastAnalysis}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row gap-4 mb-8"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search analyses or documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-background/50 border border-border/50 rounded-md text-foreground"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="moderate">Moderate Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>
            </motion.div>

            {/* Analysis History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-6">Analysis History</h2>
              
              {filteredAnalyses.length === 0 ? (
                <div className="card-medical text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No analyses found matching your criteria.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAnalyses.map((analysis, index) => (
                    <motion.div
                      key={analysis.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="card-medical p-6 hover:bg-muted/5 transition-colors cursor-pointer"
                      onClick={() => navigate('/results')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <h3 className="text-lg font-semibold text-foreground">
                              Analysis #{analysis.id.split('_').pop()}
                            </h3>
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs border ${getRiskColor(analysis.riskLevel)}`}>
                              {getRiskIcon(analysis.riskLevel)}
                              <span>{analysis.riskLevel} Risk</span>
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {analysis.confidence}% confidence
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Date & Time</p>
                              <p className="text-foreground">{analysis.date} at {analysis.time}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Documents Analyzed</p>
                              <p className="text-foreground">{analysis.documents.length} files</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Processing Time</p>
                              <p className="text-foreground">{analysis.processingTime}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-muted-foreground text-sm mb-1">Key Findings:</p>
                            <div className="flex flex-wrap gap-2">
                              {analysis.keyFindings.map((finding, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-accent/20 text-accent text-xs rounded"
                                >
                                  {finding}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-3 text-xs text-muted-foreground">
                            <strong>Documents:</strong> {analysis.documents.join(', ')}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/results');
                            }}
                            className="text-accent hover:bg-accent/10"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Download report functionality
                              const blob = new Blob([`Medical Analysis Report\nID: ${analysis.id}\nDate: ${analysis.date}\nRisk Level: ${analysis.riskLevel}`], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `HealthSpectrum_${analysis.id}.txt`;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Share functionality
                              navigator.clipboard.writeText(`HealthSpectrum Analysis ${analysis.id} - ${analysis.riskLevel} Risk Level`);
                              alert('Analysis summary copied to clipboard!');
                            }}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Health Trends Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-6">Health Trends</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card-medical">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Risk Level Trends</h3>
                  <div className="space-y-3">
                    {['Low', 'Moderate', 'High'].map(risk => {
                      const count = analysisHistory.filter(a => a.riskLevel === risk).length;
                      const percentage = Math.round((count / analysisHistory.length) * 100);
                      return (
                        <div key={risk} className="flex items-center justify-between">
                          <span className="text-foreground">{risk} Risk</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  risk === 'Low' ? 'bg-green-400' :
                                  risk === 'Moderate' ? 'bg-yellow-400' : 'bg-red-400'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-12">{percentage}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="card-medical">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {analysisHistory.slice(0, 3).map((analysis, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          analysis.riskLevel === 'Low' ? 'bg-green-400' :
                          analysis.riskLevel === 'Moderate' ? 'bg-yellow-400' : 'bg-red-400'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-foreground">
                            Analysis completed - {analysis.riskLevel} risk
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {analysis.date} at {analysis.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;