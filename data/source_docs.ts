import apmLatencyDoc from "./apm_latency_doc.json";
import apmFailedTransactionRateDoc from "./apm_failed_transaction_rate_doc.json";
import syntheticsDoc from "./synthetics_doc.json";

interface DocumentGetter {
  ts: Date;
  dataStream: string;
}

interface GetSourceDocsArgs {
  ts: Date;
  dataStreams: {
    logs: string;
    metrics: string;
    apmRollupMetrics: string;
    apmLogs: string;
    synthetics: string;
  };
}

export function getSourceDocs({
  ts = new Date(),
  dataStreams,
}: GetSourceDocsArgs) {
  const { logs, metrics, apmRollupMetrics, synthetics } = dataStreams;

  return [
    ...getLogsBulk({ ts, dataStream: logs }),
    ...getMetricsBulk({ ts, dataStream: metrics }),
    ...getAPMBulk({ ts, dataStreams }),
    ...getSyntheticsBulk({ ts, dataStream: synthetics }),
  ];
}

export function getLogsBulk({ ts, dataStream }: DocumentGetter) {
  let i = 1;
  return [
    { create: { _index: dataStream } },
    {
      "@timestamp": ts.toISOString(),
      message: "Auto generated log message",
      "http.request.status_code": 403,
    },
  ];
}

export function getMetricsBulk({ ts, dataStream }: DocumentGetter) {
  return [
    { create: { _index: dataStream } },
    {
      "@timestamp": ts.toISOString(),
      "host.hostname": "my-host1",
      "host.name": "my-host1", // required for infra inventory UI
      "system.cpu.total.pct": 0.99, // used for canned alerts
      "system.cpu.total.norm.pct": 0.65, // powers CPU stats in hosts UI
      "metricset.name": "hostmetrics", // required for infra inventory UI
      "event.module": "system", // required for hosts UI
      "metricset.module": "system", // required for hosts UI
      "system.cpu.user.pct": 0.9, // powers CPU metric for infra inventory UI
      "system.cpu.system.pct": 0.9, // powers CPU metric for infra inventory UI
      "system.cpu.cores": 2, // powers CPU metric for infra inventory UI
    },
  ];
}

export function getAPMBulk({ ts, dataStreams }: GetSourceDocsArgs) {
  const timestampString = ts.toISOString();
  apmLatencyDoc["@timestamp"] = timestampString;
  apmFailedTransactionRateDoc["@timestamp"] = timestampString;

  return [
    { create: { _index: dataStreams.apmRollupMetrics } },
    apmLatencyDoc,
    { create: { _index: dataStreams.apmRollupMetrics } },
    apmFailedTransactionRateDoc,
    { create: { _index: dataStreams.apmLogs } },
    {
      "@timestamp": timestampString,
      message: "APM error log message",
      "processor.event": "error",
      "service.name": "opbeans-error_rate_alert",
    },
  ];
}

export function getSyntheticsBulk({ ts, dataStream }: DocumentGetter) {
  if (!process.env.TEST_MONITOR_ID) {
    throw new Error("TEST_MONITOR_ID is not set");
  }
  const timestampString = ts.toISOString();
  syntheticsDoc["@timestamp"] = timestampString;
  syntheticsDoc["monitor.id"] = process.env.TEST_MONITOR_ID;
  syntheticsDoc["config_id"] = process.env.TEST_MONITOR_ID;
  syntheticsDoc["observer.name"] = process.env.TEST_PRIVATE_LOCATION_ID;

  return [{ create: { _index: dataStream } }, syntheticsDoc];
}
