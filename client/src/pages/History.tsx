import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Search,
  Filter,
  Calendar,
  FileText,
  Eye,
  Download,
  Share2,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

interface Document {
  _id: string;
  originalName: string;
  status: string;
  createdAt: string;
  size: number;
  mimeType: string;
}

const History = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateeTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);

  useEffect(() => {
    fetchHistory();
  }, [currentPage, searchTerm, statusFilter, dateFrom, dateTo]);

  const fetchHistory = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (dateFrom) params.append('from', dateFrom);
      if (dateTo) params.append('to', dateTo);

      const response = await fetch(`/api/documents/history?${params}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch history');
      }

      const data = await response.json();
      setDocuments(data.documents);
      setTotalPages(data.pagination.pages);
      setTotalDocuments(data.pagination.total);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'uploaded':
      case 'ocr':
      case 'nlp':
      case 'summary':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploaded': return 'Uploaded';
      case 'ocr': return 'Processing OCR';
      case 'nlp': return 'AI Analysis';
      case 'summary': return 'Generating Summary';
      case 'done': return 'Complete';
      case 'failed': return 'Failed';
      default: return status;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportCSV = async () => {
    try {
      const response = await fetch('/api/documents/export/csv', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'healthspectrum-history.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to export CSV:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your document history...</p>
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Document History</h1>
              <p className="text-gray-600">
                {totalDocuments} total documents • Showing page {currentPage} of {totalPages}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={exportCSV} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={() => navigate('/upload')} className="btn-medical-primary">
                <FileText className="w-4 h-4 mr-2" />
                Upload New
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Documents
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by filename..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="done">Complete</option>
                  <option value="failed">Failed</option>
                  <option value="processing">Processing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateeTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Documents List */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter || dateFrom || dateTo 
                    ? "Try adjusting your filters or search term."
                    : "Upload your first medical document to get started."
                  }
                </p>
                <Button onClick={() => navigate('/upload')} className="btn-medical-primary">
                  Upload Document
                </Button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Document
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {documents.map((document) => (
                        <tr key={document._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText className="w-5 h-5 text-blue-500 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {document.originalName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {document.mimeType}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getStatusIcon(document.status)}
                              <span className="ml-2 text-sm text-gray-900">
                                {getStatusText(document.status)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(document.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatFileSize(document.size)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {document.status === 'done' ? (
                                <Button
                                  onClick={() => navigate(`/results/${document._id}`)}
                                  size="sm"
                                  className="btn-medical-primary"
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                              ) : document.status === 'failed' ? (
                                <Button
                                  onClick={() => navigate(`/upload`)}
                                  size="sm"
                                  variant="outline"
                                >
                                  Retry
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => navigate(`/processing/${document._id}`)}
                                  size="sm"
                                  variant="outline"
                                >
                                  <Clock className="w-3 h-3 mr-1" />
                                  Status
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Showing page {currentPage} of {totalPages}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          variant="outline"
                          size="sm"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </Button>
                        <Button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          variant="outline"
                          size="sm"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default History;