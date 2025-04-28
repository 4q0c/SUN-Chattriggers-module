import config from "../../config"
import { registerWhen } from "../../../BloomCore/utils/Utils"
import { data } from "../../util/data"

const sound1 = "random.orb"

registerWhen(register("chat", () => {
    data.hedge = true
    data.save()
}).setCriteria("You summoned your Hedgehog!"), () => config.petalert && !data.hedge)

registerWhen(register("chat", (Pet, ...args) => {
    data.hedge = false
    data.save()
}).setCriteria("You summoned your ${*}!"), () => config.petalert && data.hedge)

registerWhen(register("tick", () => {
    if (config.petpitch <= 0) return
    World.playSound(sound1, 2, config.petpitch)
}), () => data.hedge)

registerWhen(register("renderOverlay", () => {
    Client.showTitle("", "&ePlz Pet Change!", 0, 2, 0)
}), () => data.hedge)