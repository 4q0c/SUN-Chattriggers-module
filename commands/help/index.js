import { data } from "../../util/data"

const mesgui = `&b/gui: GUIを表示します。`
let gui = "/" + "SUN gui"
const mesadd = "&b/add <count>: 現在の座標を保存します。<count>は座標のカウントです。"
const meslis = "&b/list: 保存された座標の一覧を表示します。"
const mesmou = "&b/mouselock <true|false> 視点移動を制限します。"
const mesres = "&b/sun data delete このコマンドを使うことでplotのデータをリセットすることができます。"

export function help() {
    ChatLib.chat("&8&m----------------------------------------------------")
    ChatLib.chat("&6&l[SUNコマンドの使い方]")

    // GUI起動
    ChatLib.chat(" &e▶ &aGUIを開く:")
    new TextComponent("     &b▸ /sun gui").setClick("suggest_command", `${gui}`).setHover("show_text", "&7クリックで入力欄にコマンドが入ります").chat()

    // 見本表示
    ChatLib.chat(" &e▶ &a見本を表示:")
    new TextComponent("     &b▸ /helpcommandImsun").setClick("run_command", "/helpcommandImsun").setHover("show_text", "&7クリックで実行").chat()

    // リスト表示
    ChatLib.chat(" &e▶ &aリストを確認:")
    new TextComponent("     &b▸ /sun list").setClick("run_command", "/sun list").setHover("show_text", "&7クリックで実行").chat()

    // 削除
    ChatLib.chat(" &e▶ &a特定座標の削除:")
    ChatLib.chat("     &b▸ /delete <X> <Y> <Z>")

    // マウス座標削除（仮）
    ChatLib.chat(" &e▶ &aマウスロック:")
    if (data.original === null) {
        new TextComponent("     &b▸ /mouselock true").setClick("run_command", "/$$$$$$").setHover("show_text", "&7クリックで実行").chat()
    } else {
        new TextComponent("     &b▸ /mouselock false").setClick("run_command", "/$$$$$$").setHover("show_text", "&7クリックで実行").chat()
    }

    // plot削除
    ChatLib.chat(" &e▶ &cplotデータを削除:")
    new TextComponent("     &b▸ /sun data delete").setClick("run_command", "/sun data delete").setHover("show_text", "&c⚠ plotデータが消えてしまうので慎重に！").chat()

    ChatLib.chat("&8&m----------------------------------------------------")
}
