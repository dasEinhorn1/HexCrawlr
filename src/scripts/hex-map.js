import { Debug } from "./utils.js";

const HIGHLIGHT_LAYER = "hexcrawler-highlight"
const DEFAULT_COLOR = 0x0000FF
const DEFAULT_BORDER = 10


export function HexMap (name, gridLayer) {
    // for every hex position, we need a point in the array
    // access the array using those positions
    // make it a 2d array
    const _name = name
    const _highlightLayerName = `${HIGHLIGHT_LAYER}:${name}`;
    const _gridLayer = gridLayer
    const _grid = gridLayer.grid
    const _hexes = new Map() // ["row": ["column": hex]]

    if (!_gridLayer.getHighlightLayer(_highlightLayerName)) {
        _gridLayer.addHighlightLayer(_highlightLayerName)
    }

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
    
    function addHighlight(worldX, worldY, options = {}) {
        let {x, y} = getHexPosition(worldX, worldY)
        _gridLayer.highlightPosition(_highlightLayerName, {x, y, color: DEFAULT_COLOR, border: DEFAULT_BORDER, ...options })
    }
    
    function clearHighlights() {
        _gridLayer.clearHighlightLayer(_highlightLayerName)
    }

    return {
        setHex,
        getHex,
        getGridPosition,
        getWorldPosition,
        getHexPosition,
        addHighlight,
        clearHighlights
    }
}
