import { MasterComponent, ShadcnComponentInstance } from '../../../shared/types';
import { BlockItem } from '../components/builder/ElementorSidebar';

const createUniqueId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

/**
 * Replaces all IDs within a component tree with freshly generated IDs
 * while keeping internal references consistent.
 */
function deepCloneWithNewIds(comp: ShadcnComponentInstance): ShadcnComponentInstance {
  const newComp: ShadcnComponentInstance = {
    ...JSON.parse(JSON.stringify(comp)),
    id: createUniqueId(`comp_${comp.type.toLowerCase()}`),
  };
  if (comp.children && comp.children.length > 0) {
    newComp.children = comp.children.map(deepCloneWithNewIds);
  }
  return newComp;
}

export class ComponentInstanceEngine {
  /**
   * Instantiates a master component (Symbol) into a linked instance.
   */
  static instantiateMasterBlock(master: MasterComponent): BlockItem {
    if (master.rootType !== 'block' || !master.blockData) {
      throw new Error(`Master component '${master.name}' is not a block.`);
    }

    const cloned = JSON.parse(JSON.stringify(master.blockData));
    const newBlockId = createUniqueId('blk_symbol');

    // Re-scope component IDs inside columns
    const columns = (cloned.columnsContent || []).map((col: any) => ({
      ...col,
      id: createUniqueId('col'),
      components: (col.components || []).map(deepCloneWithNewIds),
    }));

    return {
      ...cloned,
      id: newBlockId,
      isMasterInstance: true,
      masterComponentId: master.id,
      content: {
        ...(cloned.content || {}),
        masterName: master.name,
      },
      columnsContent: columns,
      overrides: {},
    };
  }

  /**
   * Instantiates a component symbol into a column
   */
  static instantiateMasterComponent(master: MasterComponent): ShadcnComponentInstance {
    if (!master.componentData) {
      throw new Error(`Master component '${master.name}' has no component data.`);
    }

    const cloned = deepCloneWithNewIds(master.componentData);
    return {
      ...cloned,
      isMasterInstance: true,
      masterComponentId: master.id,
      overrides: {},
    };
  }

  /**
   * Detaches an instance from its master symbol, converting it into a standard independent element.
   */
  static detachBlockInstance(block: BlockItem): BlockItem {
    const next = { ...block };
    delete (next as any).isMasterInstance;
    delete (next as any).masterComponentId;
    delete (next as any).overrides;
    if (next.content) {
      delete next.content.masterName;
    }
    return next;
  }

  static detachComponentInstance(comp: ShadcnComponentInstance): ShadcnComponentInstance {
    const next = { ...comp };
    delete next.isMasterInstance;
    delete next.masterComponentId;
    delete next.overrides;
    return next;
  }

  /**
   * Propagates updates from a modified Master Component to all linked instances in the block tree.
   * Preserves per-instance content overrides.
   */
  static propagateMasterUpdate(blocks: BlockItem[], master: MasterComponent): BlockItem[] {
    const updateComponentTree = (list: ShadcnComponentInstance[]): ShadcnComponentInstance[] => {
      return list.map((comp) => {
        let currentComp = comp;
        if (comp.masterComponentId === master.id && master.componentData) {
          const overrides = comp.overrides || {};
          const baseMaster = JSON.parse(JSON.stringify(master.componentData));
          currentComp = {
            ...baseMaster,
            id: comp.id, // Preserve instance ID
            isMasterInstance: true,
            masterComponentId: master.id,
            overrides,
            // Apply local overrides
            props: {
              ...baseMaster.props,
              ...(overrides.props || {}),
            },
            styles: {
              ...baseMaster.styles,
              ...(overrides.styles || {}),
            },
          };
        }
        if (currentComp.children && currentComp.children.length > 0) {
          currentComp = {
            ...currentComp,
            children: updateComponentTree(currentComp.children),
          };
        }
        return currentComp;
      });
    };

    return blocks.map((b) => {
      // 1. If the block itself is a master instance
      if (b.masterComponentId === master.id && master.blockData) {
        const overrides = (b as any).overrides || {};
        return {
          ...JSON.parse(JSON.stringify(master.blockData)),
          id: b.id, // Preserve instance ID
          isMasterInstance: true,
          masterComponentId: master.id,
          overrides,
        };
      }

      // 2. If it's a container block, check its child components in columns
      if (b.type === 'CONTAINER') {
        const c = b as any;
        const newCols = (c.columnsContent || []).map((col: any) => ({
          ...col,
          components: updateComponentTree(col.components || []),
        }));
        return { ...b, columnsContent: newCols };
      }

      return b;
    });
  }
}
