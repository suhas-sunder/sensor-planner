const jsonHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Content-Type": "application/json",
};

const state = globalThis.__sensorPlannerState || {
  sessions: [],
  layouts: [],
  devices: {},
  sensors: {},
  persons: {},
  events: {},
  logs: [],
};

globalThis.__sensorPlannerState = state;

const json = (body, statusCode = 200) => ({
  statusCode,
  headers: jsonHeaders,
  body: JSON.stringify(body),
});

const parseBody = (event) => {
  if (!event.body) {
    return {};
  }

  return JSON.parse(event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body);
};

const id = (prefix) =>
  `${prefix}-${Math.random().toString(16).slice(2, 10)}`;

const now = () => new Date().toISOString();

const routePath = (event) => {
  const path = event.path
    .replace(/^\/\.netlify\/functions\/api/, "")
    .replace(/^\/api/, "");

  return path || "/";
};

const proxyToBackend = async (event, path) => {
  const apiBaseUrl = process.env.SENSOR_PLANNER_API_URL;

  if (!apiBaseUrl) {
    return null;
  }

  const upstream = new URL(path, apiBaseUrl.endsWith("/")
    ? apiBaseUrl
    : `${apiBaseUrl}/`);

  if (event.rawQuery) {
    upstream.search = event.rawQuery;
  }

  const response = await fetch(upstream, {
    method: event.httpMethod,
    headers: {
      "Content-Type": event.headers["content-type"] || "application/json",
    },
    body: ["GET", "HEAD"].includes(event.httpMethod) ? undefined : event.body,
  });

  return {
    statusCode: response.status,
    headers: {
      ...jsonHeaders,
      "Content-Type": response.headers.get("content-type") || "application/json",
    },
    body: await response.text(),
  };
};

const collection = (name, layoutId) => {
  state[name][layoutId] ||= [];
  return state[name][layoutId];
};

const removeFromCollection = (name, layoutId, itemId) => {
  const items = collection(name, layoutId);
  const index = items.findIndex((item) => item.id === itemId);

  if (index === -1) {
    return false;
  }

  items.splice(index, 1);
  return true;
};

const upsertInCollection = (name, layoutId, item) => {
  const items = collection(name, layoutId);
  const index = items.findIndex((existing) => existing.id === item.id);
  const timestamp = now();
  const nextItem = {
    ...(index === -1 ? { date_created: timestamp } : items[index]),
    ...item,
    floor: layoutId,
    date_modified: timestamp,
  };

  if (index === -1) {
    items.push(nextItem);
  } else {
    items[index] = nextItem;
  }

  return nextItem;
};

const handleLayouts = (method, parts, body) => {
  if (parts.length === 1 && method === "GET") {
    return json(state.layouts);
  }

  if (parts.length === 1 && method === "POST") {
    const layout = {
      id: body.id || id("layout"),
      name: body.name,
      owner_session_id: body.owner_session_id,
      rooms: (body.rooms || []).map((room) => ({
        id: room.id || id("room"),
        name: room.name,
        x: room.x,
        y: room.y,
        width: room.width,
        height: room.height,
      })),
    };

    state.layouts.push(layout);
    return json({ message: "Layout and rooms created successfully", layout_id: layout.id }, 201);
  }

  const layoutId = parts[1];
  const layout = state.layouts.find((item) => item.id === layoutId);

  if (!layout) {
    return json({ error: "Layout not found" }, 404);
  }

  if (parts.length === 2 && method === "DELETE") {
    state.layouts = state.layouts.filter((item) => item.id !== layoutId);
    delete state.devices[layoutId];
    delete state.sensors[layoutId];
    delete state.persons[layoutId];
    delete state.events[layoutId];
    return json({ message: `Layout ${layoutId} deleted successfully` });
  }

  const childType = parts[2];
  const childId = parts[3];

  if (childType === "devices") {
    if (method === "GET") {
      return json(collection("devices", layoutId));
    }

    if (method === "POST") {
      upsertInCollection("devices", layoutId, body);
      return json({ message: "Device saved" }, 201);
    }

    if (method === "DELETE" && childId) {
      return removeFromCollection("devices", layoutId, childId)
        ? json({ message: `Device '${childId}' deleted from layout '${layoutId}'.` })
        : json({ error: "Device not found" }, 404);
    }
  }

  if (childType === "sensors") {
    if (method === "GET") {
      return json(collection("sensors", layoutId));
    }

    if (method === "POST") {
      upsertInCollection("sensors", layoutId, body);
      return json({ message: "Sensor saved successfully" });
    }

    if (method === "DELETE" && childId) {
      return removeFromCollection("sensors", layoutId, childId)
        ? json({ message: `Sensor '${childId}' deleted successfully.` })
        : json({ error: "Sensor not found" }, 404);
    }
  }

  if (childType === "persons") {
    if (method === "GET") {
      return json(collection("persons", layoutId));
    }

    if (method === "POST") {
      upsertInCollection("persons", layoutId, body);
      return json({ message: "Person saved" }, body.id ? 200 : 201);
    }
  }

  if (childType === "events") {
    if (method === "GET") {
      return json(collection("events", layoutId));
    }

    if (method === "POST") {
      upsertInCollection("events", layoutId, body);
      return json({ message: "Event saved" }, body.id ? 200 : 201);
    }
  }

  return json({ error: "Not found" }, 404);
};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: jsonHeaders, body: "" };
  }

  const path = routePath(event);
  const proxied = await proxyToBackend(event, path);

  if (proxied) {
    return proxied;
  }

  try {
    const parts = path.split("/").filter(Boolean);
    const body = parseBody(event);

    if (parts[0] === "session" && event.httpMethod === "POST") {
      if (!body.name) {
        return json({ error: "Name is required" }, 400);
      }

      const session = { id: crypto.randomUUID(), name: body.name };
      state.sessions.push(session);
      return json(session, 201);
    }

    if (parts[0] === "session" && event.httpMethod === "GET") {
      const session = state.sessions.find((item) => item.id === parts[1]);
      return session ? json(session) : json({ error: "Session not found" }, 404);
    }

    if (parts[0] === "layouts") {
      return handleLayouts(event.httpMethod, parts, body);
    }

    if (parts[0] === "logs" && event.httpMethod === "POST") {
      state.logs.push({ id: state.logs.length + 1, ...body });
      return json({ message: "Event logged successfully" }, 201);
    }

    return json({ error: "Not found" }, 404);
  } catch (error) {
    return json({ error: error.message }, 500);
  }
};
