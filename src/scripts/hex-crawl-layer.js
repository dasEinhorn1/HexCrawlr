import { HexMap } from "./hex-map.js";
import { HexSelector } from "./hex-selector.js";
import { Debug } from "./utils.js";

export class HexCrawlLayer extends InteractionLayer {
    
    constructor() {
        super();
        this._dragging = false;
        this.windowVisible = false;
        this._hexMap = null;
        this.selectedHexes = [];
        // this.hexSelector = HexSelector(this.hexMap)
    }

    static get layerOptions() {
        return foundry.utils.mergeObject(super.layerOptions, {
            name: "hexcrawl",
            zIndex: 245,
        });
    }

    get hexMap() {
        return (this._hexMap != null) ? this._hexMap : HexMap("HexMap", game.canvas.grid);
    }

    /** @override */
    selectObjects({x, y, width, height, releaseOptions={}, controlOptions={}}={}, {releaseOthers=true}={}) {
        const shiftPressed = game.keyboard.isModifierActive(KeyboardManager.MODIFIER_KEYS.SHIFT)
        if (!shiftPressed) {
            this.hexMap.clearHighlights()
        }
        const hexes = this.hexMap.getHexesInBox(x, y, width, height);
        Debug.log(hexes);
        for (let pos of hexes) {
            this.hexMap.addHighlight(pos.x, pos.y)
        }
    }

    /** @override */
    async _draw() {
        await super._draw();
    }

    /** @inheritdoc */
    async _tearDown() {
        return super._tearDown();
    }

    /** @override */
    _onDragLeftDrop(event) {
        const u = {
            x: event.data.destination.x - event.data.origin.x,
            y: event.data.destination.y - event.data.origin.y,
        };
        console.log(u)
    }

    /** @override */
    _onDragLeftStart(event) {
        // this.windowVisible = this._isWindowVisible();
        // if (!this.windowVisible) return;
        this._dragging = true;
        this.hexMap.addHighlightLayer("preview")
        console.log("SHITMA")
    }

    /** @override */
    _onDragLeftMove(event) {
        // if (!this.windowVisible) return;
        this.hexMap.clearHighlights("preview")
        Debug.log(event)
        // this.hexMap.addHighlight()
        // const ray = new Ray(event.data.origin, event.data.destination);
        // this.ruler.clear();
        // this.ruler
        //   .lineStyle(3, 0xaa0033, 0.6)
        //   .drawCircle(ray.A.x, ray.A.y, 2)
        //   .moveTo(ray.A.x, ray.A.y)
        //   .lineTo(ray.B.x, ray.B.y)
        //   .drawCircle(ray.B.x, ray.B.y, 2);
    }

    // _isWindowVisible() {
    //     const windows = Object.values(ui.windows);
    //     const effectConfig = windows.find((w) => w.id == "hexcrawl-config");
    //     // if (!effectConfig) return false;
    //     return true;
    // }

    /** @override */
    _onClickLeft(event) {
        this._dragging = false;
        const origin = event.data.origin;
        const shiftPressed = game.keyboard.isModifierActive(KeyboardManager.MODIFIER_KEYS.SHIFT)
        if (!shiftPressed) {
            this.hexMap.clearHighlights()
        }
        
        event.data.rotation = 0;
        event.data.destination = undefined;
        Debug.log("Clickma", origin);
        this.hexMap.addHighlight(origin.x, origin.y)
    }

//   get #elevation() {
//     const effectConfig = Object.values(ui.windows).find((w) => w.id == "specials-config");
//     const elevationString = effectConfig?.element.find("input[name='elevation']").val();
//     const elevation = Number.parseFloat(elevationString);
//     if (Number.isNaN(elevation) || !Number.isFinite(elevation)) return 1;
//     return elevation;
//   }
}