import React from 'react';

interface GoogleSignInButtonProps {
  onClick: () => void;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800 focus:ring-mauve-500 transition-colors"
    >
      <svg
        className="w-5 h-5 mr-2"
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <title>Google icon</title>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.62-3.85 1.62-4.64 0-8.4-3.82-8.4-8.5s3.76-8.5 8.4-8.5c2.56 0 4.21.98 5.2 1.95l2.43-2.43C18.4 1.59 15.82 0 12.48 0 5.6 0 0 5.58 0 12.45s5.6 12.45 12.48 12.45c7.04 0 12.02-4.92 12.02-12.25 0-.82-.07-1.62-.2-2.38H12.48z" />
      </svg>
      <span>Se connecter avec Google</span>
    </button>
  );
};