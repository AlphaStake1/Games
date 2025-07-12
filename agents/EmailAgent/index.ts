// agents/EmailAgent/index.ts
import * as nodemailer from 'nodemailer';
import { EventEmitter } from 'events';
import * as dotenv from 'dotenv';

dotenv.config();

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface WinnerNotification {
  recipient: string;
  gameId: number;
  amount: number;
  transactionId: string;
  finalScore: { home: number; away: number };
  squareIndex: number;
}

interface GameUpdate {
  recipients: string[];
  gameId: number;
  currentScore: { home: number; away: number; quarter: number };
  timeRemaining: string;
}

export class EmailAgent extends EventEmitter {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;
  private templates: Map<string, EmailTemplate> = new Map();

  constructor() {
    super();
    
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP configuration is required');
    }
    
    this.fromEmail = process.env.FROM_EMAIL || 'no-reply@footballsquares.app';
    
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // Proton Bridge uses STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // For local Proton Bridge
      },
    });

    this.initializeTemplates();
    console.log('EmailAgent initialized with Proton Bridge');
  }

  private initializeTemplates(): void {
    // Winner notification template
    this.templates.set('winner-notification', {
      subject: '🏆 Congratulations! You won Football Squares!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🏆 WINNER!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">You've won the Football Squares game!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Game Results</h2>
            <p><strong>Game ID:</strong> {{gameId}}</p>
            <p><strong>Final Score:</strong> {{homeScore}} - {{awayScore}}</p>
            <p><strong>Your Square:</strong> #{{squareIndex}}</p>
            <p><strong>Winning Amount:</strong> {{amount}} SOL</p>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #2d5a2d; margin-top: 0;">💰 Payout Details</h3>
            <p>Your winnings have been automatically transferred to your wallet!</p>
            <p><strong>Transaction ID:</strong> <a href="https://solscan.io/tx/{{transactionId}}" style="color: #667eea; text-decoration: none;">{{transactionId}}</a></p>
            <p><em>Click the link above to view your transaction on Solscan.</em></p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">Thank you for playing Football Squares!</p>
            <p style="color: #666; font-size: 14px;">
              <a href="{{unsubscribeUrl}}" style="color: #999;">Unsubscribe</a> from future notifications
            </p>
          </div>
        </div>
      `,
      text: `
🏆 CONGRATULATIONS! You won the Football Squares game!

Game ID: {{gameId}}
Final Score: {{homeScore}} - {{awayScore}}
Your Square: #{{squareIndex}}
Winning Amount: {{amount}} SOL

Your winnings have been automatically transferred to your wallet!
Transaction ID: {{transactionId}}
View on Solscan: https://solscan.io/tx/{{transactionId}}

Thank you for playing Football Squares!

To unsubscribe from future notifications, visit: {{unsubscribeUrl}}
      `
    });

    // Game update template
    this.templates.set('game-update', {
      subject: '🏈 Football Squares Game Update - Game {{gameId}}',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #2d5a2d; color: white; padding: 20px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🏈 Game Update</h1>
            <p style="margin: 10px 0 0 0;">Football Squares Game {{gameId}}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Current Score</h2>
            <div style="text-align: center; font-size: 48px; font-weight: bold; color: #2d5a2d; margin: 20px 0;">
              {{homeScore}} - {{awayScore}}
            </div>
            <p style="text-align: center; font-size: 18px; color: #666;">
              Quarter {{quarter}} • {{timeRemaining}} remaining
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">Stay tuned for the final results!</p>
            <p style="color: #666; font-size: 14px;">
              <a href="{{unsubscribeUrl}}" style="color: #999;">Unsubscribe</a> from future updates
            </p>
          </div>
        </div>
      `,
      text: `
🏈 Football Squares Game Update - Game {{gameId}}

Current Score: {{homeScore}} - {{awayScore}}
Quarter {{quarter}} • {{timeRemaining}} remaining

Stay tuned for the final results!

To unsubscribe from future updates, visit: {{unsubscribeUrl}}
      `
    });

    // Board creation confirmation template
    this.templates.set('board-created', {
      subject: '🎯 Your Football Squares Board is Ready!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #4a90e2; color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎯 Board Created!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Your Football Squares board is ready for action!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Game Details</h2>
            <p><strong>Game ID:</strong> {{gameId}}</p>
            <p><strong>Board Status:</strong> Open for square purchases</p>
            <p><strong>Square Price:</strong> 0.01 SOL each</p>
            <p><strong>Total Squares:</strong> 100</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{boardUrl}}" style="background: #4a90e2; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              View Your Board
            </a>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">⚠️ Important</h3>
            <p style="color: #856404; margin: 0;">Numbers will be randomly assigned to the board headers once the game starts. Make sure to purchase your squares before kickoff!</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">Good luck with your squares!</p>
            <p style="color: #666; font-size: 14px;">
              <a href="{{unsubscribeUrl}}" style="color: #999;">Unsubscribe</a> from future notifications
            </p>
          </div>
        </div>
      `,
      text: `
🎯 Your Football Squares Board is Ready!

Game ID: {{gameId}}
Board Status: Open for square purchases
Square Price: 0.01 SOL each
Total Squares: 100

View your board: {{boardUrl}}

⚠️ Important: Numbers will be randomly assigned to the board headers once the game starts. Make sure to purchase your squares before kickoff!

Good luck with your squares!

To unsubscribe from future notifications, visit: {{unsubscribeUrl}}
      `
    });
  }

  async sendWinnerNotification(notification: WinnerNotification): Promise<boolean> {
    try {
      const template = this.templates.get('winner-notification');
      if (!template) {
        throw new Error('Winner notification template not found');
      }

      const { html, text, subject } = this.replaceTemplateVariables(template, {
        gameId: notification.gameId.toString(),
        homeScore: notification.finalScore.home.toString(),
        awayScore: notification.finalScore.away.toString(),
        squareIndex: notification.squareIndex.toString(),
        amount: (notification.amount / 1_000_000_000).toFixed(2), // Convert lamports to SOL
        transactionId: notification.transactionId,
        unsubscribeUrl: this.generateUnsubscribeUrl(notification.recipient),
      });

      await this.transporter.sendMail({
        from: `"Football Squares" <${this.fromEmail}>`,
        to: notification.recipient,
        subject,
        html,
        text,
      });

      this.emit('emailSent', { 
        type: 'winner-notification', 
        recipient: notification.recipient,
        gameId: notification.gameId 
      });

      console.log(`Winner notification sent to ${notification.recipient} for game ${notification.gameId}`);
      return true;
    } catch (error) {
      console.error('Error sending winner notification:', error);
      this.emit('emailError', { 
        type: 'winner-notification', 
        recipient: notification.recipient,
        error 
      });
      return false;
    }
  }

  async sendGameUpdates(update: GameUpdate): Promise<{ sent: number; failed: number }> {
    const template = this.templates.get('game-update');
    if (!template) {
      throw new Error('Game update template not found');
    }

    let sent = 0;
    let failed = 0;

    const sendPromises = update.recipients.map(async (recipient) => {
      try {
        const { html, text, subject } = this.replaceTemplateVariables(template, {
          gameId: update.gameId.toString(),
          homeScore: update.currentScore.home.toString(),
          awayScore: update.currentScore.away.toString(),
          quarter: update.currentScore.quarter.toString(),
          timeRemaining: update.timeRemaining,
          unsubscribeUrl: this.generateUnsubscribeUrl(recipient),
        });

        await this.transporter.sendMail({
          from: `"Football Squares" <${this.fromEmail}>`,
          to: recipient,
          subject,
          html,
          text,
        });

        sent++;
      } catch (error) {
        console.error(`Error sending game update to ${recipient}:`, error);
        failed++;
      }
    });

    await Promise.all(sendPromises);

    this.emit('bulkEmailSent', { 
      type: 'game-update', 
      gameId: update.gameId,
      sent,
      failed 
    });

    console.log(`Game update sent: ${sent} successful, ${failed} failed for game ${update.gameId}`);
    return { sent, failed };
  }

  async sendBoardCreatedNotification(gameId: number, recipient: string, boardUrl: string): Promise<boolean> {
    try {
      const template = this.templates.get('board-created');
      if (!template) {
        throw new Error('Board created template not found');
      }

      const { html, text, subject } = this.replaceTemplateVariables(template, {
        gameId: gameId.toString(),
        boardUrl,
        unsubscribeUrl: this.generateUnsubscribeUrl(recipient),
      });

      await this.transporter.sendMail({
        from: `"Football Squares" <${this.fromEmail}>`,
        to: recipient,
        subject,
        html,
        text,
      });

      this.emit('emailSent', { 
        type: 'board-created', 
        recipient,
        gameId 
      });

      console.log(`Board created notification sent to ${recipient} for game ${gameId}`);
      return true;
    } catch (error) {
      console.error('Error sending board created notification:', error);
      this.emit('emailError', { 
        type: 'board-created', 
        recipient,
        error 
      });
      return false;
    }
  }

  private replaceTemplateVariables(template: EmailTemplate, variables: Record<string, string>): EmailTemplate {
    let html = template.html;
    let text = template.text;
    let subject = template.subject;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      html = html.replace(new RegExp(placeholder, 'g'), value);
      text = text.replace(new RegExp(placeholder, 'g'), value);
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
    }

    return { html, text, subject };
  }

  private generateUnsubscribeUrl(email: string): string {
    // In real implementation, this would generate a secure unsubscribe link
    const encodedEmail = encodeURIComponent(email);
    return `https://footballsquares.app/unsubscribe?email=${encodedEmail}`;
  }

  async testEmailConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email connection test successful');
      return true;
    } catch (error) {
      console.error('Email connection test failed:', error);
      return false;
    }
  }

  async getEmailStats(): Promise<{
    totalSent: number;
    totalFailed: number;
    successRate: number;
    recentActivity: Array<{ type: string; timestamp: Date; count: number }>;
  }> {
    // In real implementation, this would track email statistics
    // For now, return mock data
    return {
      totalSent: 1247,
      totalFailed: 23,
      successRate: 0.982,
      recentActivity: [
        { type: 'winner-notification', timestamp: new Date(), count: 5 },
        { type: 'game-update', timestamp: new Date(), count: 156 },
        { type: 'board-created', timestamp: new Date(), count: 12 },
      ],
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('EmailAgent health check failed:', error);
      return false;
    }
  }
}

export default EmailAgent;