export function parseYoutubeLink (msg: String)
{//regex = /https:\/\/www.youtube.com\/watch\?v=(.*?)\s/ left this example here
  const embeddedRegex = /https:\/\/www.youtube.com\/embed\/([^ \r\n]*)/
  const embeddedMatches = msg.match(embeddedRegex)
  const watchRegex = /https:\/\/www.youtube.com\/watch\?v=([^ \r\n]*)/
  const watchMatches = msg.match(watchRegex)
  const shortsRegex = /https:\/\/www.youtube.com\/shorts\/([^ \r\n]*)/
  const shortsMatches = msg.match(shortsRegex)
  const shareRegex = /https:\/\/youtu.be\/([^ \r\n]*)/
  const shareMatches = msg.match(shareRegex)

  var parsedMessage
  var embeddedLink

  if(embeddedMatches)
  {
    parsedMessage = msg.replace(embeddedMatches[0], "")
    embeddedLink = embeddedMatches[0] + "?cc_load_policy=1&cc_lang_pref=en"//Used to turn captions on by default
    
    return[parsedMessage, embeddedLink] 
  }
  else if(watchMatches)
  {
    parsedMessage = msg.replace(watchMatches[0], "")

    const youtubeVideoId = watchMatches[0].replace("https://www.youtube.com/watch?v=", "")
    embeddedLink = `https://www.youtube.com/embed/${youtubeVideoId}?cc_load_policy=1&cc_lang_pref=en`//Used to turn captions on by default

    return [parsedMessage, embeddedLink] 
  } 
  else if(shortsMatches)
  {
    parsedMessage = msg.replace(shortsMatches[0], "")

    const youtubeVideoId = shortsMatches[0].replace("https://www.youtube.com/shorts/", "")
    embeddedLink = `https://www.youtube.com/embed/${youtubeVideoId}?cc_load_policy=1&cc_lang_pref=en`//Used to turn captions on by default

    
    return [parsedMessage, embeddedLink] 
  }
  else if(shareMatches)
  {
    parsedMessage = msg.replace(shareMatches[0], "")

    const youtubeVideoId = shareMatches[0].replace("https://youtu.be/", "")
    embeddedLink = `https://www.youtube.com/embed/${youtubeVideoId}?cc_load_policy=1&cc_lang_pref=en`//Used to turn captions on by default
    
    return [parsedMessage, embeddedLink] 
  }
  
  else
    return [msg, ""]
}