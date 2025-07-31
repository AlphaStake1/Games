'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Mail,
  Send,
  Users,
  FileText,
  BarChart3,
  Shield,
  Eye,
  Trash2,
  Download,
  Upload,
  Filter,
  Search,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Gamepad2,
} from 'lucide-react';

// Mock data - replace with actual API calls
const mockContacts = [
  {
    id: '1',
    playerName: 'Mike Johnson',
    emailAddress: 'mike@example.com',
    gameLevel: 'advanced',
    totalGamesPlayed: 247,
    winRate: '68%',
    status: 'active',
    emailVerified: true,
    totalEmailsSent: 12,
    lastEmailSent: new Date('2024-01-20'),
    joinedDate: new Date('2023-12-01'),
    tags: ['high-performer', 'advanced'],
    currentCBL: "OC Phil's Elite",
  },
  {
    id: '2',
    playerName: 'Sarah Williams',
    emailAddress: 'sarah@example.com',
    gameLevel: 'pro',
    totalGamesPlayed: 423,
    winRate: '74%',
    status: 'active',
    emailVerified: true,
    totalEmailsSent: 18,
    lastEmailSent: new Date('2024-01-18'),
    joinedDate: new Date('2023-11-15'),
    tags: ['pro-player', 'high-stakes'],
    currentCBL: "Coach B's Winners",
  },
  {
    id: '3',
    playerName: 'David Chen',
    emailAddress: 'david@example.com',
    gameLevel: 'beginner',
    totalGamesPlayed: 23,
    winRate: '45%',
    status: 'pending_verification',
    emailVerified: false,
    totalEmailsSent: 0,
    joinedDate: new Date('2024-01-15'),
    tags: ['new-player'],
    currentCBL: 'Independent',
  },
];

const mockCampaigns = [
  {
    id: '1',
    name: 'January Game Updates',
    subject: 'New Features Coming to Football Squares',
    campaignType: 'game_update',
    status: 'sent',
    recipientCount: 156,
    sentCount: 154,
    openedCount: 118,
    createdAt: new Date('2024-01-15'),
    sentAt: new Date('2024-01-16'),
  },
  {
    id: '2',
    name: 'Strategy Tips for Beginners',
    subject: "Level Up Your Game with Coach B's Tips",
    campaignType: 'promotional',
    status: 'draft',
    recipientCount: 67,
    createdAt: new Date('2024-01-20'),
  },
];

interface WalletAuthProps {
  onAuthenticated: (session: any) => void;
}

const WalletAuth: React.FC<WalletAuthProps> = ({ onAuthenticated }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);

    // Simulate wallet connection and authentication
    setTimeout(() => {
      const mockSession = {
        sessionId: 'session_123',
        walletAddress: '0xCoachB...abcd',
        authenticated: true,
        permissions: [
          'view_contacts',
          'send_campaigns',
          'manage_templates',
          'view_analytics',
        ],
        loginTime: new Date(),
      };

      onAuthenticated(mockSession);
      setIsConnecting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Coach B Email Admin</CardTitle>
          <CardDescription>
            Secure access to player email management system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>Security Notice:</strong> This system is restricted to
              Coach B only. All access is logged and monitored.
            </p>
          </div>

          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full"
            size="lg"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Authenticating...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Connect Coach B Wallet
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Only Coach B's verified wallet address can access this system
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const ContactsTable: React.FC = () => {
  const [contacts, setContacts] = useState(mockContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.currentCBL || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string, verified: boolean) => {
    if (status === 'active' && verified) {
      return (
        <Badge variant="default" className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    }
    if (status === 'pending_verification') {
      return (
        <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    }
    if (status === 'bounced') {
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Bounced
        </Badge>
      );
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Player Email Contacts ({filteredContacts.length})
            </CardTitle>
            <CardDescription>
              Manage player email database and contact information
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending_verification">
                Pending Verification
              </SelectItem>
              <SelectItem value="bounced">Bounced</SelectItem>
              <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>Player Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Game Level</TableHead>
                <TableHead>Games Played</TableHead>
                <TableHead>Win Rate</TableHead>
                <TableHead>Current CBL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-medium">
                    {contact.playerName}
                  </TableCell>
                  <TableCell>{contact.emailAddress}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {contact.gameLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>{contact.totalGamesPlayed}</TableCell>
                  <TableCell>{contact.winRate}</TableCell>
                  <TableCell>{contact.currentCBL}</TableCell>
                  <TableCell>
                    {getStatusBadge(contact.status, contact.emailVerified)}
                  </TableCell>
                  <TableCell>
                    {contact.lastEmailSent
                      ? contact.lastEmailSent.toLocaleDateString()
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

const CampaignComposer: React.FC = () => {
  const [campaignData, setCampaignData] = useState({
    name: '',
    subject: '',
    body: '',
    targetAudience: 'all',
    campaignType: 'game_update',
    priority: 'normal',
  });

  const handleSend = async () => {
    // Implement campaign sending logic
    console.log('Sending campaign:', campaignData);
  };

  const handlePreview = () => {
    // Implement preview logic
    console.log('Previewing campaign:', campaignData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Create Player Email Campaign
        </CardTitle>
        <CardDescription>
          Compose and send batch emails to player contacts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="campaign-name">Campaign Name</Label>
            <Input
              id="campaign-name"
              value={campaignData.name}
              onChange={(e) =>
                setCampaignData({ ...campaignData, name: e.target.value })
              }
              placeholder="e.g., February Game Updates"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="campaign-type">Campaign Type</Label>
            <Select
              value={campaignData.campaignType}
              onValueChange={(value) =>
                setCampaignData({ ...campaignData, campaignType: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="game_update">Game Update</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="promotional">Promotional</SelectItem>
                <SelectItem value="system_alert">System Alert</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Email Subject</Label>
          <Input
            id="subject"
            value={campaignData.subject}
            onChange={(e) =>
              setCampaignData({ ...campaignData, subject: e.target.value })
            }
            placeholder="Enter email subject line"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body">Email Body</Label>
          <Textarea
            id="body"
            value={campaignData.body}
            onChange={(e) =>
              setCampaignData({ ...campaignData, body: e.target.value })
            }
            placeholder="Enter email content. Use {playerName}, {gameLevel}, {winRate}, {currentCBL} for personalization."
            rows={10}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience</Label>
            <Select
              value={campaignData.targetAudience}
              onValueChange={(value) =>
                setCampaignData({ ...campaignData, targetAudience: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Active Players</SelectItem>
                <SelectItem value="active">
                  Recently Active (30 days)
                </SelectItem>
                <SelectItem value="new">New Players (7 days)</SelectItem>
                <SelectItem value="advanced_players">
                  Advanced Players (Pro/Advanced)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={campaignData.priority}
              onValueChange={(value) =>
                setCampaignData({ ...campaignData, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={handlePreview} variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSend} className="flex-1">
            <Send className="h-4 w-4 mr-2" />
            Send Campaign
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CampaignHistory: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Campaign History
        </CardTitle>
        <CardDescription>
          View past email campaigns and their performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockCampaigns.map((campaign) => (
            <div key={campaign.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{campaign.name}</h4>
                  <p className="text-sm text-gray-600">{campaign.subject}</p>
                </div>
                <Badge
                  variant={campaign.status === 'sent' ? 'default' : 'secondary'}
                >
                  {campaign.status}
                </Badge>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-3 text-sm">
                <div>
                  <span className="text-gray-500">Recipients:</span>
                  <span className="ml-1 font-medium">
                    {campaign.recipientCount}
                  </span>
                </div>
                {campaign.status === 'sent' && (
                  <>
                    <div>
                      <span className="text-gray-500">Sent:</span>
                      <span className="ml-1 font-medium">
                        {campaign.sentCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Opened:</span>
                      <span className="ml-1 font-medium">
                        {campaign.openedCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Open Rate:</span>
                      <span className="ml-1 font-medium">
                        {Math.round(
                          (campaign.openedCount / campaign.sentCount) * 100,
                        )}
                        %
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <div className="text-sm text-gray-500">
                  {campaign.status === 'sent'
                    ? `Sent ${campaign.sentAt?.toLocaleDateString()}`
                    : `Created ${campaign.createdAt.toLocaleDateString()}`}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  {campaign.status === 'draft' && (
                    <Button variant="ghost" size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AnalyticsDashboard: React.FC = () => {
  const totalContacts = mockContacts.length;
  const activeContacts = mockContacts.filter(
    (c) => c.status === 'active',
  ).length;
  const verifiedContacts = mockContacts.filter((c) => c.emailVerified).length;
  const totalCampaigns = mockCampaigns.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Players
                </p>
                <p className="text-2xl font-bold">{totalContacts}</p>
              </div>
              <Gamepad2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Players
                </p>
                <p className="text-2xl font-bold">{activeContacts}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Verified Emails
                </p>
                <p className="text-2xl font-bold">{verifiedContacts}</p>
              </div>
              <Mail className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Campaigns Sent
                </p>
                <p className="text-2xl font-bold">{totalCampaigns}</p>
              </div>
              <Send className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Player Level Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Pro Players
              </span>
              <span className="font-medium">
                {mockContacts.filter((c) => c.gameLevel === 'pro').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                Advanced Players
              </span>
              <span className="font-medium">
                {mockContacts.filter((c) => c.gameLevel === 'advanced').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-orange-500" />
                Beginner Players
              </span>
              <span className="font-medium">
                {mockContacts.filter((c) => c.gameLevel === 'beginner').length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function PlayerEmailAdminPage() {
  const [session, setSession] = useState<any>(null);

  if (!session) {
    return <WalletAuth onAuthenticated={setSession} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Player Email Management
              </h1>
              <p className="text-gray-600">
                Secure email administration for Coach B
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Authenticated
              </Badge>
              <div className="text-sm text-gray-500">
                Session: {session.walletAddress}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            <ContactsTable />
          </TabsContent>

          <TabsContent value="campaigns">
            <CampaignComposer />
          </TabsContent>

          <TabsContent value="history">
            <CampaignHistory />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
