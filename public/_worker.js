const PROXY_URL = 'https://m4a.io/proxyCORS'
const ORIGIN = 'https://m4a.io'

// Function to handle all requests
export default
{
  async fetch(request, env)
  {
    try
    {
      if(request.url == PROXY_URL)
      {
        const origin = request.headers.get("origin")

        if(origin != ORIGIN)
          return new Response(`Origin: ${origin}\nOnly requests from m4a.io can use this end point.`, { status: 500 })

        if (!env.EXTRNODE_API_KEY)
				  return new Response('API key is missing.', { status: 500 })

        const RPC_BASE_URL = 'https://solana-mainnet.rpc.extrnode.com/'    
        const RPC_Request_URL = RPC_BASE_URL + env.EXTRNODE_API_KEY
	
        const method = request.method

        const corsHeaders =
		    {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, solana-client'
        }

        // Handle CORS preflight (OPTIONS) requests
        if(method === 'OPTIONS')
        {
          return new Response
          (
            null,
            {
              status: 204,
              headers: corsHeaders
            }
          )
        }

        // 🐛 Create new headers and add the Referer header from the original request for extrnode request
        const newHeaders = new Headers(request.headers);
        newHeaders.set('referer', 'm4a.io');

        // Forward the request to the target URL
        const response = await fetch(RPC_Request_URL,
        {
          method: method,
          headers: newHeaders,
          body: request.body
        })

        // Create a new response to add our headers
        const newResponse = new Response(response.body, response)
        newResponse.headers.set('Access-Control-Allow-Origin', '*') // Set CORS header on the final response

        return newResponse
      }
      else
      {
        // If it's NOT for the proxy, serve the static assets
        return env.ASSETS.fetch(request)
      }

    } 
    catch (err) 
    {
      return new Response(err.stack || JSON.stringify(err), { status: 500 })
    }
  }
}