import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContextV2';
import { saveProject } from '../../api/projectService';
import Portal from '../ui/Portal';

const SaveProjectModal = ({ isOpen, onClose, projectData }) => {
  const { user } = useAuthContext();
  const [title, setTitle] = useState(projectData?.title || '');
  const [description, setDescription] = useState(projectData?.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please enter a title for your project');
      return;
    }

    if (!user) {
      setErrorMessage('You must be logged in to save projects');
      return;
    }

    setIsSaving(true);
    
    try {
      // Save the project with all its data
      const projectToSave = {
        ...projectData,
        title: title.trim(),
        description: description.trim()
      };
      
      await saveProject(user.uid, projectToSave);
      onClose(true); // Pass true to indicate successful save
    } catch (error) {
      console.error('Error saving project:', error);
      setErrorMessage('Failed to save project. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div 
          className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Save Project to Library
            </h3>
            <button 
              onClick={() => onClose()}
              className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {errorMessage && (
              <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-md text-sm">
                {errorMessage}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="project-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Project Title
              </label>
              <input
                id="project-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Amazing Artwork"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isSaving}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="project-description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Description (Optional)
              </label>
              <textarea
                id="project-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add notes or description about this project"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                disabled={isSaving}
              />
            </div>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Project Details</h4>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-md text-sm space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Model:</span>
                  <span className="text-slate-900 dark:text-white">{projectData.model || 'Default'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Size:</span>
                  <span className="text-slate-900 dark:text-white">
                    {projectData.width && projectData.height ? `${projectData.width}×${projectData.height}` : 'Default'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Seed:</span>
                  <span className="text-slate-900 dark:text-white">{projectData.seed || 'Random'}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-2 flex space-x-3">
              <button
                type="button"
                onClick={() => onClose()}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex justify-center items-center"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                    Saving...
                  </>
                ) : 'Save Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
};

export default SaveProjectModal;
