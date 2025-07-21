import nodemailer from 'nodemailer';
import { EmailSubscription } from './emailSubscriptions';

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isDevelopment = process.env.NODE_ENV === 'development';

  constructor() {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    if (this.isDevelopment) {
      // Use ethereal email for development testing
      try {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        console.log('Development email service initialized with Ethereal');
      } catch (error) {
        console.warn(
          'Could not initialize Ethereal email service, using console logging',
        );
        this.transporter = null;
      }
    } else {
      // Production configuration for Proton Mail
      const protonConfig = {
        host: process.env.PROTON_SMTP_HOST || 'smtp.protonmail.com',
        port: parseInt(process.env.PROTON_SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.PROTON_EMAIL_USER,
          pass: process.env.PROTON_EMAIL_PASS,
        },
      };

      if (protonConfig.auth.user && protonConfig.auth.pass) {
        this.transporter = nodemailer.createTransport(protonConfig);
        console.log('Production email service initialized with Proton Mail');
      } else {
        console.warn(
          'Proton Mail credentials not configured, email service disabled',
        );
        this.transporter = null;
      }
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      // Log to console in development or when transporter is not available
      console.log('📧 Email Service - Would send email:');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('Content:', options.text || options.html);
      console.log('---');
      return true;
    }

    try {
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@footballsquares.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      if (this.isDevelopment) {
        console.log(
          '📧 Development email sent:',
          nodemailer.getTestMessageUrl(info),
        );
      }

      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async sendWelcomeEmail(email: string): Promise<boolean> {
    const template = this.getWelcomeEmailTemplate();
    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async sendBoardOpeningAlert(
    email: string,
    boardDetails: any,
  ): Promise<boolean> {
    const template = this.getBoardOpeningTemplate(boardDetails);
    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async sendWinnerAlert(email: string, winnerDetails: any): Promise<boolean> {
    const template = this.getWinnerTemplate(winnerDetails);
    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async sendBulkEmails(
    emails: string[],
    template: EmailTemplate,
  ): Promise<number> {
    let successCount = 0;

    for (const email of emails) {
      const success = await this.sendEmail({
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (success) {
        successCount++;
      }

      // Add a small delay to avoid overwhelming the SMTP server
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return successCount;
  }

  private getWelcomeEmailTemplate(): EmailTemplate {
    return {
      subject: '🏈 Welcome to Football Squares!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #002244;">Welcome to Football Squares!</h1>
          <p>Thanks for subscribing to our updates! You'll now receive:</p>
          <ul>
            <li>Weekly NFL Squares tips and strategies</li>
            <li>Alerts when new boards open</li>
            <li>Winner announcements and game results</li>
            <li>Exclusive fantasy football insights</li>
          </ul>
          <p>Ready to play? <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://footballsquares.com'}" style="color: #ed5925;">Join a game now!</a></p>
          <p style="color: #708090; font-size: 12px;">
            You're receiving this because you subscribed to Football Squares updates. 
            <a href="#" style="color: #708090;">Unsubscribe</a>
          </p>
        </div>
      `,
      text: `
        Welcome to Football Squares!
        
        Thanks for subscribing! You'll receive weekly tips, board alerts, and winner announcements.
        
        Ready to play? Visit ${process.env.NEXT_PUBLIC_APP_URL || 'https://footballsquares.com'}
      `,
    };
  }

  private getBoardOpeningTemplate(boardDetails: any): EmailTemplate {
    return {
      subject: '🚀 New Football Squares Board Open!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #002244;">New Board Available!</h1>
          <p>A new Football Squares board just opened:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">${boardDetails.game || 'NFL Game'}</h3>
            <p style="margin: 0;"><strong>Entry Fee:</strong> ${boardDetails.entryFee || 'Free'}</p>
            <p style="margin: 0;"><strong>Prize Pool:</strong> ${boardDetails.prizePool || 'TBD'}</p>
          </div>
          <p><a href="${boardDetails.url || '#'}" style="background: #ed5925; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Join Now</a></p>
          <p style="color: #708090; font-size: 12px;">
            <a href="#" style="color: #708090;">Unsubscribe</a> from board opening alerts
          </p>
        </div>
      `,
      text: `
        New Football Squares Board Open!
        
        Game: ${boardDetails.game || 'NFL Game'}
        Entry Fee: ${boardDetails.entryFee || 'Free'}
        Prize Pool: ${boardDetails.prizePool || 'TBD'}
        
        Join now: ${boardDetails.url || '#'}
      `,
    };
  }

  private getWinnerTemplate(winnerDetails: any): EmailTemplate {
    return {
      subject: '🎉 Football Squares Winner Announced!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #002244;">🎉 We Have a Winner!</h1>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">${winnerDetails.game || 'NFL Game'}</h3>
            <p style="margin: 0;"><strong>Final Score:</strong> ${winnerDetails.homeTeam || 'Home'} ${winnerDetails.homeScore || '0'} - ${winnerDetails.awayTeam || 'Away'} ${winnerDetails.awayScore || '0'}</p>
            <p style="margin: 0;"><strong>Winning Square:</strong> ${winnerDetails.winningSquare || 'TBD'}</p>
            <p style="margin: 0;"><strong>Prize:</strong> ${winnerDetails.prize || 'TBD'}</p>
          </div>
          <p>Congratulations to all participants! Ready for the next game?</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL || '#'}" style="background: #ed5925; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Play Again</a></p>
          <p style="color: #708090; font-size: 12px;">
            <a href="#" style="color: #708090;">Unsubscribe</a> from winner announcements
          </p>
        </div>
      `,
      text: `
        🎉 We Have a Winner!
        
        Game: ${winnerDetails.game || 'NFL Game'}
        Final Score: ${winnerDetails.homeTeam || 'Home'} ${winnerDetails.homeScore || '0'} - ${winnerDetails.awayTeam || 'Away'} ${winnerDetails.awayScore || '0'}
        Winning Square: ${winnerDetails.winningSquare || 'TBD'}
        Prize: ${winnerDetails.prize || 'TBD'}
        
        Play again: ${process.env.NEXT_PUBLIC_APP_URL || '#'}
      `,
    };
  }

  async healthCheck(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service health check failed:', error);
      return false;
    }
  }
}

// Singleton instance
let emailService: EmailService | null = null;

export function getEmailService(): EmailService {
  if (!emailService) {
    emailService = new EmailService();
  }
  return emailService;
}

export default EmailService;
