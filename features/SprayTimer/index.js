import { data, subdata } from "../../util/data";
import { registerWhen } from "../../../BloomCore/utils/Utils";
import config from "../../config";
import { testprefix, getSkyblockArea, getrep } from "../../index"

let text = new Text(" ", 0, 0)

register("command", () => {
    ChatLib.chat(`${testprefix}: ${getrep()}`)
}).setName("getrep")

register("renderOverlay", () => {
    if (config.sprayDisplayGui.isOpen()) {
        text.setString(" ");
        text.setScale(data.sprayDisplay.scale);
        text.draw(data.sprayDisplay.x, data.sprayDisplay.y);
    }
});

register("dragged", (dx, dy, x, y, bn) => {
    if (!config.sprayDisplayGui.isOpen() || bn == 2) return;
    data.sprayDisplay.x = x;
    data.sprayDisplay.y = y;
    data.save();
});

register("scrolled", (x, y, dir) => {
    if (!config.sprayDisplayGui.isOpen()) return;
    if (dir == 1) data.sprayDisplay.scale += 0.05;
    else data.sprayDisplay.scale -= 0.05;
    data.save();
});

register("guiMouseClick", (x, y, bn) => {
    if (!config.sprayDisplayGui.isOpen() || bn != 2) return;
    data.sprayDisplay.x = Renderer.screen.getWidth() / 2;
    data.sprayDisplay.y = Renderer.screen.getHeight() / 2 + 10;
    data.sprayDisplay.scale = 1;
    data.save();
});
