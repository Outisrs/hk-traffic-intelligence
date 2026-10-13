import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "hktraffic",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-09-29",
    placement: { mode: "smart" },
    compatibilityFlags: ["nodejs_compat"],
    assets: { notFoundHandling: "none" },
    observability: {
      enabled: false,
      headSamplingRate: 1,
      redactQueryString: false,
      logs: {
        enabled: true,
        headSamplingRate: 1,
        invocationLogs: true,
        persist: true,
      },
      traces: {
        enabled: true,
        headSamplingRate: 1,
        persist: true,
      },
      issues: {
        enabled: false,
      },
    },
    env: {
      ASSETS: bindings.assets(),
      VISIT_COUNTS: bindings.kv({ id: "ea2bf48ea66347c0b80db8d92bb9a4a5" }),
    },
  }),
});
