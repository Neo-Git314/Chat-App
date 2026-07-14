import React from 'react';

const SectionHeader = ({ title, description }) => (
  <div className="mb-4 mt-8 first:mt-0">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
    {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    <hr className="mt-2 border-gray-200 dark:border-gray-700" />
  </div>
);

export default SectionHeader;