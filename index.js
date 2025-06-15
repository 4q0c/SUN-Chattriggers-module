import { data, subdata, plotdata } from "./util/data";
import { renderBoxOutline, renderFilledBox } from "../BloomCore/RenderUtils"
import config from "./config"
import {registerWhen} from "../BloomCore/utils/Utils"
import { SUNCOMMAND } from "./commands/gui"
import "./features/SprayTimer/index"
import "./features/PetAlert/index"
import "./commands/help"
import { help } from "./commands/help/index";
import { highlightSlot } from "../BloomCore/utils/Utils";
import { plotMap } from "./data/plotmap";

export const testprefix = "§6[§aSUN§6]"
const sound2 = 'random.orb' // 音の設定
const sound3 = "note.pling"

// notif
// let text = new Text(`Touch down!`).setScale(2).setShadow(true).setAlign('CENTER').setColor(Renderer.color(255, 85, 85));

//debugg
let debugg = true


let inatGarden = false

// area検知
export function getSkyblockArea() {
    const line = TabList.getNames().find(it => /^(Area|): ([\w ]+)$/.test(it.removeFormatting()))
    if (line) {
        const match = line.removeFormatting().match(/^(Area|): ([\w ]+)$/)
        if (match) return match[2]
    }
    return null
}

// Repellent検知
export function getrep() {
    const names = TabList.getNames();
    // ChatLib.chat(`TabList names: ${names}`);

    const line = names.find(it => /^(Repellent: (MAX|None))\s?\(([\w ]+)\)$/.test(it.removeFormatting().trim()));

    if (line) {
        const match = line.removeFormatting().trim().match(/^(Repellent: (MAX|None))\s?\(([\w ]+)\)$/);
        
        if (match) {
            // ChatLib.chat(`${testprefix} Repellent: ${match[3]}`);
            return match[3];
        }
    } else {
        return false
    }
    
    // ChatLib.chat(`${testprefix} Repellent:見つからない: ${line}`)
}

function getpestplotsec() { 
    const names = TabList.getNames();

    const line = names.find(it => /^Plots:\s*\d+(,\s*\d+)*$/.test(it.removeFormatting().trim()));

    if (line) {
        const text = line.removeFormatting().trim();
        const match = text.match(/^Plots:\s*(\d+(?:,\s*\d+)*)$/);

        if (match) {
            const plots = match[1].split(/\s*,\s*/).map(Number);
            return plots ?? false; // 2番目が存在すれば返す、なければ false
        }
    }
}



function getpestplot() {
    const names = TabList.getNames();
    // ChatLib.chat(`TabList names: ${names}`);
// Plots: 16
const line = names.find(it => /^Plots:\s*\d+(,\s*\d+)*$/.test(it.removeFormatting().trim()));

    if (line) {
        const match = line.removeFormatting().trim().match(/^Plots:\s*(\d+)/);

        // ChatLib.chat(`${match}`)
        
        if (match) {
            // ChatLib.chat(`${testprefix} Repellent: ${match[1]}`);
            return match[1];
        }
    } else {
        return false
    }
}


// ワールドロード時にエリアを確認し、inatGardenを設定
register("worldload", () => {
    let retryCount = 0 // リトライ回数のカウント
    const maxRetries = 3 // 最大リトライ回数
    const retryDelay = 5000 // 再試行までの遅延時間（ミリ秒）

    const reworldload = () => {
        const area = getSkyblockArea()

        // エリアが取得できた場合
        if (area) {
        // ChatLib.chat(`${testprefix} エリアの取得に成功しました: ${area}`)
            inatGarden = area === "Garden"
            return // 処理終了
        }

        // エリアが取得できなかった場合
        retryCount++
        if (retryCount <= maxRetries) {
          // ChatLib.chat(`${prefix} エリアの取得に失敗しました。${retryDelay / 1000}秒後に再試行します... (${retryCount}/${maxRetries})`)
            setTimeout(reworldload, retryDelay) // 再試行
        } else {
          // ChatLib.chat(`${prefix} 最大リトライ回数に達しました。エリアを取得できませんでした。`)
        }
    }

    reworldload() // 初回呼び出し
})

// box描写
register("renderWorld", () => {
    if (inatGarden && data.farm) {
        data.farm.forEach(farm => {
            const { x, y, z } = farm
            // 色設定
            const r = 255, g = 255, b = 255, alpha = 0.5

            // 描画
            renderFilledBox(x + 0.5, y - 0.005, z + 0.5, 1.005, 1.01, r / 255, g / 255, b / 255, alpha, true)
            renderBoxOutline(x + 0.5, y - 0.005, z + 0.5, 1.005, 1.01, r / 255, g / 255, b / 255, 1, 2, true)
        })
    }
})

register("command", () => {
    const playerX = Math.floor(Player.getX())
    const playerY = Math.floor(Player.getY())
    const playerZ = Math.floor(Player.getZ())
    ChatLib.chat(`&6${testprefix} &7| &bX=&a${playerX} &bY=&a${playerY} &bZ=&a${playerZ} &7| &eCOUNT=&c[1&7/&c7]&f←&7ここの数値`)
    ChatLib.chat("--------------------------------------------------------------")
}).setName("helpcommandImsun")

// 検知

let lastChatTime = 0;
/*
register("tick", () => {
    if (!inatGarden || !data.farm || !Array.isArray(data.farm)) return;

    const playerX = Math.floor(Player.getX());
    const playerY = Math.floor(Player.getY());
    const playerZ = Math.floor(Player.getZ());
    const maxc = Math.max(...data.farm.map(farm => farm.c));
    const now = Date.now();

    data.farm.forEach(farm => {
        if (farm.x === playerX && farm.y === playerY && farm.z === playerZ) {
            if (now - lastChatTime >= 10000 && config.sendchat) {
                let mes = `&6${testprefix} &7| &bX=&a${farm.x} &bY=&a${farm.y} &bZ=&a${farm.z} &7| &eCOUNT=&c[${farm.c}&7/&c${maxc}]`;

                // デバッグモードが無効の場合
                if (!debugg && farm.c === maxc) {
                    mes = `&6${testprefix} 一致する座標を発見: X=${farm.x}, Y=${farm.y}, Z=${farm.z}`;
                }

                new TextComponent(mes)
                    .setClick("run_command", `/SUN delete ${farm.x} ${farm.y} ${farm.z}`).setHover("show_text", `&bクリックして座標を削除！`).chat();

                lastChatTime = now;
            }
            try {
                World.playSound(sound3, 2, 1);
            } catch (e) {
                ChatLib.chat(`§cFailed to play sound: ${sound2}`);
            }
        }
    });
});

*/
// World.playSound(sound3, 2, 1);
registerWhen(register("tick", () => {
    const playerX = Math.floor(Player.getX());
    const playerY = Math.floor(Player.getY());
    const playerZ = Math.floor(Player.getZ());
    const maxc = Math.max(...data.farm.map(farm => farm.c));
    let value = true
    data.farm.forEach(farm => {
        if (farm.x === playerX && farm.y === playerY && farm.z === playerZ) {
            try {
                World.playSound(sound3, 1, 1)
            } catch (e) {
                ChatLib.chat(`${e}`)
            }
            if ( config.sendchat && value) {
                value = false
            let mes = `&6${testprefix} &7| &bX=&a${farm.x} &bY=&a${farm.y} &bZ=&a${farm.z} &7| &eCOUNT=&c[${farm.c}&7/&c${maxc}]`;
                new TextComponent(mes).setClick("run_command", `/SUN delete ${farm.x} ${farm.y} ${farm.z}`).setHover("show_text", `&bクリックして座標を削除！`).chat();
            setTimeout(() => {
                value = true
            }, 10000);
        }
            }
    })
}), () => inatGarden)


// 現在のエリアを表示するコマンド
register("command", () => {
    const area = getSkyblockArea() // 現在のエリアを取得
    if (area) {
        ChatLib.chat(`${testprefix} 現在のエリアは: ${area}`) // エリア名をチャットに表示
    } else {
        ChatLib.chat(`${testprefix} エリアの取得に失敗しました。`) // エリアが取得できなかった場合のメッセージ
    }
}).setName("area", true)

const LOCKED_SENSITIVITY = -1 / 3 // マウスロック時の感度※(0.333...)

// マウスロック機能


register("command", (arg) => {
    const minecraft = Client.getMinecraft()
    const settings = minecraft.field_71474_y

    if (arg === "true") {
        if (Math.abs(settings.field_74341_c - LOCKED_SENSITIVITY) < 0.00001) {
            new TextComponent(`${testprefix} &cマウスロックは既に実行されています。`).setClick("run_command", `/$$$$$$`).setHover("show_text", `&bクリックしてコマンドを実行。`).chat()
        } else {
            data.original = settings.field_74341_c
            data.save()
            settings.field_74341_c = LOCKED_SENSITIVITY
            new TextComponent(`${testprefix} &aマウスロックを実行しました。`).setClick("run_command", `/$$$$$$`).setHover("show_text", `&bクリックしてコマンドを実行。`).chat()
        }
    } else if (arg === "false") {
        if (data.original !== undefined && data.original !== null) {
            settings.field_74341_c = data.original
            data.original = null
            data.save()
            new TextComponent(`${testprefix} &cマウスロックを解除しました。`).setClick("run_command", `/$$$$$$`).setHover("show_text", `&bクリックしてコマンドを実行。`).chat()
        } else {
            new TextComponent(`${testprefix} &eマウスロックは有効化されていません。`).setClick("run_command", `/$$$$$$`).setHover("show_text", `&bクリックしてコマンドを実行。`).chat()
        }
    } else {
        ChatLib.chat(`${testprefix} &e引数は 'true' または 'false' で指定してください。`)
    }
}).setTabCompletions((arg) => {
    if (arg.length === 1) return ["true", "false"]
    return []
}).setName("mouselock", true)


// PESTTIMER
let action = false
let text = new Text("").setScale(1).setShadow(true).setAlign("CENTER").setColor(Renderer.color(85, 255, 85))

registerWhen(register("renderOverlay", () => {
    text.setString(getrep())
    text.draw(data.sprayDisplay.x, data.sprayDisplay.y)
    text.setScale(data.sprayDisplay.scale)
}), () => inatGarden && config.sprayDisplay)


register("command", () => {
    // ChatLib.chat(`${TabList.getNames()}`)
    getrep()
}).setName("ppppppp")

register("command", (arg1, arg2, arg3, arg4) => {
    if (arg1 === "add") {
        if (!isNaN(arg2)) {
            const playerX = Math.floor(Player.getX())
            const playerY = Math.floor(Player.getY())
            const playerZ = Math.floor(Player.getZ())
            const maxc = arg2
            if (!data.farm) data.farm = { c: 0, list: [] }
            if (data.farm.c == null) data.farm.c = 0 // null または undefined の場合、0 にする            
                const cc = maxc
                // 新しい座標データを追加
                data.farm.push({ x: playerX, y: playerY, z: playerZ, c: cc })
                data.save()
                const mes = `${testprefix} 現在の座標を保存しました: X=${playerX}, Y=${playerY}, Z=${playerZ} (Count: ${maxc})`
                new TextComponent(mes).setClick("run_command", `/SUN delete ${playerX} ${playerY} ${playerZ}`).setHover("show_text", `&bクリックして座標を削除！`).chat()
        } else if (!arg2) {
            const mes = `${testprefix} 引数が不足しています! 使い方に関しましては/sun helpをお読みください！`
            new TextComponent(mes).setClick("run_command", `/sun help`).setHover("show_text", `&bクリックして/sun helpを実行。`).chat()
        }
    } else if (arg1 === "delete") {
        if (!arg2 || !arg3 || !arg4) {
            ChatLib.chat("&c引数が不足しています。/deloc <X> <Y> <Z> の形式で入力してください。")
            return
        }
    
        const x = parseInt(arg2)
        const y = parseInt(arg3)
        const z = parseInt(arg4)
    
        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            ChatLib.chat("&c座標が無効です。正しい数字を入力してください。")
            return
        }
    
        const initialCount = data.farm.length
        data.farm = data.farm.filter(farm => farm.x !== x || farm.y !== y || farm.z !== z)
    
        const deletedCount = initialCount - data.farm.length
    
        if (deletedCount === 0) {
            ChatLib.chat("&c指定された座標は見つかりませんでした。")
        } else {
            data.save()
            ChatLib.chat(`${testprefix} 座標 X=${x}, Y=${y}, Z=${z} が ${deletedCount} 件削除されました。`);
        }
    } else if (arg1 === "list") {
        if (!data.farm || data.farm.length === 0) {
            ChatLib.chat("&c保存された座標はありません。")
            return
        }
    
        ChatLib.chat(`${testprefix} 保存された座標一覧:`)
        data.farm.forEach((farm, index) => {
            let mes = `${testprefix} ${index + 1}: X=${farm.x}, Y=${farm.y}, Z=${farm.z}`
            new TextComponent(mes).setClick("run_command", `/SUN delete ${farm.x} ${farm.y} ${farm.z}`).setHover("show_text", `&bクリックして座標を削除！`).chat()
        })
    } else if (arg1 === "gui") {
        ChatLib.command(`sungui`, true)
    } else if (arg1 === "help") {
        help()
    } else if (arg1 === "data") {
        if (arg2 === "delete") {
            plotdata.farm.length = 0
            ChatLib.chat(`${testprefix} データをリセットしました。`)
            plotdata.save()
        }
    } else {
        help()
    }
}).setTabCompletions((args) => {
    const sub = args[0]
    if (args.length === 1) return ["add", "delete", "list", "gui", "help", "data"]
    if (args.length === 2 && sub === "data") return ["delete"]
    return []
}).setName("SUN")

register("command", () => {
    getpestplot()
}).setName("getplot")

/*
const myKey = new KeyBind("TEST ", Keyboard.KEY_H, "SUN")

register("tick", () => {
    if (myKey.isPressed()) {
        ChatLib.chat("Rキーが押されました")
    }
})
*/

function removeyourplotprefix(line) {
    return line.removeFormatting().replace(/^Plot -\s*/, "");
}


let opend = false;
const p = {
    slot: []
};

// GUI が開かれたときにスロット検出
register("guiOpened", () => {
    Client.scheduleTask(3, () => {
        const inv = Player.getOpenedInventory();
        if (!inv || inv.getName() !== "Configure Plots") return;

        const items = inv.getItems();
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (!item) continue;

            const id = item.getRegistryName();
            const lore = item.getLore();
            p.slot.push({ subgui: i, r: 1, g: 0, b: 0 });

            // ChatLib.chat(`Slot ${i} に ${id} を検出`);
            
            const matchLine = lore.find(line => line.includes("Plot"));
            if (matchLine) {
                // ChatLib.chat(`見つかったロア: &a${matchLine} i ${i}`);
                const cleanLine = matchLine.removeFormatting();
                    if (!plotdata.farm.find(obj => obj.match === removeyourplotprefix(cleanLine))) {
                        // match: plotの名前, cleanLine: i, p: plotの番号
                        plotdata.farm.push({ match: removeyourplotprefix(cleanLine), i: i, p: plotMap[i]});
                        plotdata.save();
                    }
            } else {
                // ChatLib.chat("&7> ロアなし");
            }
        }
    });
});

let tped = false;

register("command", () => {
    let didTp = false

    plotdata.farm.forEach(farm => {
        const target1 = String(getpestplotsec()[0]);
        const target2 = String(getpestplotsec()[1]);

        if (!didTp && String(farm.p) === target1 && farm.p !== tped) {
            tped = farm.p;
            ChatLib.command(`tptoplot ${farm.match}`);
            // ChatLib.chat(`${tped}`);
            didTp = true;
        } else if (!didTp && String(farm.p) === target2 && farm.p !== tped) {
            tped = farm.p;
            ChatLib.command(`tptoplot ${farm.match}`);
            // ChatLib.chat(`${tped}`);
            didTp = true;
        }
    });
}).setName("pestwhere");


register("command", () => {
    ChatLib.chat(`${getpestplotsec()}`)
}).setName("aiuep")

/*
// GUI が閉じられたらオフにする
register("guiClosed", () => {
    opend = false;
});

// ハイライト描画
register("guiRender", (mx, my, gui) => {
    if (!opend) return;
    if (p.slot && Array.isArray(p.slot)) {
        p.slot.forEach(slot => {
            highlightSlot(gui, slot.subgui, slot.r, slot.g, slot.b, 0.5, false);
        });
    }
});
*/

register("command", () => {
    if (data.original === null) {
        ChatLib.command(`mouselock true`, true)
    } else {
        ChatLib.command(`mouselock false`, true)
    }
}).setName("$$$$$$")