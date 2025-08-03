import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { getUserProjects, deleteProject } from '../../api/projectService';
import { motion } from 'framer-motion';
import { Trash2, Edit, Copy, Image, Clock, Tag, ChevronDown, ChevronUp } from 'lucide-react';

const ProjectsTab = ({ setInputPrompt, setActiveTab, setSelectedModel, setSelectedShape, setSeed, setRemoveWatermark, setWidth, setHeight }) => {
  const { user } = useAuthContext();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      if (user) {
        const userProjects = await getUserProjects(user.uid);
        setProjects(userProjects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      setErrorMessage('Failed to load your projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId, user.uid);
      setProjects(prev => prev.filter(project => project.id !== projectId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting project:', error);
      setErrorMessage('Failed to delete project. Please try again.');
    }
  };

  const handleUseProject = (project) => {
    // Set all the necessary state to recreate the project
    setInputPrompt(project.prompt);
    setSelectedModel(project.model);
    setSelectedShape(project.shape);
    setSeed(project.seed || '');
    setRemoveWatermark(project.removeWatermark || false);
    
    if (project.width && project.height) {
      setWidth(project.width);
      setHeight(project.height);
    }
    
    // Navigate to generate tab
    setActiveTab('generate');
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    return new Date(date).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Show login message if user is not authenticated
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
          <Image className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Sign In to Access Your Library</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
          Create an account or sign in to save and manage your favorite prompts and settings.
        </p>
        <button 
          onClick={() => document.querySelector('[data-login-button]')?.click()}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  // Show empty state if no projects
  if (!isLoading && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
          <Image className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Your Library is Empty</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
          Generate amazing images and save your favorite prompts and settings to your library.
        </p>
        <button 
          onClick={() => setActiveTab('generate')}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          Create Your First Project
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Your Project Library
        </h2>
        <button
          onClick={loadProjects}
          className="text-sm px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md hover:bg-purple-200 dark:hover:bg-purple-800/30 transition-colors"
        >
          Refresh
        </button>
      </div>

      {errorMessage && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-md">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map(project => (
            <motion.div
              key={project.id}
              className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700/50 overflow-hidden transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col md:flex-row">
                {/* Project image thumbnail */}
                {project.imageUrl && (
                  <div className="w-full md:w-40 h-40 md:h-auto overflow-hidden flex-shrink-0">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title || "Project image"} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Project info */}
                <div className="flex-grow p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg text-slate-900 dark:text-white">
                      {project.title || "Untitled Project"}
                    </h3>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => handleUseProject(project)}
                        className="p-1.5 text-purple-600 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/30 rounded"
                        title="Use this prompt"
                      >
                        <Copy size={18} />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm(project.id)}
                        className="p-1.5 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 rounded"
                        title="Delete project"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Brief project details */}
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                    {project.prompt}
                  </div>
                  
                  {/* Project metadata */}
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300">
                      <Clock size={14} className="mr-1" />
                      {formatDate(project.createdAt)}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300">
                      <Tag size={14} className="mr-1" />
                      {project.model || "Default model"}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300">
                      {project.shape || "Default shape"}
                    </span>
                  </div>
                  
                  {/* Expand/collapse button */}
                  <button 
                    onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                    className="mt-3 text-xs flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    {expandedProject === project.id ? (
                      <>
                        <ChevronUp size={16} className="mr-1" />
                        Hide details
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} className="mr-1" />
                        Show details
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Expanded project details */}
              {expandedProject === project.id && (
                <div className="px-4 pb-4 pt-1 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Prompt</h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                        {project.prompt}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Model</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{project.model || "Not specified"}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Size</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {project.width && project.height ? `${project.width} × ${project.height}` : "Default size"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Seed</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {project.seed || "Random"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Other Settings</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {project.removeWatermark ? "No watermark" : "Default watermark"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Delete confirmation */}
              {deleteConfirm === project.id && (
                <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border-t border-red-100 dark:border-red-800/30 flex justify-between items-center">
                  <span className="text-sm text-red-700 dark:text-red-400">Are you sure you want to delete this project?</span>
                  <div className="space-x-2">
                    <button 
                      onClick={() => handleDeleteProject(project.id)}
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      Delete
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1 text-sm bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsTab;
