const mesgui = `&b/gui: GUIを表示します。`
let gui = "/" + "SUN gui"
const mesadd = "&b/add <count>: 現在の座標を保存します。<count>は座標のカウントです。"
const meslis = "&b/list: 保存された座標の一覧を表示します。"


export function help() {
    ChatLib.chat("--------------------------------------------------------------")
    ChatLib.chat("&aSUNコマンドの使用方法:")
    new TextComponent(mesgui).setClick("suggest_command", `${gui}`).chat()
    new TextComponent(mesadd).setClick("run_command", `/helpcommandImsun`).setHover("show_text", `&bクリックして見本を表示。`).chat()
    new TextComponent(meslis).setClick("run_command", `/sun list`).chat()
    ChatLib.chat("&b/delete <X> <Y> <Z>: 指定した座標を削除します。")
    ChatLib.chat("&b/mouselock <true|false> 視点移動を制限します。")
    ChatLib.chat("--------------------------------------------------------------")
}
