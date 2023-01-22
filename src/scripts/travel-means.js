import {
    TravelPace
} from './enums.js';

/*
 * baseSpeed: number
 * pace = TravelPace
 */
function GetMPHForPace(baseSpeed, pace = TravelPace.Normal) {
    return ({
        [TravelPace.Fast]: (n) => Math.round(3 * n /20),
        [TravelPace.Normal]: (n) => Math.round(n/10),
        [TravelPace.Slow]: (n) => Math.round(2 * n / 30),
        [TravelPace.Exploration]: (n) => Math.round(n / 20)
    })[pace](baseSpeed)
}

export class TravelMeans {
    // name: string
    // baseSpeed: number (feet per round)

    constructor(name, baseSpeed) {
        this.baseSpeed = baseSpeed // feet per round
        this.name = name
    }

    /* pace: TravelPace */
    getMPH(pace) {
        return GetMPHForPace(this.baseSpeed, pace)
    }
}