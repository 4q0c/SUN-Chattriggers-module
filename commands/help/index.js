const mesgui = `&7/gui: GUIを表示します。`
let gui = "/" + "SUN gui"
const mesadd = "&7/add <count>: 現在の座標を保存します。<count>は座標のカウントです。"
const meslis = "&7/list: 保存された座標の一覧を表示します。"



export function help() {
    ChatLib.chat("--------------------------------------------------------------")
    ChatLib.chat("&aSUNコマンドの使用方法:")
    ChatLib.chat("&7/delete <X> <Y> <Z>: 指定した座標を削除します。")
    new TextComponent(meslis).setClick("run_command", `/sun list`).chat()
    new TextComponent(mesgui).setClick("suggest_command", `${gui}`).chat()
    new TextComponent(mesadd).setClick("run_command", `/helpcommandImsun`).chat()
    ChatLib.chat("--------------------------------------------------------------")
}
