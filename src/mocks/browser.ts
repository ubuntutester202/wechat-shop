import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// 设置service worker
export const worker = setupWorker(...handlers); 