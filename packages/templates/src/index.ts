import type { ModConfig } from '@necesse-modding/types';
import { basicTemplate } from './basic';
import { itemTemplate } from './item';
import { qolTemplate } from './qol';
import { emptyTemplate } from './empty';

export const templates: Record<string, (config: ModConfig) => Record<string, string>> = {
  basic: basicTemplate,
  item: itemTemplate,
  qol: qolTemplate,
  empty: emptyTemplate,
};
