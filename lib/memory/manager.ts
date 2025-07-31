/**
 * Memory Manager for character runtime
 * Handles memory operations for character persistence
 */

export interface MemoryRecord {
  id: string;
  characterId: string;
  scope: string;
  data: any;
  timestamp: number;
}

export class MemoryManager {
  private memories: Map<string, MemoryRecord> = new Map();

  constructor(private characterId: string) {}

  async store(scope: string, key: string, data: any): Promise<void> {
    const record: MemoryRecord = {
      id: `${scope}:${key}`,
      characterId: this.characterId,
      scope,
      data,
      timestamp: Date.now(),
    };
    this.memories.set(record.id, record);
  }

  async retrieve(scope: string, key: string): Promise<any> {
    const record = this.memories.get(`${scope}:${key}`);
    return record?.data;
  }

  async getByScope(scope: string): Promise<MemoryRecord[]> {
    return Array.from(this.memories.values()).filter(
      (record) =>
        record.scope === scope && record.characterId === this.characterId,
    );
  }

  async clear(scope?: string): Promise<void> {
    if (scope) {
      const keysToDelete = Array.from(this.memories.keys()).filter((key) =>
        key.startsWith(`${scope}:`),
      );
      keysToDelete.forEach((key) => this.memories.delete(key));
    } else {
      this.memories.clear();
    }
  }

  async ensureAccess(characterId: string, scope: string): Promise<void> {
    // Validate character has access to this scope
    if (characterId !== this.characterId) {
      throw new Error(
        `Character ${characterId} does not have access to this memory manager`,
      );
    }
    // In a real implementation, this might create or validate scope permissions
    console.log(`Memory access ensured for ${characterId} in scope: ${scope}`);
  }
}
