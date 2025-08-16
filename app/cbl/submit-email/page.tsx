'use client';

import React, { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Shield,
  CheckCircle,
  AlertTriangle,
  Info,
  Users,
  MessageSquare,
  Phone,
} from 'lucide-react';

interface EmailSubmissionForm {
  cblName: string;
  primaryContact: string;
  emailAddress: string;
  secondaryEmail: string;
  phoneNumber: string;
  telegramHandle: string;
  discordHandle: string;
  platform: string;
  memberCount: number;
  referralCode: string;
  preferences: {
    emailNotifications: boolean;
    milestoneUpdates: boolean;
    promotionalEmails: boolean;
    systemAlerts: boolean;
    batchCommunications: boolean;
  };
  agreedToTerms: boolean;
}

export default function CBLEmailSubmissionPage() {
  const [formData, setFormData] = useState<EmailSubmissionForm>({
    cblName: '',
    primaryContact: '',
    emailAddress: '',
    secondaryEmail: '',
    phoneNumber: '',
    telegramHandle: '',
    discordHandle: '',
    platform: '',
    memberCount: 0,
    referralCode: '',
    preferences: {
      emailNotifications: true,
      milestoneUpdates: true,
      promotionalEmails: false,
      systemAlerts: true,
      batchCommunications: true,
    },
    agreedToTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cblName.trim()) {
      newErrors.cblName = 'CBL name is required';
    }

    if (!formData.primaryContact.trim()) {
      newErrors.primaryContact = 'Primary contact name is required';
    }

    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address';
    }

    if (!formData.platform) {
      newErrors.platform = 'Please select your primary platform';
    }

    if (!formData.referralCode.trim()) {
      newErrors.referralCode = 'Referral code is required';
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call to submit email
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would call your actual API
      // const response = await fetch('/api/cbl/submit-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      console.log('Email submission:', formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const updatePreferences = (field: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-green-900">
              Email Submitted Successfully!
            </CardTitle>
            <CardDescription>
              Your email has been securely added to OC-Phil&apos;s CBL
              communications database.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg text-left">
              <h4 className="font-semibold text-blue-900 mb-2">
                What happens next:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • You&apos;ll receive a verification email within 10 minutes
                </li>
                <li>• Click the verification link to confirm your email</li>
                <li>
                  • Once verified, you&apos;ll start receiving CBL
                  communications
                </li>
                <li>
                  • Check your spam folder if you don&apos;t see the
                  verification email
                </li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg text-left">
              <h4 className="font-semibold text-amber-900 mb-2">
                Email Types You&apos;ll Receive:
              </h4>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Milestone achievement notifications and rewards</li>
                <li>• Platform updates and new feature announcements</li>
                <li>• CBL program insights and tips from OC-Phil</li>
                {formData.preferences.batchCommunications && (
                  <li>• Batch communications and community updates</li>
                )}
              </ul>
            </div>

            <Button
              onClick={() => (window.location.href = '/cbl/dashboard')}
              className="w-full"
            >
              Return to CBL Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Submit Your CBL Email
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Join OC-Phil&apos;s secure email list for CBL updates, milestones,
            and exclusive communications
          </p>
        </div>

        {/* Security Notice */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Security & Privacy
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • Your email is stored in a secure, encrypted database
                  </li>
                  <li>• Only OC-Phil has access to this email list</li>
                  <li>• All communications are logged and monitored</li>
                  <li>• You can unsubscribe at any time</li>
                  <li>• Your information is never shared with third parties</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>CBL Contact Information</CardTitle>
            <CardDescription>
              Please provide your contact details and communication preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">
                  Basic Information
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cblName">CBL Name *</Label>
                    <Input
                      id="cblName"
                      value={formData.cblName}
                      onChange={(e) =>
                        updateFormData('cblName', e.target.value)
                      }
                      placeholder="e.g., OC Phil's Elite Squad"
                      className={errors.cblName ? 'border-red-500' : ''}
                    />
                    {errors.cblName && (
                      <p className="text-sm text-red-600">{errors.cblName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primaryContact">
                      Primary Contact Name *
                    </Label>
                    <Input
                      id="primaryContact"
                      value={formData.primaryContact}
                      onChange={(e) =>
                        updateFormData('primaryContact', e.target.value)
                      }
                      placeholder="Your full name"
                      className={errors.primaryContact ? 'border-red-500' : ''}
                    />
                    {errors.primaryContact && (
                      <p className="text-sm text-red-600">
                        {errors.primaryContact}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Primary Email Address *</Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    value={formData.emailAddress}
                    onChange={(e) =>
                      updateFormData('emailAddress', e.target.value)
                    }
                    placeholder="your-email@domain.com"
                    className={errors.emailAddress ? 'border-red-500' : ''}
                  />
                  {errors.emailAddress && (
                    <p className="text-sm text-red-600">
                      {errors.emailAddress}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryEmail">
                    Secondary Email (Optional)
                  </Label>
                  <Input
                    id="secondaryEmail"
                    type="email"
                    value={formData.secondaryEmail}
                    onChange={(e) =>
                      updateFormData('secondaryEmail', e.target.value)
                    }
                    placeholder="backup-email@domain.com"
                  />
                </div>
              </div>

              {/* Contact Methods */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">
                  Additional Contact Methods
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          updateFormData('phoneNumber', e.target.value)
                        }
                        placeholder="+1 (555) 123-4567"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platform">Primary Platform *</Label>
                    <Select
                      value={formData.platform}
                      onValueChange={(value) =>
                        updateFormData('platform', value)
                      }
                    >
                      <SelectTrigger
                        className={errors.platform ? 'border-red-500' : ''}
                      >
                        <SelectValue placeholder="Select your platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="telegram">Telegram</SelectItem>
                        <SelectItem value="discord">Discord</SelectItem>
                        <SelectItem value="twitter">Twitter/X</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="existing">
                          Existing Community
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.platform && (
                      <p className="text-sm text-red-600">{errors.platform}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telegramHandle">Telegram Handle</Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="telegramHandle"
                        value={formData.telegramHandle}
                        onChange={(e) =>
                          updateFormData('telegramHandle', e.target.value)
                        }
                        placeholder="@yourusername"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discordHandle">Discord Handle</Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="discordHandle"
                        value={formData.discordHandle}
                        onChange={(e) =>
                          updateFormData('discordHandle', e.target.value)
                        }
                        placeholder="username#1234"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CBL Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">
                  CBL Details
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="memberCount">Current Member Count</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="memberCount"
                        type="number"
                        min="0"
                        value={formData.memberCount || ''}
                        onChange={(e) =>
                          updateFormData(
                            'memberCount',
                            parseInt(e.target.value) || 0,
                          )
                        }
                        placeholder="0"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referralCode">Your Referral Code *</Label>
                    <Input
                      id="referralCode"
                      value={formData.referralCode}
                      onChange={(e) =>
                        updateFormData(
                          'referralCode',
                          e.target.value.toUpperCase(),
                        )
                      }
                      placeholder="YOURCODE2025"
                      className={errors.referralCode ? 'border-red-500' : ''}
                    />
                    {errors.referralCode && (
                      <p className="text-sm text-red-600">
                        {errors.referralCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Email Preferences */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">
                  Email Preferences
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emailNotifications"
                      checked={formData.preferences.emailNotifications}
                      onCheckedChange={(checked) =>
                        updatePreferences('emailNotifications', !!checked)
                      }
                    />
                    <Label htmlFor="emailNotifications" className="text-sm">
                      General email notifications
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="milestoneUpdates"
                      checked={formData.preferences.milestoneUpdates}
                      onCheckedChange={(checked) =>
                        updatePreferences('milestoneUpdates', !!checked)
                      }
                    />
                    <Label htmlFor="milestoneUpdates" className="text-sm">
                      Milestone achievement updates and rewards
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="systemAlerts"
                      checked={formData.preferences.systemAlerts}
                      onCheckedChange={(checked) =>
                        updatePreferences('systemAlerts', !!checked)
                      }
                    />
                    <Label htmlFor="systemAlerts" className="text-sm">
                      System alerts and important announcements
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="batchCommunications"
                      checked={formData.preferences.batchCommunications}
                      onCheckedChange={(checked) =>
                        updatePreferences('batchCommunications', !!checked)
                      }
                    />
                    <Label htmlFor="batchCommunications" className="text-sm">
                      Batch communications and community updates
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="promotionalEmails"
                      checked={formData.preferences.promotionalEmails}
                      onCheckedChange={(checked) =>
                        updatePreferences('promotionalEmails', !!checked)
                      }
                    />
                    <Label htmlFor="promotionalEmails" className="text-sm">
                      Promotional emails and special offers
                    </Label>
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) =>
                      updateFormData('agreedToTerms', !!checked)
                    }
                    className={errors.agreedToTerms ? 'border-red-500' : ''}
                  />
                  <Label htmlFor="agreedToTerms" className="text-sm leading-5">
                    I agree to receive emails from OC-Phil and understand that
                    my email will be stored securely. I can unsubscribe at any
                    time and my information will not be shared with third
                    parties. *
                  </Label>
                </div>
                {errors.agreedToTerms && (
                  <p className="text-sm text-red-600">{errors.agreedToTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting Email...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Submit Email Address
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Questions about email submissions? Contact support or reach out to
            OC-Phil directly.
          </p>
        </div>
      </div>
    </div>
  );
}
