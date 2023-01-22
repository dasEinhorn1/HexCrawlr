import { Debug } from "./utils.js"

const listeners = new Set()

document.onkeydown = propagate("keydown")

document.onkeyup = propagate("keyup")

function propagate(eventType) {
    return (event) => {
        if (listeners.size > 0) {
            Debug.log("KeyboardInputManager: ", event.type)
        }
        listeners.forEach(listener => listener(event))
    }
}

export default {
    add(listener) {
        listeners.add(listener)
    },
    
    remove(listener) {
        listeners.delete(listener)
    }
}