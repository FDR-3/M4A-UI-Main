const PROXY_URL = "https://m4a.io/Proxy"
const TEST_NET_PROXY_URL = "https://m4a.io/TestNetProxy"
const JITO_TIP_PROXY_URL = "https://m4a.io/JitoTipProxy"
const ORIGIN = "https://m4a.io"

//Function to handle all requests
export default
{
  async fetch(request, env)
  {
    try
    {
      if(request.url == PROXY_URL || request.url == TEST_NET_PROXY_URL || request.url == JITO_TIP_PROXY_URL)
      {
        const origin = request.headers.get("origin")

        //This stops requests from unauthorized web browsers. 
        if(origin != ORIGIN && origin != "http://localhost:8100")
          return new Response(`Origin: ${origin}\nOnly requests from https://m4a.io can use this end point.`, { status: 400 })

        var TARGET_URL = ""
        var API_KEY = ""

        if(request.url == PROXY_URL)
        {
          if(!env.HELIUS_API_KEY)
            return new Response("HELIUS API key is missing.", { status: 500 })

          if(env.DEV_MODE == "TRUE")
            TARGET_URL = "https://devnet.helius-rpc.com/?api-key="
          else
            TARGET_URL = "https://mainnet.helius-rpc.com/?api-key="

          API_KEY = env.HELIUS_API_KEY
        }
        else if(request.url == TEST_NET_PROXY_URL)
        {
          if(!env.QUICK_NODE_TEST_URL)
            return new Response("QUICK_NODE_TEST_URL is missing.", { status: 500 })

          TARGET_URL = ""
          API_KEY = env.QUICK_NODE_TEST_URL
        }
        else if(request.url == JITO_TIP_PROXY_URL)
        {
          TARGET_URL = "https://bundles.jito.wtf/api/v1/bundles/tip_floor"
          API_KEY = "" //No API key needed for Jito Tip Floor
        }

        const Request_URL = TARGET_URL + API_KEY
  
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

        const newHeaders = new Headers(request.headers)
        newHeaders.set("referer", "m4a.io")

        //Set up fetch options, but PREVENT passing a body if it's a GET request (like Jito)
        const fetchOptions = {
          method: method,
          headers: newHeaders
        }
        
        if(method !== "GET" && method !== "HEAD" && request.body)
          fetchOptions.body = request.body

        //Forward the request to the target URL
        const response = await fetch(Request_URL, fetchOptions)

        //Create a new response to add our headers
        const newResponse = new Response(response.body, response)
        newResponse.headers.set("Access-Control-Allow-Origin", '*') //Set CORS header on the final response

        return newResponse 
      }
      else
      {
        //If it's NOT for the proxy, serve the static assets
        return env.ASSETS.fetch(request)
      }
    } 
    catch(error) 
    {
      return new Response(error.stack || JSON.stringify(error), { status: 500 })
    }
  }
}