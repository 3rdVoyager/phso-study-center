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

function getOptionalText(value, fieldName, maxLength) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return getText(value, fieldName, maxLength);
}

function validateResource(resource, resourceLabel) {
  if (!resource || Array.isArray(resource) || typeof resource !== "object") {
    throw new Error(`${resourceLabel} must be an object`);
  }

  const title = getText(resource.title, `${resourceLabel}.title`, 200);
  const url = getText(resource.url, `${resourceLabel}.url`, 2_000);
  const resourceType = getText(
    resource.resource_type,
    `${resourceLabel}.resource_type`,
    50,
  );

  try {
    const parsedUrl = new URL(url);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error();
    }
  } catch {
    throw new Error(`${resourceLabel}.url must use http or https`);
  }

  return {
    title,
    url,
    resourceType,
    event: getOptionalText(resource.event, `${resourceLabel}.event`, 100),
    season: getOptionalText(resource.season, `${resourceLabel}.season`, 50),
    division: getOptionalText(
      resource.division,
      `${resourceLabel}.division`,
      50,
    ),
    description: getOptionalText(
      resource.description,
      `${resourceLabel}.description`,
      2_000,
    ),
  };
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
    const resources = Array.isArray(body) ? body : [body];

    if (resources.length === 0) {
      return errorResponse("At least one resource is required");
    }

    if (resources.length > 100) {
      return errorResponse("A maximum of 100 resources can be added at once");
    }

    const validatedResources = resources.map((resource, index) =>
      validateResource(resource, `resources[${index}]`),
    );

    const statements = validatedResources.map((resource) =>
      env.DB.prepare(
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
      ).bind(
        resource.title,
        resource.url,
        resource.resourceType,
        resource.event,
        resource.season,
        resource.division,
        resource.description,
        createdBy,
      ),
    );

    const results = await env.DB.batch(statements);
    const createdResources = results.flatMap((result) => result.results || []);

    if (Array.isArray(body)) {
      return Response.json(
        {
          created_count: createdResources.length,
          resources: createdResources,
        },
        { status: 201 },
      );
    }

    return Response.json(createdResources[0], { status: 201 });
  } catch (error) {
    return errorResponse(error.message || "Could not create resource");
  }
}
