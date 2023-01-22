import { init, ready } from "./scripts/hooks.js"

Hooks.once("init", init)

Hooks.on("ready", ready)

Hooks.on("getSceneControlButtons", controls => {

    console.log(canvas.layers)
    // Add a scene control under the tokens menu if GM
    controls.push({
        name: "hexcrawl",
        title: "CONTROLS.GroupHexCrawl",
        layer: "hexcrawl",
        icon: "fas fa-hexagon",
        visible: game.user?.isGM,
        tools: [
          {
            name: "select",
            title: "CONTROLS.HexCrawlSelect",
            icon: "fas fa-expand",
            onClick: () => {
              // select a group of hexes
            }
          },
          {
            name: "hex-regions",
            title: "CONTROLS.HexCrawlRegion",
            icon: "fas fa-hexagon-plus",
            onClick: () => {
              // define a group of hexes as a region
              // regions gain a color and name
              // regions contain a list of hexes
              // regions are shown as an overlay
              // regions can be edited later
            }
          },
          {
            name: "hex-info",
            title: "CONTROLS.ShowHexInfo",
            icon: "fas fa-circle-info",
            onClick: () => {

            },
            toggle: true
          },
        ],
        activeTool: "select"
      })
});