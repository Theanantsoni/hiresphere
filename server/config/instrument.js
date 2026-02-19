// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"
import {nodeProfileIntegration} from "@sentry/profiling-node";
import { Profiler } from "react";

Sentry.init({
  dsn: "https://8a1d23cf262bb6669f5cad7d1f5bab41@o4510914047049728.ingest.us.sentry.io/4510914050523136",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,

  integrations: [
    nodeProfileIntegration(),
    Sentry.mongooseIntegration()
  ],

  //Tracing
//   tracesSampleRate: 1.0
});

Sentry.profiler.startProfiler();