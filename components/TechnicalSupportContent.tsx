'use client';

import {
  commonIssues,
  walletTroubleshooting,
  browserSupport,
  contactSupport,
  troubleshootingSteps,
  faqCategories,
} from '@/lib/data/support-data';
import {
  TabContainer,
  TabPanel,
  useTabNavigation,
} from '@/components/ui/TabContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  HelpCircle,
  Zap,
  Monitor,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Copy,
} from '@/lib/icons';
import { colors } from '@/lib/design-tokens';

const TechnicalSupportContent = () => {
  const tabs = [
    { id: 'common-issues', label: 'Common Issues', icon: HelpCircle },
    { id: 'wallet-troubleshooting', label: 'Wallet Issues', icon: Zap },
    { id: 'browser-support', label: 'Browser & Device', icon: Monitor },
    { id: 'contact-support', label: 'Contact Support', icon: MessageCircle },
  ];

  const { activeTab, setActiveTab } = useTabNavigation(tabs, 'common-issues');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderCommonIssues = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <HelpCircle
            className="w-5 h-5"
            style={{ color: colors.primary.blue }}
          />
          Common Issues & Solutions
        </h3>
        <p className="text-gray-700 mb-4">
          Find quick solutions to the most frequently reported problems. Try
          these steps before contacting support.
        </p>

        {/* Quick Troubleshooting Steps */}
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          {troubleshootingSteps.basic.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-4 text-center shadow-sm"
              >
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-full mb-3 mx-auto"
                  style={{
                    backgroundColor: colors.primary.blue,
                    color: 'white',
                  }}
                >
                  {step.step}
                </div>
                <IconComponent
                  className="w-6 h-6 mx-auto mb-2"
                  style={{ color: colors.primary.blue }}
                />
                <h4 className="font-medium text-sm mb-1">{step.title}</h4>
                <p className="text-xs text-gray-600">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Issue Categories */}
      <div className="grid gap-6">
        {commonIssues.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <Card key={index} className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent
                    className="w-5 h-5"
                    style={{ color: colors.primary.blue }}
                  />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.problems.map((problem, problemIndex) => (
                    <div key={problemIndex} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium flex-1">{problem.issue}</h4>
                        <Badge
                          className={`ml-2 ${getSeverityColor(problem.severity)}`}
                        >
                          {problem.severity} priority
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Solutions:
                        </p>
                        {problem.solutions.map((solution, solutionIndex) => (
                          <div
                            key={solutionIndex}
                            className="flex items-start gap-2"
                          >
                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                            <p className="text-sm text-gray-600">{solution}</p>
                          </div>
                        ))}
                      </div>
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

  const renderWalletTroubleshooting = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" style={{ color: colors.primary.blue }} />
          Wallet & Crypto Issues
        </h3>
        <p className="text-gray-700 mb-4">
          Having trouble with your crypto wallet or transactions? These
          solutions cover the most common wallet-related problems.
        </p>
      </div>

      <div className="grid gap-6">
        {walletTroubleshooting.map((section, index) => {
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
                {section.solutions && (
                  <div className="space-y-4">
                    {section.solutions.map((solution, solutionIndex) => (
                      <div
                        key={solutionIndex}
                        className="border-l-4 border-purple-200 pl-4"
                      >
                        <h4 className="font-medium mb-2">{solution.problem}</h4>
                        <div className="space-y-1">
                          {solution.steps.map((step, stepIndex) => (
                            <div
                              key={stepIndex}
                              className="flex items-start gap-2"
                            >
                              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-xs font-medium mt-0.5">
                                {stepIndex + 1}
                              </span>
                              <p className="text-sm text-gray-600">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {section.recommendations && (
                  <div className="space-y-4">
                    {section.recommendations.map((rec, recIndex) => (
                      <div
                        key={recIndex}
                        className="bg-purple-50 rounded-lg p-4"
                      >
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-600" />
                          {rec.title}
                        </h4>
                        <ul className="space-y-1">
                          {rec.practices.map((practice, practiceIndex) => (
                            <li
                              key={practiceIndex}
                              className="text-sm text-gray-600 flex items-start gap-2"
                            >
                              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                              {practice}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderBrowserSupport = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Monitor className="w-5 h-5" style={{ color: colors.primary.blue }} />
          Browser & Device Compatibility
        </h3>
        <p className="text-gray-700 mb-4">
          Ensure you're using a supported browser and device for the best
          experience with our platform.
        </p>
      </div>

      <div className="grid gap-6">
        {browserSupport.map((section, index) => {
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
                {section.browsers && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {section.browsers.map((browser, browserIndex) => {
                      const statusColor =
                        browser.status === 'Fully Supported'
                          ? 'text-green-600 bg-green-100'
                          : browser.status === 'Supported'
                            ? 'text-blue-600 bg-blue-100'
                            : 'text-yellow-600 bg-yellow-100';

                      return (
                        <div
                          key={browserIndex}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{browser.name}</h4>
                            <Badge className={statusColor}>
                              {browser.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            Version: {browser.version}
                          </p>
                          <p className="text-xs text-gray-500">
                            {browser.notes}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {section.devices && (
                  <div className="space-y-4">
                    {section.devices.map((device, deviceIndex) => (
                      <div
                        key={deviceIndex}
                        className="border-l-4 border-green-200 pl-4"
                      >
                        <h4 className="font-medium">
                          {device.platform} {device.version}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">
                          Supported browsers: {device.browsers.join(', ')}
                        </p>
                        <p className="text-xs text-gray-500">{device.notes}</p>
                      </div>
                    ))}
                  </div>
                )}

                {section.issues && (
                  <div className="space-y-4">
                    {section.issues.map((issue, issueIndex) => (
                      <div
                        key={issueIndex}
                        className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                      >
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          {issue.problem}
                        </h4>
                        <div className="space-y-1">
                          {issue.solutions.map((solution, solutionIndex) => (
                            <div
                              key={solutionIndex}
                              className="flex items-start gap-2"
                            >
                              <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                              <p className="text-sm text-gray-600">
                                {solution}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderContactSupport = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <MessageCircle
            className="w-5 h-5"
            style={{ color: colors.primary.blue }}
          />
          Contact Our Support Team
        </h3>
        <p className="text-gray-700 mb-4">
          Can't find a solution? Our support team is here to help. Choose the
          best contact method for your needs.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid md:grid-cols-3 gap-6">
        {contactSupport.methods.map((method, index) => {
          const IconComponent = method.icon;
          return (
            <Card key={index} className="shadow-sm text-center">
              <CardHeader>
                <div className="flex justify-center mb-2">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.primary.blue }}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-lg">{method.type}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-gray-900 mb-2">
                  {method.contact}
                </p>
                <p className="text-sm text-gray-600 mb-2">{method.hours}</p>
                <p className="text-xs text-gray-500 mb-4">{method.bestFor}</p>
                <Button
                  className="w-full"
                  style={{ backgroundColor: colors.primary.blue }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Contact Now
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tips Before Contacting */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Before You Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Help us help you faster by preparing this information:
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {contactSupport.tipsBefore.map((tip, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                <p className="text-sm text-gray-600">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <div className="grid gap-6">
        {faqCategories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <Card key={index} className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent
                    className="w-5 h-5"
                    style={{ color: colors.primary.blue }}
                  />
                  {category.category} FAQ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <div
                      key={faqIndex}
                      className="border-l-4 border-orange-200 pl-4"
                    >
                      <h4 className="font-medium mb-2">{faq.q}</h4>
                      <p className="text-sm text-gray-600">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Response Times */}
      <Card className="shadow-sm bg-gray-50">
        <CardHeader>
          <CardTitle>Expected Response Times</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <h4 className="font-medium">Email Support</h4>
              <p className="text-sm text-gray-600">
                {contactSupport.responseTime.email}
              </p>
            </div>
            <div>
              <h4 className="font-medium">Live Chat</h4>
              <p className="text-sm text-gray-600">
                {contactSupport.responseTime.chat}
              </p>
            </div>
            <div>
              <h4 className="font-medium">Phone Support</h4>
              <p className="text-sm text-gray-600">
                {contactSupport.responseTime.phone}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TabContainer
        tabs={tabs}
        defaultTab="common-issues"
        onTabChange={setActiveTab}
      >
        <TabPanel value="common-issues" activeTab={activeTab}>
          {renderCommonIssues()}
        </TabPanel>

        <TabPanel value="wallet-troubleshooting" activeTab={activeTab}>
          {renderWalletTroubleshooting()}
        </TabPanel>

        <TabPanel value="browser-support" activeTab={activeTab}>
          {renderBrowserSupport()}
        </TabPanel>

        <TabPanel value="contact-support" activeTab={activeTab}>
          {renderContactSupport()}
        </TabPanel>
      </TabContainer>
    </div>
  );
};

export default TechnicalSupportContent;
