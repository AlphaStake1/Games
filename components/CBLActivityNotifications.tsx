'use client';

import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Clock, CheckCircle, X, Bell } from 'lucide-react';

interface NotificationData {
  id: string;
  type: 'warning' | 'critical' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  actionRequired?: boolean;
  ctaText?: string;
  ctaAction?: () => void;
}

interface CBLActivityNotificationsProps {
  notifications?: NotificationData[];
  activityStatus: {
    isActive: boolean;
    consecutiveMissedSundays: number;
    nextDeadline: Date;
    gracePeriodEnds: Date;
  };
}

const CBLActivityNotifications = ({
  notifications = [],
  activityStatus,
}: CBLActivityNotificationsProps) => {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  // Generate activity-based notifications
  const generateActivityNotifications = (): NotificationData[] => {
    const activityNotifications: NotificationData[] = [];
    const now = new Date();
    const daysUntilDeadline = Math.ceil(
      (activityStatus.nextDeadline.getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const daysUntilGracePeriod = Math.ceil(
      (activityStatus.gracePeriodEnds.getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (!activityStatus.isActive) {
      activityNotifications.push({
        id: 'inactive-status',
        type: 'critical',
        title: '🚨 CBL Status: Inactive',
        message: `You've missed ${activityStatus.consecutiveMissedSundays} Sundays. Create and fill a board to reactivate your CBL status and resume earning commissions.`,
        timestamp: now,
        actionRequired: true,
        ctaText: 'Create Board',
        ctaAction: () => (window.location.href = '/cbl/dashboard?tab=boards'),
      });
    } else if (activityStatus.consecutiveMissedSundays === 2) {
      activityNotifications.push({
        id: 'final-warning',
        type: 'critical',
        title: '⏰ Final Warning - Create Board This Week',
        message: `You've missed 2 Sundays. Missing this Sunday will make your CBL status inactive on Tuesday. Create a board before ${activityStatus.gracePeriodEnds.toLocaleDateString()} to stay active.`,
        timestamp: now,
        actionRequired: true,
        ctaText: 'Create Board Now',
        ctaAction: () => (window.location.href = '/cbl/dashboard?tab=boards'),
      });
    } else if (activityStatus.consecutiveMissedSundays === 1) {
      activityNotifications.push({
        id: 'second-warning',
        type: 'warning',
        title: '⚠️ Second Warning - Board Creation Needed',
        message: `You missed last Sunday. Create a board this week to avoid going inactive. Grace period ends ${activityStatus.gracePeriodEnds.toLocaleDateString()}.`,
        timestamp: now,
        actionRequired: true,
        ctaText: 'Create Board',
        ctaAction: () => (window.location.href = '/cbl/dashboard?tab=boards'),
      });
    } else if (daysUntilDeadline <= 2 && daysUntilDeadline > 0) {
      activityNotifications.push({
        id: 'upcoming-deadline',
        type: 'info',
        title: '📅 Board Creation Reminder',
        message: `Don't forget to create your weekly boards! Deadline is ${activityStatus.nextDeadline.toLocaleDateString()}.`,
        timestamp: now,
        ctaText: 'Create Board',
        ctaAction: () => (window.location.href = '/cbl/dashboard?tab=boards'),
      });
    }

    return activityNotifications;
  };

  const allNotifications = [
    ...generateActivityNotifications(),
    ...notifications,
  ]
    .filter((notification) => !dismissedIds.includes(notification.id))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const dismissNotification = (id: string) => {
    setDismissedIds((prev) => [...prev, id]);
  };

  const getAlertVariant = (type: NotificationData['type']) => {
    switch (type) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'default';
      case 'success':
        return 'default';
      case 'info':
        return 'default';
      default:
        return 'default';
    }
  };

  const getIcon = (type: NotificationData['type']) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warning':
        return <Clock className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'info':
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  if (allNotifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {allNotifications.map((notification) => (
        <Alert
          key={notification.id}
          variant={getAlertVariant(notification.type)}
          className={`${
            notification.type === 'critical'
              ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20'
              : notification.type === 'warning'
                ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20'
                : notification.type === 'success'
                  ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20'
                  : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2 flex-1">
              {getIcon(notification.type)}
              <div className="flex-1">
                <AlertTitle className="text-sm font-semibold">
                  {notification.title}
                </AlertTitle>
                <AlertDescription className="text-sm mt-1">
                  {notification.message}
                </AlertDescription>
                {notification.ctaAction && (
                  <Button
                    size="sm"
                    className="mt-3"
                    variant={
                      notification.type === 'critical' ? 'default' : 'outline'
                    }
                    onClick={notification.ctaAction}
                  >
                    {notification.ctaText}
                  </Button>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dismissNotification(notification.id)}
              className="h-6 w-6 p-0 ml-2"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </Alert>
      ))}
    </div>
  );
};

export default CBLActivityNotifications;
