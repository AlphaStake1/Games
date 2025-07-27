'use client';

import {
  termsHighlights,
  privacyHighlights,
  geographicRules,
  disputeResolution,
  keyPolicies,
  contactInfo,
  lastUpdated,
} from '@/lib/data/legal-data';
import {
  TabContainer,
  TabPanel,
  useTabNavigation,
} from '@/components/ui/TabContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Lock, Globe, Gavel, ExternalLink, Clock } from '@/lib/icons';
import { colors } from '@/lib/design-tokens';

const LegalComplianceContent = () => {
  const tabs = [
    { id: 'terms-summary', label: 'Terms of Service', icon: FileText },
    { id: 'privacy-policy', label: 'Privacy Policy', icon: Lock },
    { id: 'geographic-rules', label: 'Geographic Rules', icon: Globe },
    { id: 'dispute-resolution', label: 'Dispute Resolution', icon: Gavel },
  ];

  const { activeTab, setActiveTab } = useTabNavigation(tabs, 'terms-summary');

  const renderTermsSection = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText
            className="w-5 h-5"
            style={{ color: colors.primary.blue }}
          />
          Terms of Service Overview
        </h3>
        <p className="text-gray-700 mb-4">
          By using our platform, you agree to these terms. Please read carefully
          and ensure you understand your obligations.
        </p>
        <p className="text-sm text-gray-600">
          Last updated: {lastUpdated.termsOfService}
        </p>
      </div>

      <div className="grid gap-6">
        {termsHighlights.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <Card key={index} className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent
                    className="w-5 h-5"
                    style={{ color: colors.primary.blue }}
                  />
                  {section.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.rules.map((rule, ruleIndex) => (
                    <div
                      key={ruleIndex}
                      className="border-l-4 border-blue-200 pl-4"
                    >
                      <p className="font-medium text-gray-900">{rule}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-bold mb-3">Key Policies Summary</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {keyPolicies.map((policy, index) => {
            const IconComponent = policy.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <IconComponent
                    className="w-4 h-4"
                    style={{ color: colors.primary.blue }}
                  />
                  <h5 className="font-medium">{policy.title}</h5>
                </div>
                <p className="text-sm text-gray-600 mb-2">{policy.summary}</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  {policy.keyPoints.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" style={{ color: colors.primary.blue }} />
          Privacy Policy Overview
        </h3>
        <p className="text-gray-700 mb-4">
          We take your privacy seriously. Here's how we collect, use, and
          protect your personal information.
        </p>
        <p className="text-sm text-gray-600">
          Last updated: {lastUpdated.privacyPolicy}
        </p>
      </div>

      <div className="grid gap-6">
        {privacyHighlights.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <Card key={index} className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent
                    className="w-5 h-5"
                    style={{ color: colors.primary.blue }}
                  />
                  {section.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.details.map((detail, detailIndex) => (
                    <div
                      key={detailIndex}
                      className="border-l-4 border-green-200 pl-4"
                    >
                      <p className="text-gray-700">{detail}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderGeographicSection = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" style={{ color: colors.primary.blue }} />
          Geographic Rules & Restrictions
        </h3>
        <p className="text-gray-700 mb-4">
          Access to our services varies by location. Check your region's status
          below.
        </p>
        <p className="text-sm text-gray-600">
          Last updated: {lastUpdated.geographicRules}
        </p>
      </div>

      <div className="grid gap-6">
        {geographicRules.map((region, index) => {
          const IconComponent = region.icon;
          const statusColor =
            region.status === 'Available'
              ? 'text-green-600 bg-green-100'
              : region.status === 'Limited'
                ? 'text-yellow-600 bg-yellow-100'
                : region.status === 'Restricted'
                  ? 'text-red-600 bg-red-100'
                  : 'text-gray-600 bg-gray-100';

          return (
            <Card key={index} className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent
                      className="w-5 h-5"
                      style={{ color: colors.primary.blue }}
                    />
                    {region.region}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
                  >
                    {region.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {region.details.map((detail, detailIndex) => (
                    <div
                      key={detailIndex}
                      className="border-l-4 border-orange-200 pl-4"
                    >
                      <p className="text-gray-700">{detail}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderDisputeSection = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Gavel className="w-5 h-5" style={{ color: colors.primary.blue }} />
          Dispute Resolution Process
        </h3>
        <p className="text-gray-700 mb-4">
          If you have a dispute, we have a structured process to resolve it
          fairly and efficiently.
        </p>
        <p className="text-sm text-gray-600">
          Last updated: {lastUpdated.disputeResolution}
        </p>
      </div>

      <div className="space-y-6">
        {disputeResolution.map((step, index) => {
          const IconComponent = step.icon;
          return (
            <Card key={index} className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-full"
                    style={{
                      backgroundColor: colors.primary.blue,
                      color: 'white',
                    }}
                  >
                    {step.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <IconComponent
                        className="w-5 h-5"
                        style={{ color: colors.primary.blue }}
                      />
                      {step.title}
                    </div>
                    <p className="text-sm text-gray-600 font-normal">
                      {step.description}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {step.details.map((detail, detailIndex) => (
                    <div
                      key={detailIndex}
                      className="border-l-4 border-purple-200 pl-4"
                    >
                      <p className="text-gray-700">{detail}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TabContainer
        tabs={tabs}
        defaultTab="terms-summary"
        onTabChange={setActiveTab}
      >
        <TabPanel value="terms-summary" activeTab={activeTab}>
          {renderTermsSection()}
        </TabPanel>

        <TabPanel value="privacy-policy" activeTab={activeTab}>
          {renderPrivacySection()}
        </TabPanel>

        <TabPanel value="geographic-rules" activeTab={activeTab}>
          {renderGeographicSection()}
        </TabPanel>

        <TabPanel value="dispute-resolution" activeTab={activeTab}>
          {renderDisputeSection()}
        </TabPanel>
      </TabContainer>

      {/* Contact Information Footer */}
      <div className="mt-12 bg-white border-t-4 border-blue-500 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Need Help?</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <h4 className="font-medium mb-2">General Support</h4>
            <p className="text-sm text-gray-600 mb-1">
              {contactInfo.support.email}
            </p>
            <p className="text-xs text-gray-500">{contactInfo.support.hours}</p>
            <p className="text-xs text-gray-500">
              {contactInfo.support.response}
            </p>
          </div>
          <div className="text-center">
            <h4 className="font-medium mb-2">Legal Inquiries</h4>
            <p className="text-sm text-gray-600 mb-1">
              {contactInfo.legal.email}
            </p>
            <p className="text-xs text-gray-500">{contactInfo.legal.purpose}</p>
            <p className="text-xs text-gray-500">
              {contactInfo.legal.response}
            </p>
          </div>
          <div className="text-center">
            <h4 className="font-medium mb-2">Privacy Requests</h4>
            <p className="text-sm text-gray-600 mb-1">
              {contactInfo.privacy.email}
            </p>
            <p className="text-xs text-gray-500">
              {contactInfo.privacy.purpose}
            </p>
            <p className="text-xs text-gray-500">
              {contactInfo.privacy.response}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalComplianceContent;
