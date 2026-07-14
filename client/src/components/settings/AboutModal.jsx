import React from 'react';

const AboutModal = ({ isOpen, title, content, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-3 whitespace-pre-wrap">
          {content}
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-[var(--accent-color)] hover:opacity-90 rounded-md">Close</button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;