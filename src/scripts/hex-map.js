import { PACKAGE_NAMESPACE } from "./constants.js";
import { Debug } from "./utils.js";

const DEFAULT_HIGHLIGHT_LAYER = "default"
const DEFAULT_COLOR = 0x0000FF
const DEFAULT_BORDER = 10



export function HexMap (name, gridLayer) {
    // for every hex position, we need a point in the array
    // access the array using those positions
    // make it a 2d array
    const _name = name
    const HIGHLIGHT_LAYER_PREFIX = `${PACKAGE_NAMESPACE}_${name}`;
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
    
    function getGridPosition(worldX, worldY) {
        const [r, c] = _grid.getGridPositionFromPixels(worldX, worldY)
        return {r, c}
    }
    
    function getWorldPosition(row, column) {
        const [x, y] = _grid.getPixelsFromGridPosition(row, column)
        return {x, y}
    }
    
    function getHexPosition(worldX, worldY) {
        const [x, y] = _grid.getTopLeft(worldX, worldY);
        return {x, y}
    }

    function getHexCenter(worldX, worldY) {
        const [x, y] = _grid.getCenter(worldX, worldY);
        return {x, y}
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

    function addHighlight(worldX, worldY, layerName, options = {}) {
        const layer = _highlightLayers.get(layerName ?? DEFAULT_HIGHLIGHT_LAYER);
        if (layer == null) {
            throw new Error(`Invalid Highlight Layer: '${layerName}'`)
        }
        const {x, y} = getHexPosition(worldX, worldY)
        _gridLayer.highlightPosition(layer, {x, y, color: DEFAULT_COLOR, border: DEFAULT_BORDER, ...options })
    }
    
    function clearHighlights(layerName) {
        const layer = _highlightLayers.get(layerName ?? DEFAULT_HIGHLIGHT_LAYER);
        if (layer == null) {
            throw new Error(`Invalid Highlight Layer: '${layerName}'`)
        }
        _gridLayer.clearHighlightLayer(layer)
    }

    function getHexesInBox(worldX, worldY, width, height) {
        // coordinates
        const hexes = []
        const x1 = worldX,
              y1 = worldY,
              x2 = worldX + width,
              y2 = worldY + height;
        // get hex at x, y
        const {c: c1, r: r1} = getGridPosition(x1, y1);
        // get hex at x + w , y + h
        const {c: c2, r: r2} = getGridPosition(x2, y2);


        Debug.log(`START: (${x1}, ${y1}) -> col: ${c1}, row: ${r1}`);
        Debug.log(`END: (${x2}, ${y2}) -> col: ${c2}, row: ${r2}`);
        for (let r = r1; r <= r2; r++) {
            const isEven = () => (r - r1 + 1) % 2 == 0;

            // is the selection box past the center of the first hex selected?
            // Would that hex be selected normally?
            const extStart = x1 < getHexCenter(x1, y1).x
            const extEnd = x2 > getHexCenter(x2, y1).x    
            if(isEven()) {
                Debug.log(`Extend Start for row:${r} col:${c1%2} ):`, extStart)
                Debug.log(`Extend End for row:${r} col: ${c2%2}):`, extEnd)
            }
            
            const startCol = (isEven() && extStart) ? c1 - 1 : c1;
            const endCol = (isEven() && extEnd) ? c2 + 1: c2; 
            // each column is predictably spaced
            // every other row is offset by w/2 
            for (let c = c1 - 1; c <= c2 + 1; c++) {
                let pos = getWorldPosition(r, c)
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
        getGridPosition,
        getWorldPosition,
        getHexPosition,
        addHighlightLayer,
        addHighlight,
        clearHighlights,
        getHexesInBox,
        getHexCenter
    }
}
