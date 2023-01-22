```js
/* Time/Plan Related Data */
// HexCrawl Log
    // DayLog = TravelDay[]
// Travel Day
    // WatchLog = TravelWatch[]
    // TravelEventLog = TravelEvent[]
    // Time = Number
// TravelEvent (stretch)
    // title = String
    // description = String
    // time = Number
    // hex = HexCrawlMapHex
// HexCrawlWatch
    // num = Number
    // day = Day.Id
    // hex = HexCrawlMapHex
    // effects = TravelEffect[]
    // encounters = Encounter[]
    // type = ACTIVE || TRAVEL || REST
    // travelPace = exploration || slow || normal || fast || null
    // travelPaceSpeed = miles per watch (default: 0)







// TravelMeans (stretch)
    // BaseSpeed (feet per round)
    // Get("Fast") --> Base Speed * 3 / 20 (mph)
    // Get("Slow") --> Base Speed * 2 / 30 (mph)
    // Get("Exploration") --> BaseSpeed / 20 (mph)
    // Get("Normal") --> Base Speed / 10 (mph)

// HexCrawl = HexCrawl
// CurrentDay = HexCrawl.DayLog.last()
// Current Watch = CurrentDay.
// Current Time = Number (0 - 23)


/* Encounter Related Data*/
// Wandering Encounter Table
// Location Encounter Table
// Weather Table


/* Travel / Space related Data*/
// Current Travel Speed
// Current Hex
// Current Hex Progress
```