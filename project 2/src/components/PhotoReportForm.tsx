import React, { useState, useRef } from 'react';
import { X, Save, Plus, Trash2, Camera, Upload, FileText, Download } from 'lucide-react';
import { PhotoReport, PhotoReportItem, Job, Customer } from '../utils/types';

interface PhotoReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: Job[];
  customers: Customer[];
  preSelectedCustomerId?: string;
  onSave: (report: Omit<PhotoReport, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onGeneratePDF: (report: PhotoReport) => void;
}

const PhotoReportForm: React.FC<PhotoReportFormProps> = ({
  isOpen,
  onClose,
  jobs,
  customers,
  preSelectedCustomerId,
  onSave,
  onGeneratePDF
}) => {
  const [formData, setFormData] = useState({
    jobId: '',
    customerId: '',
    title: '',
    description: '',
    createdBy: 'Current User'
  });

  const [photos, setPhotos] = useState<PhotoReportItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-select customer when coming from customer profile
  React.useEffect(() => {
    if (preSelectedCustomerId && isOpen) {
      setFormData(prev => ({
        ...prev,
        customerId: preSelectedCustomerId
      }));
    }
  }, [preSelectedCustomerId, isOpen]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Handle up to 100+ photos
    const fileArray = Array.from(files).slice(0, 150); // Allow up to 150 photos
    
    fileArray.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto: PhotoReportItem = {
            id: Math.random().toString(36).substr(2, 9),
            imageUrl: e.target?.result as string,
            caption: file.name.replace(/\.[^/.]+$/, ""),
            description: '',
            timestamp: new Date(),
            location: ''
          };
          setPhotos(prev => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const updatePhoto = (id: string, updates: Partial<PhotoReportItem>) => {
    setPhotos(photos.map(photo => 
      photo.id === id ? { ...photo, ...updates } : photo
    ));
  };

  const removePhoto = (id: string) => {
    setPhotos(photos.filter(photo => photo.id !== id));
  };

  const handleGeneratePDF = async () => {
    if (photos.length === 0) return;
    
    setIsGeneratingPDF(true);
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would use jsPDF or similar
      console.log('Generating PDF with', photos.length, 'photos');
      
      // Create a simple PDF download simulation
      const link = document.createElement('a');
      link.href = '#';
      link.download = `photo-report-${formData.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      link.click();
      
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || photos.length === 0) return;
    
    setIsSaving(true);
    
    const reportData: Omit<PhotoReport, 'id' | 'createdAt' | 'updatedAt'> = {
      ...formData,
      jobId: formData.jobId || undefined,
      customerId: formData.customerId || undefined,
      photos
    };
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave(reportData);
    
    // Reset form
    setFormData({
      jobId: '',
      customerId: '',
      title: '',
      description: '',
      createdBy: 'Current User'
    });
    setPhotos([]);
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create Photo Report</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Report Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Roof Inspection Report"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Related Job (Optional)
              </label>
              <select
                value={formData.jobId}
                onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a job...</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title} - {job.customerName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Brief description of the photo report..."
            />
          </div>

          {/* Photo Upload */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Photos</h3>
              <div className="flex items-center space-x-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photos</span>
                </button>
              </div>
            </div>

            {photos.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No photos added yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Upload up to 150 photos to create your report
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Choose Photos
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {photos.map((photo, index) => (
                  <div key={photo.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Photo */}
                      <div className="space-y-4">
                        <div className="relative">
                          <img
                            src={photo.imageUrl}
                            alt={photo.caption}
                            className="w-full h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                          />
                          <button
                            onClick={() => removePhoto(photo.id)}
                            className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Photo Caption
                          </label>
                          <input
                            type="text"
                            value={photo.caption}
                            onChange={(e) => updatePhoto(photo.id, { caption: e.target.value })}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Photo caption"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                          </label>
                          <textarea
                            value={photo.description}
                            onChange={(e) => updatePhoto(photo.id, { description: e.target.value })}
                            rows={8}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Detailed description of what this photo shows, any issues found, recommendations, etc."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Location (Optional)
                          </label>
                          <input
                            type="text"
                            value={photo.location}
                            onChange={(e) => updatePhoto(photo.id, { location: e.target.value })}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., North side of roof, Kitchen area"
                          />
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-500">
                          Photo {index + 1} of {photos.length} • Taken: {photo.timestamp.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
          >
            Cancel
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleGeneratePDF}
              disabled={photos.length === 0 || isGeneratingPDF}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
                photos.length === 0 || isGeneratingPDF
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                  : 'bg-purple-600 hover:bg-purple-700 text-white hover:scale-105'
              }`}
            >
              <FileText className={`w-4 h-4 ${isGeneratingPDF ? 'animate-pulse' : ''}`} />
              <span>{isGeneratingPDF ? 'Generating PDF...' : 'Generate PDF'}</span>
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.title.trim() || photos.length === 0 || isSaving}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
                !formData.title.trim() || photos.length === 0 || isSaving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25'
              }`}
            >
              <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
              <span>{isSaving ? 'Creating...' : 'Save Report'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoReportForm;