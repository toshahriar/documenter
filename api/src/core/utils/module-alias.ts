import { addAliases } from 'module-alias';
import path from 'path';

addAliases({
  '@': path.resolve(__dirname, '../../'),
});

export {};
