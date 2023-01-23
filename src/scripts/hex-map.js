import { PACKAGE_NAMESPACE } from "./constants.js";
import { Debug } from "./utils.js";

const DEFAULT_HIGHLIGHT_LAYER = "default"
const DEFAULT_COLOR = 0x0000FF
const DEFAULT_BORDER = 10

export class HexMapCoordinate {
    #grid;

    static fromWorld(grid, {x, y}) {
        const [row, column] = grid.getGridPositionFromPixels(x, y)
        return new HexMapCoordinate(grid, row, column)
    }

    /**
     * Convert a stringified coordinate back to a HexMapCoordinate
     * @param {Grid} grid the grid on which the coordinate resides
     * @param {string} str the stringified coordinate in '<row>,<col>' format
     * @returns {HexMapCoordinate}
    */
    static fromString(grid, str) {
        const [row, column] = str.split(',').map(s => parseInt(s.trim()))
        return new HexMapCoordinate(grid, row, column)
    }

    /**
     * @param {HexagonalGrid} grid the hexagonal grid responsible for this coordinate
     * @param {number} r an integer row value
     * @param {number} c an integet column value
    */
    constructor(grid, r, c) {
        if (!(grid instanceof HexagonalGrid) || !Number.isInteger(r) || !Number.isInteger(c)) {
            throw new TypeError("Invalid constructor call for HexMapCoordinate")
        }
        this.#grid = grid;
        this.r = r; // row
        this.c = c; // column
    }

    get world() { 
        const [px, py] = this.#grid.getPixelsFromGridPosition(this.r, this.c) 
        return {x: px, y: py}
    }

    get x() { return this.world.x }

    get y() { return this.world.y }

    get center() { return this.#grid.getCenter(this.x, this.y) }

    toString() {
        return `${this.r},${this.c}`
    }
}

export function HexMap (name, gridLayer) {
    // for every hex position, we need a point in the array
    // access the array using those positions
    // make it a 2d array
    const _name = name
    const HIGHLIGHT_LAYER_PREFIX = `${PACKAGE_NAMESPACE}_${_name}`;
    const _highlightLayers = new Map();
    const _gridLayer = gridLayer
    const _grid = gridLayer.grid
    const _hexes = new Map() // ["row": ["column": hex]]
    addHighlightLayer(DEFAULT_HIGHLIGHT_LAYER);
    
    function setHex(row, column, data = {}) {
        if (!_hexes.has(row)) {
            _hexes.set(row, new Map()) // add the column map to the row
        }
        _hexes.get(row).set(column, data) // set the data in the column
    }
    
    function getHex(row, column) {
        return _hexes.get(row)?.get(column)
    }
    
    function getHexCoordinateFromWorld(worldX, worldY) {
        return HexMapCoordinate.fromWorld(_grid, {x: worldX, y: worldY})
    }
    
    function getHexCoordinate(row, column) {
        return new HexMapCoordinate(_grid, row, column)
    }
    
    function getHighlightLayer(name = "") {
        return _gridLayer.getHighlightLayer(_highlightLayers.get(name))
    }

    function addHighlightLayer(name) {
        if (name == null || name == "") {
            throw new Error("Invalid layer name")
        }  
        const fullName = HIGHLIGHT_LAYER_PREFIX + name
        _highlightLayers.set(name, fullName)
        if (!getHighlightLayer(name)) {
            _gridLayer.addHighlightLayer(fullName)
        }
    }

    /**
     * @param {HexMapCoordinate} hexCoordinate Hex coordinate at which to add the highlight
     * @param {string} [layerName] layer on which to add the
     * @param {object} [options = {}]
     * @returns {void} 
     * @throws {Error} If highlight layer is invalid
    */
    function addHighlight(hexCoordinate, layerName, options = {}) {
        const layer = _highlightLayers.get(layerName ?? DEFAULT_HIGHLIGHT_LAYER);
        if (layer == null) {
            throw new Error(`Invalid Highlight Layer: '${layerName}'`)
        }
        _gridLayer.highlightPosition(layer, {...hexCoordinate.world, color: DEFAULT_COLOR, border: DEFAULT_BORDER, ...options })
    }

    /**
     * @param {object} pos world position at which to add the highlight
     * @param {number} pos.x x coordinate at which to add the highlight
     * @param {number} pos.y y coordinate at which to add the highlight
     * @param {string} [layerName] layer on which to add the
     * @param {object} [options = {}]
     * @returns {void} 
     * @throws {Error} If highlight layer is invalid
    */
    function addHighlightFromWorld(pos, layerName, options = {}) {
        const hexCoordinate = HexMapCoordinate.fromWorld(_grid, pos)
        addHighlight(hexCoordinate, layerName, options)
    }

    /**
     * @param {string} [layerName] layer on which to add the highlight
     * @returns {void} 
     * @throws {Error} If highlight layer is invalid
    */
    function clearHighlights(layerName) {
        const layer = _highlightLayers.get(layerName ?? DEFAULT_HIGHLIGHT_LAYER);
        if (layer == null) {
            throw new Error(`Invalid Highlight Layer: '${layerName}'`)
        }
        _gridLayer.clearHighlightLayer(layer)
    }

    /**
     * @param {number} worldX x location of top-left box coordinate
     * @param {number} worldY y location of top-left 
     * @param {number} width width of the box
     * @param {number} height height of the box
     * @returns {HexMapCoordinate[]} Array of coordinates with which the box intersects
    */
    function getHexesInBox(worldX, worldY, width, height) {
        // coordinates
        const hexes = []
        const x1 = worldX,
              y1 = worldY,
              x2 = worldX + width,
              y2 = worldY + height;
        // get hex at x, y
        const {c: c1, r: r1} = getHexCoordinateFromWorld(x1, y1);
        // get hex at x + w , y + h
        const {c: c2, r: r2} = getHexCoordinateFromWorld(x2, y2);

        for (let r = r1; r <= r2; r++) {
            for (let c = c1 - 1; c <= c2 + 1; c++) { // give extra space for columns which might get missed accidentally
                let pos = getHexCoordinate(r, c)
                if (pos.x <= x2 && pos.x + _grid.w >= x1) {
                    hexes.push(pos)
                }
            }
        }
        return hexes
    }

    return {
        setHex,
        getHex,
        getGridPosition: getHexCoordinateFromWorld,
        getWorldPosition: getHexCoordinate,
        addHighlightLayer,
        addHighlight,
        addHighlightFromWorld,
        clearHighlights,
        getHexesInBox
    }
}
