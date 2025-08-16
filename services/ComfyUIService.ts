import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { comfyUIConfig } from '../config/comfyui.config';

interface ComfyUIConfig {
  host: string;
  port: number;
  apiEndpoint?: string;
}

interface WorkflowNode {
  inputs: Record<string, any>;
  class_type: string;
  _meta?: {
    title: string;
  };
}

interface Workflow {
  [nodeId: string]: WorkflowNode;
}

interface QueuePromptResponse {
  prompt_id: string;
  number: number;
  node_errors?: Record<string, any>;
}

interface GenerationResult {
  images: Array<{
    filename: string;
    subfolder: string;
    type: string;
    url?: string;
    data?: Buffer;
  }>;
  prompt_id: string;
  status: 'success' | 'error';
  error?: string;
}

export class ComfyUIService {
  private config: ComfyUIConfig;
  private ws: WebSocket | null = null;
  private activePrompts: Map<
    string,
    {
      resolve: (result: GenerationResult) => void;
      reject: (error: Error) => void;
    }
  > = new Map();

  constructor(config?: Partial<ComfyUIConfig>) {
    this.config = {
      host: process.env.COMFYUI_HOST || 'localhost',
      port: parseInt(process.env.COMFYUI_PORT || '8188'),
      apiEndpoint: process.env.COMFYUI_API_ENDPOINT,
      ...config,
    };
  }

  private get baseUrl(): string {
    return `http://${this.config.host}:${this.config.port}`;
  }

  private async connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      const clientId = uuidv4();
      this.ws = new WebSocket(
        `ws://${this.config.host}:${this.config.port}/ws?clientId=${clientId}`,
      );

      this.ws.on('open', () => {
        console.log('✅ Connected to ComfyUI WebSocket');
        resolve();
      });

      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      this.ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      });

      this.ws.on('close', () => {
        console.log('WebSocket connection closed');
        this.ws = null;
      });
    });
  }

  private handleWebSocketMessage(message: any): void {
    const { type, data } = message;

    if (type === 'executing' && data.node === null) {
      // Workflow execution completed
      const promptId = data.prompt_id;
      const handler = this.activePrompts.get(promptId);

      if (handler) {
        // Fetch the generated images
        this.getGeneratedImages(promptId)
          .then((images) => {
            handler.resolve({
              images,
              prompt_id: promptId,
              status: 'success',
            });
            this.activePrompts.delete(promptId);
          })
          .catch((error) => {
            handler.reject(error);
            this.activePrompts.delete(promptId);
          });
      }
    } else if (type === 'execution_error') {
      const promptId = data.prompt_id;
      const handler = this.activePrompts.get(promptId);

      if (handler) {
        handler.resolve({
          images: [],
          prompt_id: promptId,
          status: 'error',
          error: data.exception_message,
        });
        this.activePrompts.delete(promptId);
      }
    }
  }

  private async getGeneratedImages(promptId: string): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/history/${promptId}`);
    const history = await response.json();

    const images = [];
    const promptHistory = history[promptId];

    if (promptHistory && promptHistory.outputs) {
      for (const nodeId in promptHistory.outputs) {
        const nodeOutput = promptHistory.outputs[nodeId];
        if (nodeOutput.images) {
          for (const image of nodeOutput.images) {
            images.push({
              filename: image.filename,
              subfolder: image.subfolder,
              type: image.type,
              url: `${this.baseUrl}/view?filename=${image.filename}&subfolder=${image.subfolder}&type=${image.type}`,
            });
          }
        }
      }
    }

    return images;
  }

  async queuePrompt(
    workflow: Workflow,
    clientId?: string,
  ): Promise<QueuePromptResponse> {
    const prompt = {
      prompt: workflow,
      client_id: clientId || uuidv4(),
    };

    const response = await fetch(`${this.baseUrl}/prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prompt),
    });

    if (!response.ok) {
      throw new Error(`Failed to queue prompt: ${response.statusText}`);
    }

    return await response.json();
  }

  async generateImage(workflow: Workflow): Promise<GenerationResult> {
    await this.connectWebSocket();

    const response = await this.queuePrompt(workflow);

    if (response.node_errors && Object.keys(response.node_errors).length > 0) {
      return {
        images: [],
        prompt_id: response.prompt_id,
        status: 'error',
        error: JSON.stringify(response.node_errors),
      };
    }

    return new Promise((resolve, reject) => {
      this.activePrompts.set(response.prompt_id, { resolve, reject });

      // Set timeout for generation
      setTimeout(() => {
        if (this.activePrompts.has(response.prompt_id)) {
          this.activePrompts.delete(response.prompt_id);
          reject(new Error('Image generation timeout'));
        }
      }, comfyUIConfig.timeouts.generation); // Use configured timeout
    });
  }

  async uploadImage(imagePath: string, name?: string): Promise<string> {
    const formData = new FormData();
    const imageBuffer = fs.readFileSync(imagePath);
    const imageName = name || path.basename(imagePath);

    formData.append('image', imageBuffer, imageName);

    const response = await fetch(`${this.baseUrl}/upload/image`, {
      method: 'POST',
      body: formData as any,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const result = await response.json();
    return result.name;
  }

  async getImage(
    filename: string,
    subfolder: string = '',
    type: string = 'output',
  ): Promise<Buffer> {
    const response = await fetch(
      `${this.baseUrl}/view?filename=${filename}&subfolder=${subfolder}&type=${type}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to get image: ${response.statusText}`);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  async interrupt(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/interrupt`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to interrupt: ${response.statusText}`);
    }
  }

  async getQueue(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/queue`);

    if (!response.ok) {
      throw new Error(`Failed to get queue: ${response.statusText}`);
    }

    return await response.json();
  }

  async getSystemStats(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/system_stats`);

    if (!response.ok) {
      throw new Error(`Failed to get system stats: ${response.statusText}`);
    }

    return await response.json();
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default ComfyUIService;
