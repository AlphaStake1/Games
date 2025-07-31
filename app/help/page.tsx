'use client';
import React, { useState } from 'react';

// Issue types and their corresponding field configurations
const ISSUE_TYPES = {
  wallet: {
    name: 'Wallet Connection Issues',
    fields: ['name', 'email', 'walletType', 'transactionHash', 'issue'],
    icon: '🔐',
  },
  transaction: {
    name: 'Transaction Problems',
    fields: ['name', 'email', 'transactionHash', 'amount', 'issue'],
    icon: '💸',
  },
  squares: {
    name: 'Football Squares Issues',
    fields: ['name', 'email', 'squareNumber', 'gameId', 'issue'],
    icon: '🏈',
  },
  account: {
    name: 'Account & Login Issues',
    fields: ['name', 'email', 'username', 'issue'],
    icon: '👤',
  },
  general: {
    name: 'General Support',
    fields: ['name', 'email', 'issue'],
    icon: '❓',
  },
};

// Enhanced Reviva bot with better styling and dynamic responses
const RevivaBot = ({
  step,
  issueType,
}: {
  step: number;
  issueType: string;
}) => {
  const getStepMessage = () => {
    const messages = {
      0: "Hey there, I'm Trainer Reviva! 🌱 I'm here to help heal your journey. First, what type of issue are you experiencing?",
      1: "Perfect! Now, what's your name so I can personalize your support experience?",
      2: 'Awesome, thank you! Could you share your email? Coach B will use it to follow up with healing solutions.',
      3:
        issueType === 'wallet'
          ? 'Great! Which wallet are you using? (Phantom, Solflare, etc.)'
          : issueType === 'transaction'
            ? 'Thanks! Please paste your transaction hash - this helps me diagnose the issue.'
            : issueType === 'squares'
              ? "Nice! What's your square number or game details?"
              : issueType === 'account'
                ? "Got it! What's your username or account identifier?"
                : "Understood! Let's get some more details about your situation.",
      4: "Almost there! Please describe what happened in detail. I'll prepare a comprehensive digital med-kit for Coach B.",
      5: "All set! 🎯 I've logged your info and created a healing plan. Coach B will reach out from Coach-B@tutamail.com soon. Remember: every challenge is just growth in disguise! ✨",
    };
    return messages[step as keyof typeof messages] || messages[0];
  };

  return (
    <div className="reviva-bot">
      <div className="bot-avatar">
        <div className="avatar-circle">
          <img
            src="/Assets/Trainer Reviva1.jpg"
            alt="Trainer Reviva"
            className="bot-image"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const sibling = e.currentTarget.nextElementSibling as HTMLElement;
              if (sibling) {
                sibling.style.display = 'flex';
              }
            }}
          />
          <span className="bot-icon" style={{ display: 'none' }}>
            🌱
          </span>
        </div>
        <div className="status-dot"></div>
      </div>
      <div className="bot-message">
        <div className="bot-header">
          <strong>Trainer Reviva</strong>
          <span className="bot-status">● Online</span>
        </div>
        <div className="message-bubble">{getStepMessage()}</div>
      </div>

      <style jsx>{`
        .reviva-bot {
          position: fixed;
          left: 20px;
          bottom: 20px;
          z-index: 1000;
          width: 340px;
          max-width: 85vw;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 16px;
          color: white;
          font-family:
            -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: flex-start;
          gap: 12px;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .bot-avatar {
          position: relative;
          flex-shrink: 0;
        }

        .avatar-circle {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          overflow: hidden;
        }

        .bot-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .status-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: #4ade80;
          border-radius: 50%;
          border: 2px solid white;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .bot-message {
          flex: 1;
        }

        .bot-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }

        .bot-status {
          font-size: 12px;
          color: #4ade80;
          font-weight: 500;
        }

        .message-bubble {
          background: rgba(255, 255, 255, 0.95);
          color: #374151;
          padding: 12px;
          border-radius: 10px;
          line-height: 1.4;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 480px) {
          .reviva-bot {
            width: 300px;
            max-width: 80vw;
            padding: 12px;
            gap: 10px;
            left: 10px;
            bottom: 10px;
          }

          .avatar-circle {
            width: 42px;
            height: 42px;
            font-size: 18px;
          }

          .status-dot {
            width: 10px;
            height: 10px;
            bottom: 1px;
            right: 1px;
          }

          .bot-header {
            gap: 4px;
            margin-bottom: 4px;
          }

          .bot-header strong {
            font-size: 14px;
          }

          .bot-status {
            font-size: 10px !important;
          }

          .message-bubble {
            padding: 10px;
            border-radius: 8px;
            font-size: 13px;
            line-height: 1.3;
          }
        }
      `}</style>
    </div>
  );
};

// Dynamic form field component
const DynamicField = ({
  field,
  value,
  onChange,
  onFocus,
  issueType,
}: {
  field: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onFocus: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  issueType: string;
}) => {
  const getFieldConfig = (fieldName: string) => {
    const configs: Record<
      string,
      { label: string; type: string; placeholder: string; options?: string[] }
    > = {
      name: {
        label: 'Full Name',
        type: 'text',
        placeholder: 'Enter your full name',
      },
      email: {
        label: 'Email Address',
        type: 'email',
        placeholder: 'your@email.com',
      },
      walletType: {
        label: 'Wallet Type',
        type: 'select',
        placeholder: 'Select your wallet',
        options: [
          'Phantom',
          'Solflare',
          'Coinbase Wallet',
          'Trust Wallet',
          'MetaMask',
          'Other',
        ],
      },
      transactionHash: {
        label: 'Transaction Hash',
        type: 'text',
        placeholder: 'Paste your transaction hash here',
      },
      amount: {
        label: 'Transaction Amount',
        type: 'text',
        placeholder: 'e.g., 0.1 SOL or $50',
      },
      squareNumber: {
        label: 'Square Number',
        type: 'text',
        placeholder: 'e.g., Square #25, Row 3 Col 5',
      },
      gameId: {
        label: 'Game ID',
        type: 'text',
        placeholder: 'Game identifier or week number',
      },
      username: {
        label: 'Username',
        type: 'text',
        placeholder: 'Your account username',
      },
      issue: {
        label: 'Describe Your Issue',
        type: 'textarea',
        placeholder:
          "Please provide detailed information about the problem you're experiencing...",
      },
    };
    return (
      configs[fieldName] || { label: fieldName, type: 'text', placeholder: '' }
    );
  };

  const config = getFieldConfig(field);

  if (config.type === 'select') {
    return (
      <div className="form-group">
        <label>{config.label}</label>
        <select
          name={field}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          required
        >
          <option value="">{config.placeholder}</option>
          {config.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (config.type === 'textarea') {
    return (
      <div className="form-group">
        <label>{config.label}</label>
        <textarea
          name={field}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          required
          rows={4}
          placeholder={config.placeholder}
        />
      </div>
    );
  }

  return (
    <div className="form-group">
      <label>{config.label}</label>
      <input
        type={config.type}
        name={field}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        required
        placeholder={config.placeholder}
      />
    </div>
  );
};

export default function HelpPage() {
  const [selectedIssueType, setSelectedIssueType] = useState('');
  const [form, setForm] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0);

  const handleIssueTypeSelect = (type: string) => {
    setSelectedIssueType(type);
    setStep(1);
    setForm({});
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (!selectedIssueType) return;
    const fields =
      ISSUE_TYPES[selectedIssueType as keyof typeof ISSUE_TYPES].fields;
    const fieldIndex = fields.indexOf(name);
    if (fieldIndex >= 0) {
      setStep(Math.min(fieldIndex + 2, fields.length + 1));
    }
  };

  const handleFocus = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    if (!selectedIssueType) return;
    const fields =
      ISSUE_TYPES[selectedIssueType as keyof typeof ISSUE_TYPES].fields;
    const fieldIndex = fields.indexOf(e.target.name);
    if (fieldIndex >= 0) {
      setStep(fieldIndex + 2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setStep(5);

    // Here you could send the data to your API
    console.log('Support ticket submitted:', {
      issueType: selectedIssueType,
      ...form,
    });
  };

  const resetForm = () => {
    setSelectedIssueType('');
    setForm({});
    setSubmitted(false);
    setStep(0);
  };

  return (
    <>
      <div className="help-page">
        <div className="container">
          <div className="header">
            <h1>🏥 Technical Support Center</h1>
            <p className="subtitle">
              Get personalized help from Trainer Reviva and our support team.
              We're here to heal your digital journey!
            </p>
          </div>

          {!selectedIssueType && !submitted && (
            <div className="issue-selector">
              <h2>What can we help you with today?</h2>
              <div className="issue-grid">
                {Object.entries(ISSUE_TYPES).map(([key, type]) => (
                  <button
                    key={key}
                    className="issue-card"
                    onClick={() => handleIssueTypeSelect(key)}
                  >
                    <span className="issue-icon">{type.icon}</span>
                    <span className="issue-name">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedIssueType && !submitted && (
            <div className="support-form">
              <div className="form-header">
                <h2>
                  {
                    ISSUE_TYPES[selectedIssueType as keyof typeof ISSUE_TYPES]
                      .icon
                  }{' '}
                  {
                    ISSUE_TYPES[selectedIssueType as keyof typeof ISSUE_TYPES]
                      .name
                  }
                </h2>
                <button className="change-type" onClick={resetForm}>
                  Change Issue Type
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {ISSUE_TYPES[
                  selectedIssueType as keyof typeof ISSUE_TYPES
                ].fields.map((field) => (
                  <DynamicField
                    key={field}
                    field={field}
                    value={form[field] || ''}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    issueType={selectedIssueType}
                  />
                ))}

                <button type="submit" className="submit-btn">
                  🚀 Submit Support Request
                </button>
              </form>
            </div>
          )}

          {submitted && (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h2>Support Request Submitted!</h2>
              <p>
                Thank you! Trainer Reviva has received your{' '}
                <strong>{selectedIssueType}</strong> support request. Coach B
                will contact you at <strong>{form.email}</strong> with healing
                solutions.
              </p>
              <p className="ticket-info">
                Your ticket has been logged and prioritized based on the issue
                type. Average response time: <strong>2-4 hours</strong>
              </p>
              <button className="new-ticket-btn" onClick={resetForm}>
                Submit Another Ticket
              </button>
            </div>
          )}
        </div>
      </div>

      {(selectedIssueType || submitted) && (
        <RevivaBot step={step} issueType={selectedIssueType} />
      )}

      <style jsx>{`
        .help-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 40px 20px;
          font-family:
            -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header h1 {
          font-size: 36px;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 16px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .subtitle {
          font-size: 18px;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .issue-selector {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .issue-selector h2 {
          text-align: center;
          color: #1f2937;
          margin-bottom: 32px;
          font-size: 24px;
        }

        .issue-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .issue-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          padding: 24px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          font-weight: 600;
        }

        .issue-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .issue-icon {
          font-size: 32px;
        }

        .issue-name {
          font-size: 16px;
          text-align: center;
        }

        .support-form {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .form-header h2 {
          color: #1f2937;
          font-size: 24px;
          margin: 0;
        }

        .change-type {
          background: #f3f4f6;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          color: #6b7280;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .change-type:hover {
          background: #e5e7eb;
        }

        .form-group {
          margin-bottom: 28px;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
          font-size: 16px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.2s;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        .submit-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          padding: 16px 32px;
          color: white;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .success-message {
          background: white;
          border-radius: 16px;
          padding: 48px 32px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .success-icon {
          font-size: 64px;
          margin-bottom: 24px;
        }

        .success-message h2 {
          color: #059669;
          font-size: 28px;
          margin-bottom: 16px;
        }

        .success-message p {
          color: #6b7280;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .ticket-info {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          padding: 16px;
          color: #166534 !important;
        }

        .new-ticket-btn {
          background: #059669;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          margin-top: 24px;
          transition: background 0.2s;
        }

        .new-ticket-btn:hover {
          background: #047857;
        }

        @media (max-width: 768px) {
          .help-page {
            padding: 20px 16px;
          }

          .header h1 {
            font-size: 28px;
          }

          .subtitle {
            font-size: 16px;
          }

          .issue-grid {
            grid-template-columns: 1fr;
          }

          .form-header {
            flex-direction: column;
            align-items: stretch;
          }

          .support-form,
          .issue-selector,
          .success-message {
            padding: 24px;
          }
        }
      `}</style>
    </>
  );
}
