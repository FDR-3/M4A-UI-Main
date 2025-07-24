export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const MAX_RETRY_FETCH = 10
export const RETRY_TIME_OUT = 5500 //5.5 seconds in miliseconds
export const RETRY_MESSAGE = "You're clicking around too fast for mah budget site D:<"
export const ERROR_429 = "429"
