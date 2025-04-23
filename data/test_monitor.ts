import { v4 as uuidv4 } from "uuid";
export const getMonitorId = () => `test-monitor-id`;
export const getTestPolicyName = () => `Test agent policy ${uuidv4()}`;
export const getTestPrivateLocationName = () =>
  `Test private location ${uuidv4()}`;
export const getAgentPolicyId = () => process.env.TEST_AGENT_POLICY_ID;
export const getTestMonitor = (privateLocationId: string) => ({
  type: "http",
  form_monitor_type: "http",
  enabled: true,
  alert: {
    status: {
      enabled: true,
    },
    tls: {
      enabled: true,
    },
  },
  schedule: {
    number: "1",
    unit: "m",
  },
  "service.name": "",
  tags: [],
  timeout: "16",
  name: `Test monitor ${uuidv4()}`,
  locations: [
    {
      id: privateLocationId,
      label: "TEST_PRIVATE_LOCATION_NAME",
      isServiceManaged: false,
    },
  ],
  namespace: "default",
  origin: "ui",
  journey_id: "",
  hash: "",
  params: "",
  labels: {},
  max_attempts: 2,
  revision: 1,
  __ui: {
    is_tls_enabled: false,
  },
  urls: "htttps://www.willcreateanerror.com",
  max_redirects: "0",
  "url.port": null,
  password: "",
  proxy_url: "",
  proxy_headers: {},
  "check.response.body.negative": [],
  "check.response.body.positive": [],
  "check.response.json": [],
  "response.include_body": "on_error",
  "check.response.headers": {},
  "response.include_headers": true,
  "check.response.status": [],
  "check.request.body": {
    type: "text",
    value: "",
  },
  "check.request.headers": {},
  "check.request.method": "GET",
  username: "",
  mode: "any",
  "response.include_body_max_bytes": "1024",
  ipv4: true,
  ipv6: true,
  "ssl.certificate_authorities": "",
  "ssl.certificate": "",
  "ssl.key": "",
  "ssl.key_passphrase": "",
  "ssl.verification_mode": "full",
  "ssl.supported_protocols": ["TLSv1.1", "TLSv1.2", "TLSv1.3"],
});
