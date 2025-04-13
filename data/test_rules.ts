// POST kbn:/api/alerting/rule

export const CUSTOM_ROLES_LOGS_DATA_VIEW_ID = "custom-roles-logs-data-view";

export default function getRules() {
  return RULES.map(rule => ({
    ...rule,
    tags: [...rule.tags, "test", "obs-custom-roles-testing"],
    name: `${rule.name} [obs custom roles testing]`
  }));
};

export interface RuleConfig<T = unknown> {
  tags: string[];
  params: T;
  schedule: {
    interval: string;
  }
  consumer: "alerts" | "logs" | "apm" | "infrastructure" | "stackAlerts" | "observability";
  name: string;
  rule_type_id: string;
  actions: unknown[];
  alert_delay: {
    active: number;
  }
}

const RULES: RuleConfig[] = [
  // Custom threshold (with rule scope / role visibility set to "logs")
  {
    "tags": [],
    "params": {
      "criteria": [
        {
          "comparator": ">",
          "metrics": [
            {
              "name": "A",
              "aggType": "count"
            }
          ],
          "threshold": [
            0
          ],
          "timeSize": 1,
          "timeUnit": "m"
        }
      ],
      "alertOnNoData": false,
      "alertOnGroupDisappear": false,
      "searchConfiguration": {
        "query": {
          "query": "",
          "language": "kuery"
        },
        "index": "custom-roles-logs-data-view"
      }
    },
    "schedule": {
      "interval": "1m"
    },
    "consumer": "logs",
    "name": "Custom threshold rule (role visibility: logs)",
    "rule_type_id": "observability.rules.custom_threshold",
    "actions": [],
    "alert_delay": {
      "active": 1
    }
  },
  // Custom threshold (with rule scope / role visibility set to "metrics")
  {
    "tags": [],
    "params": {
      "criteria": [
        {
          "comparator": ">",
          "metrics": [
            {
              "name": "A",
              "aggType": "count"
            }
          ],
          "threshold": [
            0
          ],
          "timeSize": 1,
          "timeUnit": "m"
        }
      ],
      "alertOnNoData": false,
      "alertOnGroupDisappear": false,
      "searchConfiguration": {
        "query": {
          "query": "",
          "language": "kuery"
        },
        "index": "custom-roles-logs-data-view"
      }
    },
    "schedule": {
      "interval": "1m"
    },
    "consumer": "infrastructure",
    "name": "Custom threshold rule (role visibility: metrics)",
    "rule_type_id": "observability.rules.custom_threshold",
    "actions": [],
    "alert_delay": {
      "active": 1
    }
  },
  // ES query rule (KQL) with role visibility "logs"
  {
    "tags": [],
    "params": {
      "searchConfiguration": {
        "query": {
          "query": "",
          "language": "kuery"
        },
        "index": "custom-roles-logs-data-view"
      },
      "timeField": "@timestamp",
      "searchType": "searchSource",
      "timeWindowSize": 30,
      "timeWindowUnit": "m",
      "threshold": [
        0
      ],
      "thresholdComparator": ">",
      "size": 10,
      "aggType": "count",
      "groupBy": "all",
      "termSize": 5,
      "excludeHitsFromPreviousRun": false,
      "sourceFields": [
        {
          "label": "host.name",
          "searchPath": "host.name"
        }
      ]
    },
    "schedule": {
      "interval": "1m"
    },
    "consumer": "logs",
    "name": "Elasticsearch query rule (role visibility: logs)",
    "rule_type_id": ".es-query",
    "actions": [],
    "alert_delay": {
      "active": 1
    }
  },
  // ES query rule (KQL) with role visibility "metrics"
  {
    "tags": [],
    "params": {
      "searchConfiguration": {
        "query": {
          "query": "",
          "language": "kuery"
        },
        "index": "custom-roles-logs-data-view"
      },
      "timeField": "@timestamp",
      "searchType": "searchSource",
      "timeWindowSize": 30,
      "timeWindowUnit": "m",
      "threshold": [
        0
      ],
      "thresholdComparator": ">",
      "size": 10,
      "aggType": "count",
      "groupBy": "all",
      "termSize": 5,
      "excludeHitsFromPreviousRun": false,
      "sourceFields": [
        {
          "label": "host.name",
          "searchPath": "host.name"
        }
      ]
    },
    "schedule": {
      "interval": "1m"
    },
    "consumer": "infrastructure",
    "name": "Elasticsearch query rule (role visibility: metrics)",
    "rule_type_id": ".es-query",
    "actions": [],
    "alert_delay": {
      "active": 1
    }
  },
  // APM latency threshold
  {
    "tags": [],
    "params": {
      "aggregationType": "avg",
      "threshold": 10,
      "windowSize": 5,
      "windowUnit": "m",
      "environment": "ENVIRONMENT_ALL"
    },
    "schedule": {
      "interval": "1m"
    },
    "consumer": "alerts",
    "name": "APM: Latency threshold",
    "rule_type_id": "apm.transaction_duration",
    "actions": [],
    "alert_delay": {
      "active": 1
    }
  }, 
  // APM failed transaction rate
  {
    "tags": [],
    "params": {
      "threshold": 30,
      "windowSize": 5,
      "windowUnit": "m",
      "environment": "ENVIRONMENT_ALL"
    },
    "schedule": {
      "interval": "1m"
    },
    "consumer": "alerts",
    "name": "APM: Failed transaction rate threshold",
    "rule_type_id": "apm.transaction_error_rate",
    "actions": [],
    "alert_delay": {
      "active": 1
    }
  },

  // APM error count threshold
  {
    "tags": [],
    "params": {
      "threshold": 0,
      "windowSize": 5,
      "windowUnit": "m",
      "environment": "ENVIRONMENT_ALL"
    },
    "schedule": {
      "interval": "1m"
    },
    "consumer": "alerts",
    "name": "APM: Error count threshold",
    "rule_type_id": "apm.error_rate",
    "actions": [],
    "alert_delay": {
      "active": 1
    }
  }
]

