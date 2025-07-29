'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface InactiveCBLOverlayProps {
  cblName?: string;
  onClose?: () => void;
}

const InactiveCBLOverlay = ({
  cblName = 'Community',
  onClose,
}: InactiveCBLOverlayProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white dark:bg-gray-900 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-gray-500" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Community Temporarily Inactive
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            <strong>{cblName}</strong> hasn't created boards this week. Don't
            worry - you can still play on House boards with the same great
            experience!
          </p>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              🏠 House Boards Available
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              All your favorite games, same rules, same prizes. Play while your
              CBL gets back on track!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Link href="/boards" className="flex items-center justify-center">
                <ExternalLink className="w-4 h-4 mr-2" />
                Browse House Boards
              </Link>
            </Button>
            {onClose && (
              <Button variant="outline" onClick={onClose} className="flex-1">
                Stay Here
              </Button>
            )}
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              CBLs can reactivate by creating and filling a new board
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InactiveCBLOverlay;
