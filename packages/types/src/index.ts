export interface ModConfig {
  modName: string;
  modId: string;
  author: string;
  description: string;
  gameDirectory: string;
  gameVersion: string;
  modVersion: string;
  clientside: boolean;
  template: 'basic' | 'item' | 'qol' | 'empty';
  outputDir: string;
  includeVSCode: boolean;
  initGit: boolean;
  includeWrapper?: boolean;
}
