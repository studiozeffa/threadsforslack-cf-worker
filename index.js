const qs = require('qs');

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Process the request
 *
 * @param {Request} req
 */
async function handleRequest(req) {
  console.debug({ url: req.url, msg: 'Request received' });

  const url = new URL(req.url);
  if (url.pathname === '/slack/events') {
    // Handle Slack events.
    const body = await getBody(req);
    console.debug({ body }, 'Body parsed');
    switch (body.type) {
      case 'url_verification':
        return jsonResponse({
          challenge: body.challenge,
        });
    }
  }

  // If we have got to here, we haven't processed the event.
  return fourOhFourResponse();
}

/**
 * Process the request
 *
 * @param {Request} req
 * @returns {Promise<Record<string, string>>}
 */
async function getBody(req) {
  const contentType = req.headers.get('content-type');
  console.debug({ contentType }, 'Found content type');

  switch (contentType) {
    case 'application/json':
      return req.json();
    case 'application/x-www-form-urlencoded':
      return qs(await req.text());
    default:
      return {};
  }
}

function jsonResponse(data) {
  const json = JSON.stringify(data);
  return new Response(json, {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
}

function fourOhFourResponse() {
  return new Response('Not found', {
    status: 404,
    headers: { 'content-type': 'text/plain' },
  });
}
