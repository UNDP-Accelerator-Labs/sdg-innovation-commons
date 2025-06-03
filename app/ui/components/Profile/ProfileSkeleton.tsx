import React from "react";

export default function ProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto animate-pulse">
      <div className="mb-8">
        <div className="bg-gray-200 h-8 w-48 rounded"></div>
        <div className="bg-gray-200 h-4 w-64 rounded mt-2"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white border border-black border-solid p-6 text-center">
            <div className="bg-gray-200 h-24 w-24 rounded-full mx-auto mb-4"></div>
            <div className="bg-gray-200 h-6 w-32 rounded mx-auto mb-2"></div>
            <div className="bg-gray-200 h-4 w-24 rounded mx-auto mb-2"></div>
            <div className="bg-gray-200 h-4 w-20 rounded mx-auto mb-4"></div>
            <div className="space-y-2">
              <div className="bg-gray-200 h-10 w-full rounded"></div>
              <div className="bg-gray-200 h-10 w-full rounded"></div>
              <div className="bg-gray-200 h-10 w-full rounded"></div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white border border-black border-solid p-6">
            <div className="space-y-6">
              <div className="bg-gray-200 h-6 w-40 rounded"></div>
              <div className="bg-gray-200 h-6 w-40 rounded"></div>
              <div className="bg-gray-200 h-6 w-40 rounded"></div>
              <div className="bg-gray-200 h-6 w-40 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border border-black border-solid p-6 mt-6">
        <div className="space-y-4">
          <div className="bg-gray-200 h-10 w-full rounded"></div>
          <div className="bg-gray-200 h-10 w-full rounded"></div>
          <div className="bg-gray-200 h-10 w-full rounded"></div>
        </div>
      </div>
    </div>
  );
}
