import KeyboardHandler from "./keyboard-handler.js";
import { Debug } from "./utils.js";

export function HexSelector(hexMap, {onChange = () => {}, onFinish = () => {}} = {onChange(){}, onFinish(){}}) {
    let selectionOverlay = null
    let selectionOverlayDestroyHook = null

    const currentSelection = new Set()
    const state = {
        selecting: false,
        multiselect: false,
        additive: true,
    }

    function reset () {
        state.selecting = false;
        state.multiselect = false;
        state.additive = true;
        currentSelection.clear()
    }

    function select(worldX, worldY) {
        let pos = hexMap.getHexPosition(worldX, worldY)
        Debug.log(`Selecting: (${worldX}, ${worldY})`)
        currentSelection.add(pos)
        onChange(currentSelection)
    }

    function deselect(worldX, worldY) {
        let pos = hexMap.getHexPosition(worldX, worldY)
        Debug.log(`Deselecting: (${worldX}, ${worldY})`)
        currentSelection.delete(pos)
    }

    function deselectAll() {
        currentSelection.clear()
    }

    function destroy() {
        selectionOverlay.destroy();
        Hooks.off("canvasTearDown", selectionOverlayDestroyHook);
        reset();
        KeyboardHandler.remove(keyHandler)
    }

    // called on left mousedown
    function startSelection(canvas, Hooks) {
        if (state.selecting) return;
        state.selecting = true;
        selectionOverlay = canvas.stage.addChild(new PIXI.Container());
        selectionOverlayDestroyHook = Hooks.once("canvasTearDown", () => selectionOverlay.destroy());
        selectionOverlay.hitArea = canvas.dimensions.rect;
        selectionOverlay.cursor = "crosshair";
        selectionOverlay.interactive = true;
        selectionOverlay.zIndex = Infinity;
        KeyboardHandler.add(keyHandler);
        selectionOverlay.on("click", clickHandler);
    }

    function keyHandler(event) {
        if (event.type != "keyup") { return }
        if (event.key == "Shift" && state.selecting && state.multiselect) {
            onSelectionEnd();
        }
    }

    function clickHandler(event) {
        Debug.log("Click:", event)
        if (event.data.originalEvent.shiftKey) {
            state.multiselect = true
        } else {
            state.multiselect = false
        }

        const position = event.data.getLocalPosition(selectionOverlay);
        if (currentSelection.has(position)) {
            deselect(position.x, position.y);
            return;
        }
        if (!state.multiselect) {
            deselectAll();
            select(position.x, position.y);
            onSelectionEnd();
        } else {
            select(position.x, position.y);
        }
    }

    function onSelectionEnd() {
        const selected = Array.from(currentSelection)
        Debug.log("Final Selection:", selected);
        onFinish(selected);
        destroy();
    }

    return {
        startSelection,
        select,
        deselect,
        deselectAll,
        destroy
    }
}