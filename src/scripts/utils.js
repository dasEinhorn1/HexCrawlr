
export const Debug = {
    log(...text) {
       console.log("[HEXCRAWLR - INFO]", ...text) 
    },
    error(...text) {
        console.log("[HEXCRAWLR - INFO]", ...text) 
    },
    warn(...text) {
        console.warn("[HEXCRAWLR - INFO]", ...text) 
    }
} 