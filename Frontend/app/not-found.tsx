"use client";

import Link from 'next/link';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-amber-400 mb-4">404 - Not Found</h2>
        <p className="text-lg text-gray-400 mb-6">Could not find the requested resource.</p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-gray-100 font-semibold rounded-lg shadow-md transition-colors duration-200"
        >
          <HomeIcon className="h-4 w-4 mr-2 text-teal-400" aria-hidden="true" />
          Return Home
        </Link>
      </div>
    </div>
  );
}