'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Home } from 'lucide-react';

const CBLHeader = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 py-2 text-sm">
          <Link
            href="/"
            className="flex items-center hover:text-blue-200 transition-colors duration-200"
          >
            <Home className="w-4 h-4 mr-1" />
            Play
          </Link>
          <ChevronRight className="w-4 h-4 text-blue-200" />
          <span className="text-blue-200">CBL Portal</span>
        </nav>

        {/* Main Header Content */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            {/* OC-Phil Avatar */}
            <div className="relative">
              <Image
                src="/Assets/Coach B with football and thumbs up.png"
                alt="OC-Phil Avatar"
                width={60}
                height={60}
                className="rounded-full border-4 border-white shadow-lg"
                priority
              />
              <div className="absolute -bottom-1 -right-1 bg-green-400 border-2 border-white rounded-full w-4 h-4"></div>
            </div>

            {/* Header Text */}
            <div>
              <h1 className="text-2xl font-bold">
                Community Board Leader Portal
              </h1>
              <p className="text-blue-100 text-sm">
                Manage your community boards with Offensive Coordinator Phil
                (OC-Phil)
              </p>
            </div>
          </div>

          {/* User Info */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium">Welcome back,</p>
              <p className="text-lg font-bold">OC-Phil</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">OP</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CBLHeader;
