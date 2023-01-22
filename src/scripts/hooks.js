import { Debug } from "../scripts/utils.js";
import { HexCrawlLayer } from "./hex-crawl-layer.js";
import { HexMap } from "./hex-map.js";
import { HexSelector } from "./hex-selector.js";

Debug.log("Hello from HEXCRAWLR");

export function init() {
    Debug.log("On init workflow start")
    registerLayers()
    registerHooks()
}

function registerLayers() {
    CONFIG.Canvas.layers.hexcrawl = {layerClass: HexCrawlLayer, group: "interface"}
}

function registerHooks() {

}

export function ready() {
    Debug.log("Core init complete -- game data available")
    const template_file = "modules/hexcrawlr/templates/form-template.html"
    const template_data = {
        header: "Editor Header"
    }
    
    const hm = HexMap("testmap", game.canvas.grid)
    
    // hm.setHex({x: 1, y: 1}, "Spoopy")
    // let {x, y}= hm.getWorldPosition(10, 10)
    // hm.addHighlight(x, y);

    const hs = HexSelector(hm, {
        onChange(selected) {
            hm.clearHighlights()
            selected.forEach(({x, y}) => {
                hm.addHighlight(x, y)
            });
        }
    });

    // hs.startSelection(canvas, Hooks);

    window.HEXCRAWL = {
        hm,
        hs,
        highlight: () => { hs.startSelection } 
    }
    
    // showForm(template_file, template_data)

    // const scavengerVehicle = new TravelMeans("Scavenger", 100)
    // const watch = new Watch(1, WatchType.Travel, TravelPace.Slow, scavengerVehicle);
    // Debug.log(watch.toString());
}