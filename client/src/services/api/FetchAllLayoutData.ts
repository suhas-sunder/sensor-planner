import {
  fetchDevices,
  fetchSensors,
  fetchPeople,
  fetchEvents,
} from "./Requests";

/**
 * Fetch all layout-related data (devices, sensors, people, events)
 * for a given layoutId (e.g., "layout-3", "layout-a1b2c3d4").
 */
export const FetchAllLayoutData = async (layoutId: string) => {
  try {
    const [devices, sensors, people, events] = await Promise.all([
      fetchDevices(layoutId),
      fetchSensors(layoutId),
      fetchPeople(layoutId),
      fetchEvents(layoutId),
    ]);

    return {
      devices,
      sensors,
      people,
      events,
    };
  } catch (error) {
    console.error("Failed to fetch layout data:", error);
    throw error;
  }
};
