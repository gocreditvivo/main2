import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  FolderOpen, Upload, FileText, Image, File, Trash2,
  Download, Eye, Search, Filter, X, Clock, CheckCircle2
} from 'lucide-react';

interface Document {
  id: string;
  document_type: string;
  document_name: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
  verified: boolean;
  encrypted: boolean;
}

export default function DocumentsPage() {
  const { clientData } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (clientData?.id) {
      loadDocuments();
    }
  }, [clientData]);

  const loadDocuments = async () => {
    try {
      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('client_id', clientData?.id)
        .order('created_at', { ascending: false });

      setDocuments(data || []);
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getDocumentIcon = (type: string | null) => {
    if (!type) return <File className="h-6 w-6" />;
    if (type.includes('image')) return <Image className="h-6 w-6" />;
    if (type.includes('pdf')) return <FileText className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredDocuments = documents.filter((doc) => {
    if (filterType !== 'all' && doc.document_type !== filterType) return false;
    if (searchQuery && !doc.document_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const documentTypes = [
    { value: 'all', label: 'All Documents' },
    { value: 'credit_report', label: 'Credit Reports' },
    { value: 'id_verification', label: 'ID Verification' },
    { value: 'proof_of_address', label: 'Proof of Address' },
    { value: 'dispute_letter', label: 'Dispute Letters' },
    { value: 'bureau_response', label: 'Bureau Responses' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Documents</h1>
          <p className="mt-1 text-secondary-600">
            Upload and manage your credit-related documents
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn btn-primary"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </button>
      </div>

      {/* Search & Filter */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="min-w-[180px]"
          >
            {documentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      {isLoading ? (
        <div className="card flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="card text-center py-12">
          <FolderOpen className="h-16 w-16 text-secondary-300 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-secondary-900">No documents found</h3>
          <p className="mt-2 text-secondary-600">
            {documents.length === 0
              ? "Upload your first document to get started"
              : "No documents match your current filters"}
          </p>
          {documents.length === 0 && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn btn-primary mt-6"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload First Document
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="card group hover:shadow-elevated transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-secondary-100 text-secondary-600">
                  {getDocumentIcon(doc.file_type)}
                </div>
                <div className="flex items-center gap-2">
                  {doc.verified && (
                    <CheckCircle2 className="h-5 w-5 text-success-500" title="Verified" />
                  )}
                  {doc.encrypted && (
                    <span className="text-xs text-secondary-500">Locked</span>
                  )}
                </div>
              </div>
              <h3 className="font-medium text-secondary-900 truncate">{doc.document_name}</h3>
              <p className="text-sm text-secondary-500 mt-1">
                {doc.document_type.replace('_', ' ')}
              </p>
              <div className="flex items-center gap-4 mt-4 text-xs text-secondary-500">
                <span>{formatFileSize(doc.file_size)}</span>
                <span>{new Date(doc.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="btn btn-secondary flex-1">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="btn btn-secondary flex-1">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary-900">Upload Document</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 text-secondary-400 hover:text-secondary-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="input-label">Document Type</label>
                <select className="mt-1 w-full">
                  <option value="credit_report">Credit Report</option>
                  <option value="id_verification">ID Verification</option>
                  <option value="proof_of_address">Proof of Address</option>
                  <option value="bureau_response">Bureau Response</option>
                  <option value="dispute_letter">Dispute Letter</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="input-label">Document Name</label>
                <input
                  type="text"
                  className="mt-1 w-full"
                  placeholder="e.g., Equifax Report January 2024"
                />
              </div>

              <div className="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-secondary-400 mx-auto" />
                <p className="mt-4 text-secondary-600">
                  Drag and drop your file here, or{' '}
                  <span className="text-primary-600 font-medium cursor-pointer">browse</span>
                </p>
                <p className="mt-2 text-xs text-secondary-500">
                  PDF, JPG, PNG (max 10MB)
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-6 pt-6 border-t border-secondary-200">
              <button
                onClick={() => setShowUploadModal(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button className="btn btn-primary flex-1">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
