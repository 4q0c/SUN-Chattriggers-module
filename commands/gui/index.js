import config from "../../config";

export const SUNCOMMAND = register("command", () => {
    return config.openGUI()
}).setName("SUNGUI", true)