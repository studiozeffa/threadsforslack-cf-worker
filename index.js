addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest() {
  return new Response('Hello super!', {
    headers: { 'content-type': 'text/plain' },
  });
}
