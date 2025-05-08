import PogObject from "../../PogData";
//                                　↓ここmoduleの名前
export const data = new PogObject("SUN/data", {
    farm: [],
    original: [],
    hedge: [],
    sprayDisplay: {
        x: Renderer.screen.getWidth() / 2,
        y: Renderer.screen.getHeight() / 2 + 10,
        scale: 1
    }

}, "data.json")

export const subdata = new PogObject("SUN/data", {
    time:[]
}, "time.json")

export const plotdata = new PogObject("SUN/data", {
    farm: []
}, "plot.json")