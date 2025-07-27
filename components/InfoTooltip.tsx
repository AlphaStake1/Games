'use client';

import React from 'react';
import Link from 'next/link';
import { HelpCircle, ExternalLink } from '@/lib/icons';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface InfoTooltipProps {
  title: string;
  description: string;
  playbookLink: string;
  linkText?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  title,
  description,
  playbookLink,
  linkText = "Learn more in OC-Phil's Playbook",
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="inline-flex items-center justify-center w-4 h-4 ml-1 text-muted-foreground hover:text-foreground transition-colors">
          <HelpCircle className="w-3 h-3" />
          <span className="sr-only">More information</span>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" side="top">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold">{title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="pt-2 border-t">
            <Link
              href={playbookLink}
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              {linkText}
            </Link>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default InfoTooltip;
