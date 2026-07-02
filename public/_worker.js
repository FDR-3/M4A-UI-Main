const PROXY_URL = "https://m4a.io/Proxy"
const TEST_NET_PROXY_URL = "https://m4a.io/TestNetProxy"
const ORIGIN = "https://m4a.io"

//Function to handle all requests
export default
{
  async fetch(request, env)
  {
    try
    {
      if(request.url == PROXY_URL || request.url == TEST_NET_PROXY_URL)
      {
        const origin = request.headers.get("origin")

        //This only stops request from web browsers. A person running a script could set the origin in the request
        if(origin != ORIGIN)
          return new Response(`Origin: ${origin}\nOnly requests from https://m4a.io can use this end point.`, { status: 400 })

        var RPC_BASE_URL = ""
        var API_KEY = ""

        if(request.url == PROXY_URL)
        {
          if(!env.HELIUS_API_KEY)
            return new Response("HELIUS API key is missing.", { status: 500 })

          if(env.DEV_MODE == "TRUE")
            RPC_BASE_URL = "https://devnet.helius-rpc.com/?api-key="
          else
            RPC_BASE_URL = "https://mainnet.helius-rpc.com/?api-key="

          API_KEY = env.HELIUS_API_KEY
        }
        else if(request.url == TEST_NET_PROXY_URL)
        {
          if(!env.QUICK_NODE_TEST_URL)
            return new Response("QUICK_NODE_TEST_URL is missing.", { status: 500 })

          RPC_BASE_URL = ""
          API_KEY = env.QUICK_NODE_TEST_URL
        }

        const RPC_Request_URL = RPC_BASE_URL + API_KEY
	
        const method = request.method

        const corsHeaders =
        {
          "Access-Control-Allow-Origin": '*',
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, solana-client"
        }

        //Handle CORS preflight (OPTIONS) requests
        if(method === "OPTIONS")
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

        //🐛 Create new headers and add the Referer header from the original request for extrnode request. extrnode website seems to always be stuck spinning now a days 6/30/2026 for me anyway
        const newHeaders = new Headers(request.headers)
        newHeaders.set("referer", "m4a.io")

        //Forward the request to the target URL
        const response = await fetch(RPC_Request_URL,
        {
          method: method,
          headers: newHeaders,
          body: request.body
        })

        //Create a new response to add our headers
        const newResponse = new Response(response.body, response)
        newResponse.headers.set("Access-Control-Allow-Origin", '*') //Set CORS header on the final response

        return response
      }
      else
      {
        //If it's NOT for the proxy, serve the static assets
        return env.ASSETS.fetch(request)
      }
    } 
    catch (err) 
    {
      return new Response(err.stack || JSON.stringify(err), { status: 500 })
    }
  }
}