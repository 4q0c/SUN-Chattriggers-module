import {
    @ButtonProperty,
    @CheckboxProperty,
    Color,
    @ColorProperty,
    @PercentSliderProperty,
    @SelectorProperty,
    @SwitchProperty,
    @TextProperty,
    @Vigilant,
    @SliderProperty,
    @NumberProperty,
} from '../Vigilance/index';

@Vigilant("SUN", "§aSUN",  {
    getCategoryComparator: () => (a, b) => {
        const categories = ['General']
        return categories.indexOf(a.name) - categories.indexOf(b.name)
    }
})

class Settings {

    sprayDisplayGui = new Gui()

    @SwitchProperty({
        name: "Pest Repellent MAX Timer",
        description: "tickで計算していないので少し誤差あります。",
        category: "General",
        subcategory: "General"
    })
    sprayDisplay = false

    @ButtonProperty({
        name: "Move spray Display",
        description: "Scroll to change scale, middle click to reset",
        category: "General",
        subcategory: "General",
        placeholder: "Move"
    })
    MovesprayDisplayGui() {
        this.sprayDisplayGui.open()
    };

    @SwitchProperty({
        name: "Pet Change Alert",
        description: "Petがハリネズミの時知らせます。",
        category: "General",
        subcategory: "General"
    })
    petalert = false

    @SliderProperty({
        name: "Pitch",
        description: "これ小数点表せれないので 1/10 してください！ 0だと音量がなくなります。",
        category: "General",
        subcategory: "General",
        min: 0,
        max: 20,
    })
    petpitch = 1;

    @SwitchProperty({
        name: "XYZ+COUNT SEND CHAT",
        description: "登録した位置とカウントを教えてくれます。",
        category: "General",
        subcategory: "General"
    })
    sendchat = false

    /*
    @SwitchProperty({
        name: "Loc Sound",
        description: "設定された場所",
        category: "General"
    })
        */
    constructor() {
        this.initialize(this);
        
        const lines = [
            "§aSUNのChatのほとんどはTextComponentを使用しているためChatをクリックすると何かしらがおきます。"
        ]
        const commands = lines.join("\n")

        this.setCategoryDescription("General", commands)
        
        // このボタン押したらこのボタンを表示させるみたいなやつ。↓

        this.addDependency("Move spray Display", "Pest Repellent MAX Timer")
        this.addDependency("Pitch", "Pet Change Alert")
    }
}

export default new Settings()