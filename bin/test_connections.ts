import esClient from '../lib/es_client';
import kbnClient from '../lib/kbn_client';

async function main() {
  try {
    const esResponse = await esClient.get('/');
    if (esResponse.status === 200) {
      console.log('Connection to Elasticsearch is confirmed');
    } else {
      throw new Error(`Received non-200 response from ES: ${esResponse.status}`);
    }
  } catch (error: unknown) {
    console.log('Error while connecting to Elasticsearch:', error);
  }

  try {
    const kbnResponse = await kbnClient.get('/api/status');
    if (kbnResponse.status === 200) {
      console.log('Connection to Kibana API is confirmed');
    } else {
      throw new Error(`Received non-200 response from Kibana API: ${kbnResponse.status}`);
    }
  } catch (error: unknown) {
    console.log('Error while connecting to Kibana API:', error);
  }
}

main();