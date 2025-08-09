'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Info } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Link from 'next/link';

interface FormData {
  inquiryType: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  websiteUrl: string;
  budget: string;
  timeline: string;
  description: string;
  additionalInfo: string;
}

const BusinessIntakePage = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    inquiryType: '',
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    websiteUrl: '',
    budget: '',
    timeline: '',
    description: '',
    additionalInfo: '',
  });

  const InfoTooltip = ({ content }: { content: string }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
        >
          <Info className="h-3 w-3 text-blue-600 dark:text-blue-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <p className="text-gray-700 dark:text-gray-300">{content}</p>
      </PopoverContent>
    </Popover>
  );

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleInquiryTypeSelect = (type: string) => {
    setFormData({ ...formData, inquiryType: type });
    handleNext();
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      fd.append('name', formData.contactName || '');
      fd.append('company', formData.companyName || '');
      fd.append('email', formData.email || '');
      fd.append(
        'subject',
        `Business Inquiry - ${formData.inquiryType || 'general'}`,
      );
      fd.append('category', 'business-intake');
      fd.append(
        'message',
        [
          `Inquiry Type: ${formData.inquiryType}`,
          `Website: ${formData.websiteUrl}`,
          `Budget: ${formData.budget}`,
          `Timeline: ${formData.timeline}`,
          '',
          `Description: ${formData.description}`,
          formData.additionalInfo
            ? `Additional: ${formData.additionalInfo}`
            : '',
        ].join('\n'),
      );
      await fetch('/api/submissions', { method: 'POST', body: fd });
    } catch (e) {
      console.error('Failed to submit intake to /api/submissions', e);
      // non-blocking; still advance to success view
    } finally {
      setCurrentStep(5); // Show success message
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900 dark:text-white">
                Welcome! I'm Morgan Reese
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                Thank you for your interest in partnering with Football Squares.
                I'll help you find the perfect collaboration opportunity for
                your business.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Let's start by understanding what type of business opportunity
                  you're looking for:
                </p>
              </div>
              <div className="grid gap-4">
                <Button
                  onClick={() => handleInquiryTypeSelect('advertising')}
                  className="h-auto p-4 text-left justify-start bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
                  variant="outline"
                >
                  <div>
                    <div className="font-semibold">
                      Advertising & Sponsorship
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Banner ads, sponsored content, or brand partnerships
                    </div>
                  </div>
                </Button>
                <Button
                  onClick={() => handleInquiryTypeSelect('partnership')}
                  className="h-auto p-4 text-left justify-start bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
                  variant="outline"
                >
                  <div>
                    <div className="font-semibold">Strategic Partnership</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Cross-promotion, joint ventures, or business
                      collaborations
                    </div>
                  </div>
                </Button>
                <Button
                  onClick={() => handleInquiryTypeSelect('whitelabel')}
                  className="h-auto p-4 text-left justify-start bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
                  variant="outline"
                >
                  <div>
                    <div className="font-semibold">White Label Solution</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Licensed platform for your own branded squares games
                    </div>
                  </div>
                </Button>
                <Button
                  onClick={() => handleInquiryTypeSelect('other')}
                  className="h-auto p-4 text-left justify-start bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
                  variant="outline"
                >
                  <div>
                    <div className="font-semibold">Other Opportunity</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Custom solutions or unique business proposals
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                {formData.inquiryType === 'advertising' &&
                  'Great choice! Tell me about your advertising goals.'}
                {formData.inquiryType === 'partnership' &&
                  "Excellent! Let's explore partnership opportunities."}
                {formData.inquiryType === 'whitelabel' &&
                  'Perfect! White label solutions can be very powerful.'}
                {formData.inquiryType === 'other' &&
                  "I'm excited to hear about your unique opportunity!"}
              </CardTitle>
              <CardDescription>
                {formData.inquiryType === 'advertising' &&
                  'Football Squares reaches thousands of engaged NFL fans weekly. Our advertising solutions include banner placements, sponsored game boards, and integrated promotional content.'}
                {formData.inquiryType === 'partnership' &&
                  'Strategic partnerships allow us to create mutual value. We can explore cross-promotion, joint marketing campaigns, or integrated service offerings.'}
                {formData.inquiryType === 'whitelabel' &&
                  'Our white label platform lets you offer Football Squares under your brand. Perfect for sports media companies, casinos, or entertainment platforms.'}
                {formData.inquiryType === 'other' &&
                  "I love hearing creative ideas! Whether it's a new technology integration, content collaboration, or something entirely different, let's discuss it."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="companyName"
                    className="flex items-center gap-2"
                  >
                    Company/Organization Name
                    <InfoTooltip content="Please provide your official company name as it appears on legal documents. This helps us verify your business and prepare appropriate partnership agreements." />
                  </Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) =>
                      handleInputChange('companyName', e.target.value)
                    }
                    placeholder="Enter your company name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="websiteUrl"
                    className="flex items-center gap-2"
                  >
                    Company Website
                    <InfoTooltip content="Your website helps us understand your brand, audience, and business model. This allows us to propose the most suitable partnership structure for both parties." />
                  </Label>
                  <Input
                    id="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={(e) =>
                      handleInputChange('websiteUrl', e.target.value)
                    }
                    placeholder="https://your-company.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2"
                  >
                    Project Description
                    <InfoTooltip content="Describe your vision for this partnership. Include specific goals, target outcomes, and any unique requirements. The more detail you provide, the better I can tailor our proposal." />
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange('description', e.target.value)
                    }
                    placeholder="Tell me about your project goals, target audience, and what success looks like for you..."
                    className="mt-1 min-h-[100px]"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  className="flex-1"
                >
                  ← Previous
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1"
                  disabled={!formData.companyName || !formData.description}
                >
                  Continue →
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                Let's talk budget and timeline
              </CardTitle>
              <CardDescription>
                This information helps me prepare realistic proposals and set
                appropriate expectations for our partnership.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="budget" className="flex items-center gap-2">
                    Investment Budget Range
                    <InfoTooltip content="Understanding your budget helps us recommend the most cost-effective solutions. All budget discussions are confidential and help us avoid proposing options outside your range." />
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange('budget', value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-5k">Under $5,000</SelectItem>
                      <SelectItem value="5k-15k">$5,000 - $15,000</SelectItem>
                      <SelectItem value="15k-50k">$15,000 - $50,000</SelectItem>
                      <SelectItem value="50k-100k">
                        $50,000 - $100,000
                      </SelectItem>
                      <SelectItem value="over-100k">Over $100,000</SelectItem>
                      <SelectItem value="flexible">
                        Budget is flexible
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeline" className="flex items-center gap-2">
                    Project Timeline
                    <InfoTooltip content="Knowing your timeline helps us allocate resources properly and meet your launch dates. We can often accommodate urgent requests with proper planning." />
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange('timeline', value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="When do you want to launch?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">As soon as possible</SelectItem>
                      <SelectItem value="1-month">Within 1 month</SelectItem>
                      <SelectItem value="2-3-months">2-3 months</SelectItem>
                      <SelectItem value="4-6-months">4-6 months</SelectItem>
                      <SelectItem value="later">Later this year</SelectItem>
                      <SelectItem value="flexible">
                        Timeline is flexible
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="additionalInfo"
                    className="flex items-center gap-2"
                  >
                    Additional Requirements
                    <InfoTooltip content="Share any specific requirements, technical constraints, compliance needs, or special considerations. This helps us prepare a comprehensive proposal." />
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) =>
                      handleInputChange('additionalInfo', e.target.value)
                    }
                    placeholder="Any specific requirements, integrations needed, compliance considerations, or other important details..."
                    className="mt-1 min-h-[80px]"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  className="flex-1"
                >
                  ← Previous
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1"
                  disabled={!formData.budget || !formData.timeline}
                >
                  Continue →
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                Contact Information
              </CardTitle>
              <CardDescription>
                I'll personally review your request and respond within 24 hours
                with a customized proposal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="contactName"
                    className="flex items-center gap-2"
                  >
                    Your Name
                    <InfoTooltip content="I like to personalize all communications. Knowing who I'm working with helps build a better business relationship." />
                  </Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) =>
                      handleInputChange('contactName', e.target.value)
                    }
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    Business Email
                    <InfoTooltip content="Please use your business email address. This ensures proper communication and helps verify your affiliation with the company mentioned." />
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.name@company.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    Phone Number (Optional)
                    <InfoTooltip content="A phone number allows for quicker communication if we need to clarify any details or discuss complex partnership structures." />
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-semibold text-green-800 dark:text-green-200">
                    Response Guarantee
                  </span>
                </div>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  I personally review every business inquiry and will respond to
                  your request within <strong>24 hours</strong> with either a
                  detailed proposal or follow-up questions.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mt-4">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  Want to include supporting documents (RFPs, scopes, decks)?
                  Submit them securely via{' '}
                  <Link
                    href="/submissions"
                    className="text-blue-700 underline dark:text-blue-300"
                  >
                    Secure Submissions
                  </Link>{' '}
                  to avoid email storage limits. Files are scanned and stored
                  safely.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  className="flex-1"
                >
                  ← Previous
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1"
                  disabled={!formData.contactName || !formData.email}
                >
                  Review Submission →
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                Review Your Submission
              </CardTitle>
              <CardDescription>
                Please review your information before submitting your business
                inquiry.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
                  <div>
                    <strong>Inquiry Type:</strong>{' '}
                    {formData.inquiryType === 'advertising'
                      ? 'Advertising & Sponsorship'
                      : formData.inquiryType === 'partnership'
                        ? 'Strategic Partnership'
                        : formData.inquiryType === 'whitelabel'
                          ? 'White Label Solution'
                          : 'Other Opportunity'}
                  </div>
                  <div>
                    <strong>Company:</strong> {formData.companyName}
                  </div>
                  <div>
                    <strong>Contact:</strong> {formData.contactName}
                  </div>
                  <div>
                    <strong>Email:</strong> {formData.email}
                  </div>
                  {formData.phone && (
                    <div>
                      <strong>Phone:</strong> {formData.phone}
                    </div>
                  )}
                  {formData.websiteUrl && (
                    <div>
                      <strong>Website:</strong> {formData.websiteUrl}
                    </div>
                  )}
                  <div>
                    <strong>Budget:</strong> {formData.budget}
                  </div>
                  <div>
                    <strong>Timeline:</strong> {formData.timeline}
                  </div>
                  <div>
                    <strong>Description:</strong> {formData.description}
                  </div>
                  {formData.additionalInfo && (
                    <div>
                      <strong>Additional Info:</strong>{' '}
                      {formData.additionalInfo}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  className="flex-1"
                >
                  ← Edit Information
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Submit Business Inquiry
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-600 dark:text-green-400">
                Submission Received!
              </CardTitle>
              <CardDescription className="text-lg">
                Thank you for your business inquiry, {formData.contactName}!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  What happens next?
                </h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p>You'll receive a confirmation email shortly</p>
                  <p>I'll personally review your submission</p>
                  <p>Expect my response within 24 hours</p>
                  <p>We'll schedule a call to discuss your project</p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  <strong>Quick Response Guaranteed:</strong> I typically
                  respond within 4-6 hours during business days. For urgent
                  inquiries, feel free to mention "URGENT" in your email subject
                  line.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  If you have any attachments to include, please upload them via{' '}
                  <Link
                    href="/submissions"
                    className="text-blue-700 underline dark:text-blue-300"
                  >
                    Secure Submissions
                  </Link>{' '}
                  and reference your name or company. This helps us screen files
                  and conserve mailbox storage.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Questions? Email me directly at{' '}
                  <a
                    href="mailto:morganreese@tutamail.com"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    morganreese@tutamail.com
                  </a>
                </p>
              </div>

              <Button
                onClick={() => (window.location.href = '/')}
                className="w-full"
              >
                Return to Homepage
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          {currentStep < 5 && (
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                {[0, 1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full ${
                      step <= currentStep
                        ? 'bg-blue-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Step {currentStep + 1} of 5
              </p>
            </div>
          )}

          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default BusinessIntakePage;
