import { isAxiosError } from "axios";
import kbnClient from "./kbn_client";
import { getAgentPolicyId, getMonitorId } from "../data/test_monitor";
import { saveEnvVariable } from "./utils";

export async function createMonitorPrivateLocation({
  testPolicyName,
  testPrivateLocationName,
}: {
  testPolicyName: string;
  testPrivateLocationName: string;
}) {
  // create required test private location for synthetics rules
  // try delete existing agent policy
  const agentPolicyId = getAgentPolicyId();
  let privateLocationId: string;

  // try removing any existing monitors
  if (process.env.TEST_MONITOR_ID) {
    try {
      const response = await kbnClient.post(
        "api/synthetics/monitors/_bulk_delete",
        {
          ids: [process.env.TEST_MONITOR_ID],
        }
      );
      console.log("Test synthetics monitor deleted");
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        console.log("Existing monitor not found, creating one");
      } else if (isAxiosError(error)) {
        console.error(
          "Failed to delete test synthetics monitor:",
          error.response?.data
        );
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  }

  // try deleting any previous agent policies
  try {
    console.log("Deleted existing agent policy");
    await kbnClient.post("api/fleet/agent_policies/delete", {
      agentPolicyId,
      force: true,
    });
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      console.error("Agent policy does not exist. Creating one.");
    } else if (isAxiosError(error)) {
      console.error(
        "Failed to delete existing agent policy:",
        error.response?.data
      );
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
  try {
    console.log("Creating new agent policy");
    await kbnClient.post("api/fleet/agent_policies", {
      name: testPolicyName,
      id: getAgentPolicyId(),
      description: "",
      namespace: "default",
      monitoring_enabled: ["logs", "metrics"],
      inactivity_timeout: 1209600,
      is_protected: false,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Failed to create test agent policy:",
        error.response?.data
      );
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }

  // try getting private locations
  try {
    console.log("Getting private locations");
    const response = await kbnClient.get(
      "http://localhost:5601/api/synthetics/private_locations"
    );
    privateLocationId = response.data?.find(
      (item) => item.agentPolicyId === agentPolicyId
    )?.id;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Failed to get test private locations:",
        error.response?.data
      );
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }

  // try deleting any previous private locations
  if (privateLocationId) {
    try {
      console.log("Deleting existing test private location");
      await kbnClient.delete(
        `api/synthetics/private_locations/${privateLocationId}`
      );
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        console.error("Private location does not exist. Creating one.");
      } else if (isAxiosError(error)) {
        console.error(
          "Failed to delete existing test private location:",
          error.response?.data
        );
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  }

  // try to create a private location
  try {
    console.log("Creating new test private location");
    const response = await kbnClient.post("api/synthetics/private_locations", {
      label: testPrivateLocationName,
      agentPolicyId,
    });
    privateLocationId = response.data.id;
    saveEnvVariable("TEST_PRIVATE_LOCATION_ID", privateLocationId);

    console.log(
      `Environment variable TEST_PRIVATE_LOCATION_ID saved to .env file`
    );
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Failed to create test private location:",
        error.response?.data
      );
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }

  return {
    agentPolicyId,
    privateLocationId,
  };
}
