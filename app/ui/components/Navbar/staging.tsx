import React from 'react';

const { PROD_ENV } = process.env;

const StagingInfo: React.FC = () => {
  if (PROD_ENV !== 'staging') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-light-yellow text-black text-center p-2 z-50">
      <p className="text-sm md:text-base font-space-mono">
      You are viewing the staging site. This site is used for testing and development purposes.{' '}
        <a
          href="https://sdg-innovation-commons.org/"
          className="underline font-bold"
          target="_blank"
          rel="noopener noreferrer"
        >
          Click here to view the live site.
        </a>
      </p>
    </div>
  );
};

export default StagingInfo;