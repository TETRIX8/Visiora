// src/components/ui/SocialLinksDemo.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, Globe } from 'lucide-react';

const SocialLinksDemo = () => {
  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/Kandariarjun07',
      color: 'hover:text-gray-900 dark:hover:text-white',
      bgColor: 'hover:bg-gray-100 dark:hover:bg-gray-800'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://x.com/kandariarjun7',
      color: 'hover:text-blue-500',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://www.linkedin.com/in/kandariarjun',
      color: 'hover:text-blue-600',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    {
      name: 'Email',
      icon: Mail,
      url: 'mailto:visioracompany@gmail.com',
      color: 'hover:text-red-500',
      bgColor: 'hover:bg-red-50 dark:hover:bg-red-900/20'
    },
    {
      name: 'Portfolio',
      icon: Globe,
      url: 'https://kandariarjun.netlify.app/',
      color: 'hover:text-purple-500',
      bgColor: 'hover:bg-purple-50 dark:hover:bg-purple-900/20'
    }
  ];

  return (
    <div className="w-full py-12 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-t border-slate-200/50 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Connect with the Developer
          </h3>
          <p className="text-slate-600 dark:text-white/70">
            Follow my journey in AI, web development, and creative coding
          </p>
        </div>
        
        <div className="flex justify-center items-center space-x-6">
          {socialLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  group relative p-4 rounded-xl border border-slate-200/50 dark:border-white/10 
                  bg-white/50 dark:bg-white/5 backdrop-blur-sm
                  transition-all duration-300 ease-out
                  ${link.bgColor}
                `}
                whileHover={{ 
                  scale: 1.05,
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                <IconComponent 
                  size={24} 
                  className={`
                    text-slate-600 dark:text-white/70 
                    transition-colors duration-300
                    ${link.color}
                  `}
                />
                
                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-slate-800 dark:bg-white text-white dark:text-slate-800 px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap">
                    {link.name}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800 dark:border-t-white"></div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 dark:text-white/50">
            Built with ❤️ by Arjun Singh Kandari
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialLinksDemo;
