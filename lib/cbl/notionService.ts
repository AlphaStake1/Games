// Notion API Service for OC Phil Tips Integration
// Fetches content from Notion pages for CBL guidance

export interface NotionPage {
  id: string;
  title: string;
  url: string;
  lastEdited: string;
  content?: string;
}

export class NotionService {
  private token: string;
  private version: string;
  private baseUrl = 'https://api.notion.com/v1';

  constructor() {
    this.token = process.env.NOTION_TOKEN || '';
    this.version = process.env.NOTION_VERSION || '2022-06-28';

    if (!this.token) {
      console.warn('NOTION_TOKEN not found in environment variables');
    }
  }

  /**
   * Get page content from Notion
   */
  async getPageContent(pageId: string): Promise<NotionPage | null> {
    if (!this.token) {
      console.error('Notion token not configured');
      return null;
    }

    try {
      // Clean page ID (remove URL parts if full URL provided)
      const cleanPageId = this.extractPageId(pageId);

      // Get page metadata
      const pageResponse = await fetch(`${this.baseUrl}/pages/${cleanPageId}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Notion-Version': this.version,
          'Content-Type': 'application/json',
        },
      });

      if (!pageResponse.ok) {
        console.error(
          `Failed to fetch page ${cleanPageId}:`,
          pageResponse.statusText,
        );
        return null;
      }

      const pageData = await pageResponse.json();

      // Get page blocks (content)
      const blocksResponse = await fetch(
        `${this.baseUrl}/blocks/${cleanPageId}/children`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Notion-Version': this.version,
            'Content-Type': 'application/json',
          },
        },
      );

      let content = '';
      if (blocksResponse.ok) {
        const blocksData = await blocksResponse.json();
        content = this.parseBlocks(blocksData.results);
      }

      return {
        id: pageData.id,
        title: this.extractTitle(pageData),
        url: pageData.url,
        lastEdited: pageData.last_edited_time,
        content,
      };
    } catch (error) {
      console.error('Error fetching Notion page:', error);
      return null;
    }
  }

  /**
   * Search Notion pages by query
   */
  async searchPages(query: string): Promise<NotionPage[]> {
    if (!this.token) {
      console.error('Notion token not configured');
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Notion-Version': this.version,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          filter: {
            property: 'object',
            value: 'page',
          },
          sort: {
            direction: 'descending',
            timestamp: 'last_edited_time',
          },
        }),
      });

      if (!response.ok) {
        console.error('Failed to search Notion pages:', response.statusText);
        return [];
      }

      const data = await response.json();
      return data.results.map((page: any) => ({
        id: page.id,
        title: this.extractTitle(page),
        url: page.url,
        lastEdited: page.last_edited_time,
      }));
    } catch (error) {
      console.error('Error searching Notion pages:', error);
      return [];
    }
  }

  /**
   * Extract page ID from URL or return as-is if already clean
   */
  private extractPageId(pageIdOrUrl: string): string {
    // If it's a URL, extract the page ID
    if (pageIdOrUrl.includes('notion.so')) {
      const parts = pageIdOrUrl.split('-');
      return parts[parts.length - 1].replace(/[?#].*$/, '');
    }
    // Remove any dashes for API calls
    return pageIdOrUrl.replace(/-/g, '');
  }

  /**
   * Extract title from page object
   */
  private extractTitle(page: any): string {
    if (page.properties?.title?.title?.[0]?.plain_text) {
      return page.properties.title.title[0].plain_text;
    }
    if (page.properties?.Name?.title?.[0]?.plain_text) {
      return page.properties.Name.title[0].plain_text;
    }
    return 'Untitled';
  }

  /**
   * Parse Notion blocks into readable text
   */
  private parseBlocks(blocks: any[]): string {
    let content = '';

    for (const block of blocks) {
      switch (block.type) {
        case 'paragraph':
          if (block.paragraph?.rich_text) {
            content += this.parseRichText(block.paragraph.rich_text) + '\n\n';
          }
          break;

        case 'heading_1':
          if (block.heading_1?.rich_text) {
            content +=
              '# ' + this.parseRichText(block.heading_1.rich_text) + '\n\n';
          }
          break;

        case 'heading_2':
          if (block.heading_2?.rich_text) {
            content +=
              '## ' + this.parseRichText(block.heading_2.rich_text) + '\n\n';
          }
          break;

        case 'heading_3':
          if (block.heading_3?.rich_text) {
            content +=
              '### ' + this.parseRichText(block.heading_3.rich_text) + '\n\n';
          }
          break;

        case 'bulleted_list_item':
          if (block.bulleted_list_item?.rich_text) {
            content +=
              '• ' +
              this.parseRichText(block.bulleted_list_item.rich_text) +
              '\n';
          }
          break;

        case 'numbered_list_item':
          if (block.numbered_list_item?.rich_text) {
            content +=
              '1. ' +
              this.parseRichText(block.numbered_list_item.rich_text) +
              '\n';
          }
          break;

        case 'code':
          if (block.code?.rich_text) {
            content +=
              '```\n' + this.parseRichText(block.code.rich_text) + '\n```\n\n';
          }
          break;

        case 'quote':
          if (block.quote?.rich_text) {
            content +=
              '> ' + this.parseRichText(block.quote.rich_text) + '\n\n';
          }
          break;
      }
    }

    return content.trim();
  }

  /**
   * Parse rich text objects into plain text
   */
  private parseRichText(richText: any[]): string {
    return richText.map((item: any) => item.plain_text || '').join('');
  }

  /**
   * Test connection to Notion API
   */
  async testConnection(): Promise<boolean> {
    if (!this.token) {
      console.error('Notion token not configured');
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Notion-Version': this.version,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error testing Notion connection:', error);
      return false;
    }
  }

  /**
   * Get page URL from the configured playbook URLs
   */
  static getPlaybookUrl(platform: string, section?: string): string {
    const { NOTION_PLAYBOOK_URLS } = require('./ocPhilTipsIntegration');

    if (section && NOTION_PLAYBOOK_URLS.sections[platform]?.[section]) {
      return NOTION_PLAYBOOK_URLS.sections[platform][section];
    }

    return NOTION_PLAYBOOK_URLS[platform] || '';
  }
}

// Utility functions for OC Phil bot integration

/**
 * Get tip content for OC Phil responses
 */
export async function getTipContent(tipId: string): Promise<string | null> {
  const notionService = new NotionService();
  const { TIPS_DATABASE } = require('./ocPhilTipsIntegration');

  const tip = TIPS_DATABASE.find((t: any) => t.id === tipId);
  if (!tip) return null;

  const page = await notionService.getPageContent(tip.notionUrl);
  return page?.content || null;
}

/**
 * Search tips in Notion
 */
export async function searchNotionTips(query: string): Promise<NotionPage[]> {
  const notionService = new NotionService();
  return notionService.searchPages(query);
}

/**
 * Test if Notion integration is working
 */
export async function testNotionIntegration(): Promise<{
  connected: boolean;
  message: string;
}> {
  const notionService = new NotionService();
  const connected = await notionService.testConnection();

  return {
    connected,
    message: connected
      ? 'Notion integration working correctly!'
      : 'Notion integration failed - check your NOTION_TOKEN environment variable',
  };
}

// NotionService already exported above
