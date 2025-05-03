
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { LibSQLStore } from '@mastra/libsql';

import { weatherAgent, summaryAgent, travelAgent } from './agents';
import { travelAgentWorkflow } from './workflows'

export const mastra = new Mastra({
  agents: { weatherAgent, summaryAgent, travelAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  vnext_workflows: {
    travelAgentWorkflow,
  },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
