export async function onRequestGet({ env }) {
  const result = await env.DB.prepare(
    `
      SELECT id, title, url, resource_type, event AS event_name,
             season, division, description
      FROM resources
      ORDER BY title
    `,
  ).all();

  return Response.json(result.results);
}
