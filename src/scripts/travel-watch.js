// import { WatchType, TravelPace } from './Enums';
// import { TravelMeans } from './TravelMeans';

import { TravelPace, WatchType } from "./enums.js"
import { TravelMeans } from "./travel-means.js"

export class Watch {
    // num: number
    // type: WatchType
    // travelPace: TravelPace
    // travelMeans: TravelMeans

    constructor(num, type=null, travelPace=TravelPace.None, travelMeans) {
        this._num = num
        this._type = type
        this._travelPace = travelPace
        this._travelMeans = travelMeans // in ft / rd
    }

    toString() {
        return `(Watch ${this._num}) | ${this._type} | ${this._travelPace} | ${ 4 * this._travelMeans.getMPH(this._travelPace)} mpw`
    }

    getNum() {
        return this._num
    }

    getType() {
        return this._type
    }

    getTravelPace() {
        return this._travelPace
    }

    getTravelMeans() {
        return this._travelMeans
    }
}

class WatchFactory {
    constructor(type = null, travelPace = TravelPace.None, travelMeans = null) {
        this.type = type
        this.travelPace = travelPace
        this.travelMeans = travelMeans
    }

    create(num) {
        return new Watch(num, this.type, this.travelPace, this.travelMeans);
    }
}