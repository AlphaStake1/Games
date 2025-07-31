'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as playerEmailService from '@/lib/services/playerEmailService';
import { PlayerEmailContact, EmailCampaign, EmailTemplate } from '@/lib/types/playerEmail';

export default function PlayerEmailsAdminPage() {
  const [contacts, setContacts] = useState<PlayerEmailContact[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [contacts, campaigns, templates] = await Promise.all([
        playerEmailService.getAllPlayerContacts(),
        // Mocked data for campaigns and templates
        Promise.resolve([]),
        Promise.resolve([]),
      ]);
      setContacts(contacts);
      setCampaigns(campaigns);
      setTemplates(templates);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Coach B's Player Email Dashboard</CardTitle>
          <CardDescription>Manage player emails, campaigns, and templates.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="contacts">
            <TabsList>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            <TabsContent value="contacts">
              {/* Contact Management UI */}
              <h3 className="text-lg font-semibold mt-4">Player Contacts</h3>
              <ul>
                {contacts.map(contact => (
                  <li key={contact.id} className="flex justify-between items-center p-2 border-b">
                    <span>{contact.playerName} ({contact.emailAddress})</span>
                    <Badge>{contact.status}</Badge>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="campaigns">
              {/* Campaign Management UI */}
            </TabsContent>
            <TabsContent value="templates">
              {/* Template Management UI */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
