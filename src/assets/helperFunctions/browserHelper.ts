export function isBrowserFireFox()
{
  // Check if we are in a browser environment (important for SSR/Node.js)
  if (typeof window === 'undefined' || !window.navigator)
      return false
  
  // Convert to lowercase and check for the "firefox" string
  return window.navigator.userAgent.toLowerCase().includes('firefox')
}