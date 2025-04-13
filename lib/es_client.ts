import axios from 'axios';
import https from 'https';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const { ES_API_KEY, ES_URL } = process.env;

const client = axios.create({
  baseURL: ES_URL,
  httpsAgent: httpsAgent,
  headers: {
    'Authorization': `ApiKey ${ES_API_KEY}`
  }
});

export default client;

