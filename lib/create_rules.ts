import { AxiosError, AxiosResponse, isAxiosError } from "axios";
import getRules, { CUSTOM_ROLES_LOGS_DATA_VIEW_ID, RuleConfig } from "../data/test_rules";
import kbnClient from './kbn_client';

interface CreateRuleResponse {
  rule: RuleConfig;
  response: Pick<AxiosResponse, "data" | "status">;
}

interface CreateRuleErrorResponse {
  rule: RuleConfig;
  error: Pick<AxiosError["response"], "data" | "status">;
}



export async function createRules() {
  // create required data view
  await kbnClient.post('/api/data_views/data_view', {
    "data_view": {
      "name": "Logs Data View",
      "title": "logs-*",
      "id": CUSTOM_ROLES_LOGS_DATA_VIEW_ID,
      "timeFieldName": "@timestamp"
    },
    "override": true
  });
  console.log("Default logs-* data view created");

  const rules = getRules();
  const results: CreateRuleResponse[] = [];
  const errors: CreateRuleErrorResponse[] = [];

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    console.log(`About to create ${rule.name}`);

    try {
      const response = await kbnClient.post('/api/alerting/rule', rule);
      if (response.status >= 400) {
        throw new AxiosError(`Custom-made axios error while creating ${rule.name}`, String(response.status));
      }
      const { data, status } = response;
      results.push({ rule, response: { data, status } });
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const { data, status } = error.response;
        errors.push({ rule, error: { data, status } });
      }
      throw error;
    }
  }

  return { results, errors };
}