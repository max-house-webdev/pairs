'use strict';

import { pairsApp } from './pairsApp.js';

const ROOT = document.getElementById('root');

document.addEventListener('DOMContentLoaded', () => {
  const mount = pairsApp.createMount(ROOT);
  pairsApp.createApp(mount);
});
