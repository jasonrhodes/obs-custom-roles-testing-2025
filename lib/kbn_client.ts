import axios from "axios";
const { ES_API_KEY, KBN_URL } = process.env;

const kibanaClient = axios.create({
  baseURL: KBN_URL,
  headers: {
    'Authorization': `ApiKey ${ES_API_KEY}`,
    'kbn-xsrf': 'custom-roles-testing-script'
  }
});

export default kibanaClient;