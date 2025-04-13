import esClient from './es_client';
import { getSourceDocs } from '../data/source_docs';
import { isAxiosError } from 'axios';

export async function ingestDocuments() {
  const bulk = getSourceDocs({ ts: new Date(), dataStreams: {
    logs: 'logs-custom_roles_testing-default',
    metrics: 'metrics-custom_roles_testing-default',
    apmRollupMetrics: 'metrics-apm.transaction.1m-default',
    apmLogs: "logs-apm.test-default"
  }});

  try {
    const data = bulk.map(row => JSON.stringify(row)).join('\n') + "\n"; // terminate with a new line
    console.log("Sending data:", data);
    const response = await esClient.post('/_bulk', data, {
      headers: { 'Content-Type': 'application/x-ndjson' }
    });

    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error(`An error occurred while posting to ES`);
      return error.response.data;
    } else {
      throw error;
    }
  }
}