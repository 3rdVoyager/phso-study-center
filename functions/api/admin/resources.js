function errorResponse(message, status = 400) {
  return Response.json({ error: message }, { status });
}

function getText(value, fieldName, maxLength) {
  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be text`);
  }

  const text = value.trim();

  if (!text) {
    throw new Error(`${fieldName} is required`);
  }

  if (text.length > maxLength) {
    throw new Error(`${fieldName} is too long`);
  }

  return text;
}

export async function onRequestPost({ request, env }) {
  // Cloudflare Access supplies this after the request passes Access.
  const createdBy = request.headers.get("Cf-Access-Authenticated-User-Email");

  if (!createdBy) {
    return errorResponse("Authentication required", 401);
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return errorResponse("Request body must be valid JSON");
  }

  try {
    const title = getText(body.title, "title", 200);
    const url = getText(body.url, "url", 2_000);
    const resourceType = getText(body.resource_type, "resource_type", 50);

    try {
      const parsedUrl = new URL(url);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return errorResponse("URL must use http or https");
      }
    } catch {
      return errorResponse("URL is invalid");
    }

    const event = body.event ? getText(body.event, "event", 100) : null;
    const season = body.season ? getText(body.season, "season", 50) : null;
    const division = body.division
      ? getText(body.division, "division", 50)
      : null;
    const description = body.description
      ? getText(body.description, "description", 2_000)
      : null;

    const result = await env.DB.prepare(
      `
        INSERT INTO resources (
          title,
          url,
          resource_type,
          event,
          season,
          division,
          description,
          created_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING
          id,
          title,
          url,
          resource_type,
          event AS event_name,
          season,
          division,
          description,
          created_at,
          created_by
      `,
    )
      .bind(
        title,
        url,
        resourceType,
        event,
        season,
        division,
        description,
        createdBy,
      )
      .first();

    return Response.json(result, { status: 201 });
  } catch (error) {
    return errorResponse(error.message || "Could not create resource");
  }
}
