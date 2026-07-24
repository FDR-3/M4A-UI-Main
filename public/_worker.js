const MAIN_NET_PROXY_PATH = "/MainNetProxy"
const DEV_NET_PROXY_PATH = "/DevNetProxy"
const TEST_NET_PROXY_PATH = "/TestNetProxy"
const JITO_TIP_PROXY_PATH = "/JitoTipProxy"
const JUPITER_PRICE_PROXY_PATH = "/JupiterPriceProxy"
const ORIGIN = "https://m4a.io"

const mintAddresses =
[
  "USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA", //USDS
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", //USDC
  "So11111111111111111111111111111111111111112", //SOL
  "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs", //WEth
  "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh" //WBtc
]

//Function to handle all requests
export default
{
  async fetch(request, env)
  {
    try
    {
      //Using URL natively handles ws://, wss://, https://, trailing slashes, and query params safely
      const urlObj = new URL(request.url)
      const pathname = urlObj.pathname

      if(pathname == MAIN_NET_PROXY_PATH || pathname == TEST_NET_PROXY_PATH || pathname == JITO_TIP_PROXY_PATH || pathname == JUPITER_PRICE_PROXY_PATH)
      {
        const origin = request.headers.get("origin")
        const referer = request.headers.get("referer")

        //This stops requests from unauthorized web browsers
        if(origin && origin !== ORIGIN && origin !== "http://localhost:8100")
          return new Response(`Origin: ${origin}\nOnly requests from https://m4a.io can use this end point.`, { status: 403 })

        if(!origin)
          if(referer && !referer.startsWith(ORIGIN) && !referer.startsWith("http://localhost:8100"))
            return new Response(`Unauthorized Referer: ${referer}`, { status: 403 })

        var TARGET_URL = ""
        var API_KEY = ""

        if(pathname == MAIN_NET_PROXY_PATH)
        {
          if(!env.HELIUS_API_KEY)
            return new Response("HELIUS API key is missing.", { status: 500 })

          TARGET_URL = "https://mainnet.helius-rpc.com/?api-key="
          API_KEY = env.HELIUS_API_KEY
        }
        if(pathname == DEV_NET_PROXY_PATH)
        {
          if(!env.HELIUS_API_KEY)
            return new Response("HELIUS API key is missing.", { status: 500 })

          TARGET_URL = "https://devnet.helius-rpc.com/?api-key="
          API_KEY = env.HELIUS_API_KEY
        }
        else if(pathname == TEST_NET_PROXY_PATH)
        {
          if(!env.QUICK_NODE_TEST_URL)
            return new Response("QUICK_NODE_TEST_URL is missing.", { status: 500 })

          TARGET_URL = ""
          API_KEY = env.QUICK_NODE_TEST_URL
        }
        else if(pathname == JITO_TIP_PROXY_PATH)
        {
          TARGET_URL = "https://bundles.jito.wtf/api/v1/bundles/tip_floor"
          API_KEY = "" //No API key needed for Jito Tip Floor
        }
        else if(pathname == JUPITER_PRICE_PROXY_PATH)
        {
          TARGET_URL = `https://api.jup.ag/price/v3?ids=${mintAddresses.join(',')}`
          API_KEY = "" //API key added in header below
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
        
        //CRITICAL: WAFs drop connections if referer is not a valid URI structure. "m4a.io" is invalid.
        newHeaders.set("referer", "https://m4a.io/")
        
        //CRITICAL: Delete the copied 'm4a.io' host header so Cloudflare natively assigns 'mainnet.helius-rpc.com'
        newHeaders.delete("host")

        if(pathname == JUPITER_PRICE_PROXY_PATH)
          newHeaders.set("x-api-key", env.JUPITER_API_KEY)

        //Set up fetch options, but PREVENT passing a body if it's a GET request
        const fetchOptions = {
          method: method,
          headers: newHeaders
        }

        if(method !== "GET" && method !== "HEAD" && request.body)
          fetchOptions.body = request.body

        //Forward the request to the target URL
        const response = await fetch(Request_URL, fetchOptions)

        //Detect if this is a WebSocket request for Solana web3.js
        const upgradeHeader = request.headers.get("Upgrade")
        const isWebSocket = upgradeHeader && upgradeHeader.toLowerCase() === "websocket"

        //If it is a WebSocket connection, return the raw response immediately. 
        if(isWebSocket || response.status === 101)
          return response

        //Create a new response to add our headers
        const newResponse = new Response(response.body, response)
        newResponse.headers.set("Access-Control-Allow-Origin", '*')

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