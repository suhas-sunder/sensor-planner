import axios from "axios";

axios.defaults.baseURL = "http://192.168.2.11:5000"; // Default base route for local development

export const fetchLayouts = async () => {
  const response = await axios.get("/layouts");
  return response.data;
};

export const createLayout = async (layoutData: any) => {
  const response = await axios.post("/layouts", layoutData);
  return response.data;
};

export const deleteLayout = async (layoutId: string) => {
  const response = await axios.delete(`/layouts/${layoutId}`);
  return response.data;
};

// Devices
export const fetchDevices = async (layoutId: string) => {
  const response = await axios.get(`/layouts/${layoutId}/devices`);
  return response.data;
};

export const saveDevice = async (layoutId: string, deviceData: any) => {
  const response = await axios.post(`/layouts/${layoutId}/devices`, deviceData);
  return response.data;
};

export const deleteDevice = async (layoutId: string, deviceId: string) => {
  const response = await axios.delete(
    `/layouts/${layoutId}/devices/${deviceId}`
  );
  return response.data;
};

// Sensors
export const fetchSensors = async (layoutId: string) => {
  const response = await axios.get(`/layouts/${layoutId}/sensors`);
  return response.data;
};

export const saveSensor = async (layoutId: string, sensorData: any) => {
  const response = await axios.post(`/layouts/${layoutId}/sensors`, sensorData);
  return response.data;
};

export const deleteSensor = async (layoutId: string, sensorId: string) => {
  const response = await axios.delete(
    `/layouts/${layoutId}/sensors/${sensorId}`
  );
  return response.data;
};

// People
export const fetchPeople = async (layoutId: string) => {
  const response = await axios.get(`/layouts/${layoutId}/persons`);
  return response.data;
};

export const savePerson = async (layoutId: string, personData: any) => {
  const response = await axios.post(`/layouts/${layoutId}/persons`, personData);
  return response.data;
};

// Events
export const fetchEvents = async (layoutId: string) => {
  const response = await axios.get(`/layouts/${layoutId}/events`);
  return response.data;
};

export const saveEvent = async (layoutId: string, eventData: any) => {
  const response = await axios.post(`/layouts/${layoutId}/events`, eventData);
  return response.data;
};

// Logging
export const logCustomEvent = async (logData: any) => {
  const response = await axios.post("/logs", logData);
  return response.data;
};

// Session
export const createSession = async (name: string) => {
  const response = await axios.post("/session", { name });
  return response.data;
};

export const getSession = async (id: string) => {
  const response = await axios.get(`/session/${id}`);
  return response.data;
};
