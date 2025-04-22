import { isAxiosError } from "axios";
import kbnClient from "./kbn_client";
import path from "path";
import fs from "fs";
import {
  getTestMonitor,
  getTestPolicyName,
  getTestPrivateLocationName,
  getMonitorId,
} from "../data/test_monitor";
import { createMonitorPrivateLocation } from "./create_monitor_private_location";
import { saveEnvVariable } from "./utils";

export async function createTestMonitor() {
  const testPolicyName = getTestPolicyName();
  const testPrivateLocationName = getTestPrivateLocationName();
  const { agentPolicyId, privateLocationId } =
    await createMonitorPrivateLocation({
      testPolicyName,
      testPrivateLocationName,
    });

  process.env.TEST_AGENT_POLICY_ID = agentPolicyId;

  // create required test monitor
  try {
    const response = await kbnClient.post(
      "api/synthetics/monitors",
      {
        ...getTestMonitor(privateLocationId),
        tags: ["test", "obs-custom-roles-testing"],
      },
      { params: { internal: true } }
    );
    const id = response.data.id;
    saveEnvVariable("TEST_MONITOR_ID", id);
    console.log(
      `Environment variable TEST_MONITOR_ID saved to .env file: ${id}`
    );
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Failed to create test synthetics monitor:",
        error.response?.data
      );
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }

  return {
    agentPolicyId,
    testPolicyName,
    testPrivateLocationName,
  };
}
