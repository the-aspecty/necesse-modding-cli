import * as path from 'node:path';
import * as os from 'node:os';

export function getDefaultGameDirectory(): string {
  const platform = os.platform();

  if (platform === 'win32') {
    return 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Necesse';
  }
  if (platform === 'darwin') {
    return path.join(os.homedir(), 'Library/Application Support/Steam/steamapps/common/Necesse');
  }
  return path.join(os.homedir(), '.steam/steam/steamapps/common/Necesse');
}

export * from './modDetector.js';
