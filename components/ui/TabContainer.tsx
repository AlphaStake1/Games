/**
 * Reusable tab container component to reduce duplication
 * Handles common tab navigation patterns used across content components
 */

'use client';

import { useState, useEffect } from 'react';
import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { colors } from '@/lib/design-tokens';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface TabContainerProps {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  children: React.ReactNode;
}

export const TabContainer = ({
  tabs,
  defaultTab,
  onTabChange,
  children,
}: TabContainerProps) => {
  const [activeTab, setActiveTab] = useState('');
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch by setting initial state after mount
  useEffect(() => {
    setActiveTab(defaultTab || tabs[0]?.id || '');
    setMounted(true);
  }, [defaultTab, tabs]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  // Don't render tabs until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className="flex items-center gap-2 px-4 py-2 rounded-t-lg rounded-b-none bg-gray-100"
            >
              <div className="w-4 h-4 bg-gray-300 rounded" />
              <span className="font-medium text-gray-500">{tab.label}</span>
            </div>
          ))}
        </div>
        <div className="tab-content">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Button
              key={tab.id}
              variant={isActive ? 'default' : 'ghost'}
              onClick={() => handleTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-t-lg rounded-b-none
                transition-all duration-200 border-b-2 relative
                ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border hover:bg-muted/50'
                }
              `}
            >
              <IconComponent className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { activeTab } as any);
          }
          return child;
        })}
      </div>
    </div>
  );
};

interface TabPanelProps {
  value: string;
  activeTab?: string;
  children: React.ReactNode;
}

export const TabPanel = ({ value, activeTab, children }: TabPanelProps) => {
  if (value !== activeTab) return null;

  return <div className="animate-in fade-in-50 duration-200">{children}</div>;
};

// Hook for managing tab state
export const useTabNavigation = (tabs: Tab[], defaultTab?: string) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  const switchTab = (tabId: string) => {
    if (tabs.some((tab) => tab.id === tabId)) {
      setActiveTab(tabId);
    }
  };

  const getActiveTabIndex = () => {
    return tabs.findIndex((tab) => tab.id === activeTab);
  };

  const nextTab = () => {
    const currentIndex = getActiveTabIndex();
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveTab(tabs[nextIndex].id);
  };

  const prevTab = () => {
    const currentIndex = getActiveTabIndex();
    const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    setActiveTab(tabs[prevIndex].id);
  };

  return {
    activeTab,
    setActiveTab: switchTab,
    nextTab,
    prevTab,
    getActiveTabIndex,
  };
};
