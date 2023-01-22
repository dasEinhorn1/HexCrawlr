import { init, ready } from "./scripts/hooks.js"

Hooks.once("init", init)

Hooks.on("ready", ready)

Hooks.on("getSceneControlButtons", controls => {

    console.log(canvas.layers)
    // Add a scene control under the tokens menu if GM
    controls.push({
        name: "hexcrawl",
        title: "CONTROLS.GroupHexCrawl",
        layer: "controls",
        icon: "fas fa-hexagon",
        visible: game.user?.isGM,
        tools: [
          {
            name: "select",
            title: "CONTROLS.HexCrawlSelect",
            icon: "fa-regular fa-expand"
          },
          {
            name: "clear",
            title: "CONTROLS.HexCrawlClear",
            icon: "fa-solid fa-trash",
            onClick: () => {},
            button: true
          }
        ],
        activeTool: "select"
      })
});