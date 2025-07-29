'use client';

import React, { useState } from 'react';

export default function GodModeTestPage() {
  const [activeView, setActiveView] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white'
          : 'bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 text-gray-900'
      }`}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-yellow-400 rounded"></div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                God Mode Dashboard - TEST
              </h1>
              <p className="text-gray-300">Testing interactive functionality</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="px-3 py-2 border rounded text-sm hover:bg-gray-700"
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <span className="px-3 py-1 border border-green-400 text-green-400 rounded text-sm">
              LIVE
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-6">
        <div className="grid w-full grid-cols-6 bg-gray-800/50 rounded-lg p-1">
          <button
            onClick={() => setActiveView('overview')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeView === 'overview'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView('navigation')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeView === 'navigation'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            All Pages
          </button>
          <button
            onClick={() => setActiveView('financials')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeView === 'financials'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            Money Flow
          </button>
          <button
            onClick={() => setActiveView('users')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeView === 'users'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveView('system')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeView === 'system'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            System
          </button>
          <button
            onClick={() => setActiveView('emergency')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeView === 'emergency'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            Emergency
          </button>
        </div>

        {/* Views */}
        <div className="mt-8">
          {activeView === 'overview' && (
            <div className="bg-gray-800 border border-gray-600 p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-4 text-white">
                Overview Section
              </h2>
              <p className="text-gray-200 text-lg">
                ✅ This is the overview section. You clicked Overview!
              </p>
              <div className="mt-4 p-4 bg-blue-600 rounded">
                <p className="text-white">Current view: {activeView}</p>
              </div>
            </div>
          )}

          {activeView === 'navigation' && (
            <div className="bg-gray-800 border border-gray-600 p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-4 text-white">
                All Pages Section
              </h2>
              <p className="text-gray-200 text-lg">
                ✅ This is the navigation section. You clicked All Pages!
              </p>
              <div className="mt-4 p-4 bg-green-600 rounded">
                <p className="text-white">Current view: {activeView}</p>
              </div>
            </div>
          )}

          {activeView === 'financials' && (
            <div className="bg-gray-800 border border-gray-600 p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-4 text-white">
                Money Flow Section
              </h2>
              <p className="text-gray-200 text-lg">
                ✅ This is the financial section. You clicked Money Flow!
              </p>
              <div className="mt-4 p-4 bg-yellow-600 rounded">
                <p className="text-white">Current view: {activeView}</p>
              </div>
            </div>
          )}

          {activeView === 'users' && (
            <div className="bg-gray-800 border border-gray-600 p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-4 text-white">
                Users Section
              </h2>
              <p className="text-gray-200 text-lg">
                ✅ This is the users section. You clicked Users!
              </p>
              <div className="mt-4 p-4 bg-purple-600 rounded">
                <p className="text-white">Current view: {activeView}</p>
              </div>
            </div>
          )}

          {activeView === 'system' && (
            <div className="bg-gray-800 border border-gray-600 p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-4 text-white">
                System Health Section
              </h2>
              <p className="text-gray-200 text-lg">
                ✅ This is the system section. You clicked System!
              </p>
              <div className="mt-4 p-4 bg-indigo-600 rounded">
                <p className="text-white">Current view: {activeView}</p>
              </div>
            </div>
          )}

          {activeView === 'emergency' && (
            <div className="bg-red-900 border border-red-500 p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-4 text-red-200">
                🚨 Emergency Section
              </h2>
              <p className="text-red-100 text-lg">
                ✅ This is the emergency section. You clicked Emergency!
              </p>
              <div className="mt-4 p-4 bg-red-700 rounded">
                <p className="text-white">Current view: {activeView}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
