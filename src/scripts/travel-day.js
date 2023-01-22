import { Watch } from "./travel-watch.js"


class TravelDay {
    constructor() {
        this.watchLog = []
        this.currentWatch = 0
        this.currentTime = 0
    }

    initialize() {
        for (let i = 0; i < 6; i++) {
            this.watchLog.push(new Watch(i));
        }
    }
}