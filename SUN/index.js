import { data } from "./util/data"; // データのインポート
import { renderBoxOutline, renderFilledBox } from "../BloomCore/RenderUtils";

const testprefix = "§6[§aSUN§6]";  // プレフィックス
const sound2 = 'random.orb'; // 音の設定

// notif
let text = new Text(`Touch down!`).setScale(2).setShadow(true).setAlign('CENTER').setColor(Renderer.color(255, 85, 85));

//debugg
let debugg = true;

register("command", () => {
    debugg = !debugg;
    if (debugg) {
        ChatLib.chat(`&7[&lデバッグ&7] &fデバッグモードが無効になりました。`); // 統一した表現で「デバッグモード」
    } else {
        ChatLib.chat(`&7[&lデバッグ&7] &fデバッグモードが有効になりました。`); // 統一した表現で「デバッグモード」
    }
}).setName("SUNdebugg");

// Skyblockエリアの取得
let inatGarden = false;
function getSkyblockArea() {
    const line = TabList.getNames().find(it => /^(Area|Garden): ([\w ]+)$/.test(it.removeFormatting()));
    if (line) {
        const match = line.removeFormatting().match(/^(Area|Garden): ([\w ]+)$/);
        if (match) return match[2];
    }
    return null;
}

// ワールドロード時にエリアを確認し、inatGardenを設定
register("worldload", () => {
    let retryCount = 0; // リトライ回数のカウント
    const maxRetries = 3; // 最大リトライ回数
    const retryDelay = 5000; // 再試行までの遅延時間（ミリ秒）

    const reworldload = () => {
        const area = getSkyblockArea();

        // エリアが取得できた場合
        if (area) {
            ChatLib.chat(`${testprefix} エリアの取得に成功しました: ${area}`);
            inatGarden = area === "Garden";
            return; // 処理終了
        }

        // エリアが取得できなかった場合
        retryCount++;
        if (retryCount <= maxRetries) {
          // ChatLib.chat(`${prefix} エリアの取得に失敗しました。${retryDelay / 1000}秒後に再試行します... (${retryCount}/${maxRetries})`);
            setTimeout(reworldload, retryDelay); // 再試行
        } else {
          // ChatLib.chat(`${prefix} 最大リトライ回数に達しました。エリアを取得できませんでした。`);
        }
    };

    reworldload(); // 初回呼び出し
});

// ワールド描画イベント
register("renderWorld", () => {
    if (inatGarden && data.farm) {
        data.farm.forEach(farm => {
            const { x, y, z } = farm;
            // 色設定
            const r = 255, g = 255, b = 255, alpha = 0.5;

            // 描画
            renderFilledBox(x + 0.5, y - 0.005, z + 0.5, 1.005, 1.01, r / 255, g / 255, b / 255, alpha, true);
            renderBoxOutline(x + 0.5, y - 0.005, z + 0.5, 1.005, 1.01, r / 255, g / 255, b / 255, 1, 2, true);
        });
    }
});

// オーバーレイ描画イベント
register("renderOverlay", () => {
    if (!inatGarden || !data.farm || !Array.isArray(data.farm)) return;

    const playerX = Math.floor(Player.getX());
    const playerY = Math.floor(Player.getY());
    const playerZ = Math.floor(Player.getZ());

    data.farm.forEach(farm => {
        if (farm.x === playerX && farm.y === playerY && farm.z === playerZ) {
            if (!debugg) {
                ChatLib.chat(`${testprefix} 一致する座標を発見: X=${farm.x}, Y=${farm.y}, Z=${farm.z}`);
            } else
            text.draw(Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 2 - 140);
            try {
                World.playSound(sound2, 2, 1);
            } catch (e) {
                ChatLib.chat(`§cFailed to play sound: ${sound2}`);
            }
        }
    });
});

// 保存された座標一覧表示コマンド
register("command", () => {
    if (!data.farm || data.farm.length === 0) {
        ChatLib.chat("&c保存された座標はありません。");
        return;
    }

    ChatLib.chat(`${testprefix} 保存された座標一覧:`);
    data.farm.forEach((farm, index) => {
        ChatLib.chat(`${testprefix} ${index + 1}: X=${farm.x}, Y=${farm.y}, Z=${farm.z}`);
    });
}).setName("loclist");

// 座標保存コマンド
register("command", () => {
    const playerX = Math.floor(Player.getX());
    const playerY = Math.floor(Player.getY());
    const playerZ = Math.floor(Player.getZ());

    const newFarm = { x: playerX, y: playerY, z: playerZ };

    if (!data.farm) data.farm = [];
    data.farm.push(newFarm);

    data.save();

    ChatLib.chat(`${testprefix} 現在の座標を保存しました: X=${newFarm.x}, Y=${newFarm.y}, Z=${newFarm.z}`);
}).setName("loc");

// locdelete コマンドの修正
register("command", (arg1, arg2, arg3) => {
    if (!arg1 || !arg2 || !arg3) {
        ChatLib.chat("&c引数が不足しています。/deloc <X> <Y> <Z> の形式で入力してください。");
        return;
    }

    const x = parseInt(arg1);
    const y = parseInt(arg2);
    const z = parseInt(arg3);

    if (isNaN(x) || isNaN(y) || isNaN(z)) {
        ChatLib.chat("&c座標が無効です。正しい数字を入力してください。");
        return;
    }

    const initialCount = data.farm.length;
    data.farm = data.farm.filter(farm => farm.x !== x || farm.y !== y || farm.z !== z);

    const deletedCount = initialCount - data.farm.length;

    if (deletedCount === 0) {
        ChatLib.chat("&c指定された座標は見つかりませんでした。");
    } else {
        data.save();
        ChatLib.chat(`${testprefix} 座標 X=${x}, Y=${y}, Z=${z} が ${deletedCount} 件削除されました。`);
    }
}).setName("deloc");

// 現在のエリアを表示するコマンド
register("command", () => {
    const area = getSkyblockArea(); // 現在のエリアを取得
    if (area) {
        ChatLib.chat(`${testprefix} 現在のエリアは: ${area}`); // エリア名をチャットに表示
    } else {
        ChatLib.chat(`${testprefix} エリアの取得に失敗しました。`); // エリアが取得できなかった場合のメッセージ
    }
}).setName("area");

let beaconPosition = null;

register("command", (x, y, z) => {
    // 入力されたx, y, zを保存
    beaconPosition = { x: parseFloat(x), y: parseFloat(y), z: parseFloat(z) };
    ChatLib.chat(`Beacon set at X:${x}, Y:${y}, Z:${z}`);
}).setName("locbeacon");

// 描画処理
register("renderWorld", () => {
    if (beaconPosition) {
        // ビーコン光線を描画
        renderBeaconBeam2(
            beaconPosition.x,
            beaconPosition.y,
            beaconPosition.z,
            1.0, // 赤
            1.0, // 緑
            1.0, // 青
            0.5, // 透明度
            true, // 深度チェック有効
            300   // 光線の高さ
        );
    }
});

//Help command
register("command", () => {
    ChatLib.chat(`${testprefix} {/loc} 現在位置を登録します。`)
    ChatLib.chat(`${testprefix} {/loclist} 登録した座標をチャットに表示します。`)
    ChatLib.chat(`${testprefix} {/deloc x y z} 登録した座標を削除します。`)
    ChatLib.chat(`${testprefix} {/locbeacon x y z} 入力した座標にビームを表示します。`)
    ChatLib.chat(`${testprefix} {/SUNdebugg} 登録した座標を通るとその座標をチャットに表示します。`)
}).setName("SUNhelp");