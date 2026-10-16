import {
  MasterComponent,
  CreateMasterComponentDto,
  UpdateMasterComponentDto,
} from '../../../shared/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
const LOCAL_STORAGE_COMPONENTS_KEY = 'lp_master_components_store';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.message || `Request failed with status ${res.status}`);
    }

    const json = await res.json();
    return json.data as T;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export class ComponentsApiClient {
  private static getLocalComponents(): MasterComponent[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_COMPONENTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private static saveLocalComponents(list: MasterComponent[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_STORAGE_COMPONENTS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save master components to localStorage:', e);
    }
  }

  static async getProjectComponents(projectId: string = 'proj_default'): Promise<MasterComponent[]> {
    try {
      const serverList = await request<MasterComponent[]>(`/projects/${projectId}/components`);
      this.saveLocalComponents(serverList);
      return serverList;
    } catch (err) {
      console.warn('API getProjectComponents unreachable, using local storage cache:', err);
      const local = this.getLocalComponents();
      if (local.length > 0) return local;

      // Seed fallback
      return [
        {
          id: 'comp_master_feature_card',
          projectId,
          name: 'Modern SaaS Feature Card',
          description: 'Card with badge, heading, description, and action button.',
          category: 'cards',
          schemaVersion: 1,
          rootType: 'component',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    }
  }

  static async createMasterComponent(dto: CreateMasterComponentDto): Promise<MasterComponent> {
    try {
      const created = await request<MasterComponent>(`/projects/${dto.projectId}/components`, {
        method: 'POST',
        body: JSON.stringify(dto),
      });
      const local = this.getLocalComponents();
      this.saveLocalComponents([created, ...local]);
      return created;
    } catch (err) {
      console.warn('API createMasterComponent unreachable, saving locally:', err);
      const newId = `comp_master_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const localComponent: MasterComponent = {
        id: newId,
        projectId: dto.projectId,
        name: dto.name,
        description: dto.description,
        category: dto.category || 'general',
        schemaVersion: 1,
        rootType: dto.rootType,
        blockData: dto.blockData,
        componentData: dto.componentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const local = this.getLocalComponents();
      this.saveLocalComponents([localComponent, ...local]);
      return localComponent;
    }
  }

  static async updateMasterComponent(id: string, dto: UpdateMasterComponentDto): Promise<MasterComponent> {
    try {
      const updated = await request<MasterComponent>(`/components/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dto),
      });
      const local = this.getLocalComponents().map((c) => (c.id === id ? updated : c));
      this.saveLocalComponents(local);
      return updated;
    } catch (err) {
      console.warn('API updateMasterComponent unreachable, updating locally:', err);
      const local = this.getLocalComponents();
      const existing = local.find((c) => c.id === id);
      const updated: MasterComponent = {
        ...(existing || {
          id,
          projectId: 'proj_default',
          name: dto.name || 'Component',
          category: dto.category || 'general',
          schemaVersion: 1,
          rootType: 'component',
          createdAt: new Date().toISOString(),
        }),
        name: dto.name !== undefined ? dto.name : (existing?.name || 'Component'),
        description: dto.description !== undefined ? dto.description : existing?.description,
        category: dto.category !== undefined ? dto.category : (existing?.category || 'general'),
        blockData: dto.blockData !== undefined ? dto.blockData : existing?.blockData,
        componentData: dto.componentData !== undefined ? dto.componentData : existing?.componentData,
        updatedAt: new Date().toISOString(),
      };
      this.saveLocalComponents(local.map((c) => (c.id === id ? updated : c)));
      return updated;
    }
  }

  static async deleteMasterComponent(id: string): Promise<boolean> {
    try {
      await request<{ success: boolean }>(`/components/${id}`, { method: 'DELETE' });
      const local = this.getLocalComponents().filter((c) => c.id !== id);
      this.saveLocalComponents(local);
      return true;
    } catch (err) {
      console.warn('API deleteMasterComponent unreachable, deleting locally:', err);
      const local = this.getLocalComponents().filter((c) => c.id !== id);
      this.saveLocalComponents(local);
      return true;
    }
  }
}
