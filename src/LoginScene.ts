import * as Phaser from 'phaser'
import { game } from './main'

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true,
    key: "Login"
};

export class LoginScene extends Phaser.Scene
{
    label = null;
    inputField = null;
    state = "USER";
    userBuffer = "";
    passBuffer = "";

	constructor()
	{
		super(sceneConfig);
	}

	init()
	{
	}

	preload()
    {
        this.label = this.add.text(200, 200, "ENTER YOUR USERNAME"); 
        this.inputField = this.add.text(200, 220, "_");
        console.log("LOADED");
    }

    public handleInput(event) {
        switch (this.state) {
            case "USER":
                console.log(event.keyCode);
                if (event.keyCode == 8 && this.inputField.text.length > 0) {
                    this.inputField.text = this.inputField.text.substring(0, this.inputField.text.length - 2);
                    this.inputField.text += "_";
                }
                else if (event.keyCode == 13) {
                    this.state = "PASS";
                    this.userBuffer = this.inputField.text.substring(0, this.inputField.text.length - 1);
                    this.inputField.text = "_";
                    this.label.text = "ENTER YOUR PASSWORD";
                    //enter
                }
                else if (event.keyCode == 32 || (event.keyCode >= 48 && event.keyCode < 90)) {
                    console.log("CAPTURED " + event.key)
                    this.inputField.text = this.inputField.text.substring(0, this.inputField.text.length - 1);
                    this.inputField.text += event.key;
                    this.inputField.text += "_";
                }
                else {
                    //invalid input
                }
                break ;
            case "PASS":
                console.log("obfuscated");
                if (event.keyCode == 8 && this.inputField.text.length > 0) {
                    this.passBuffer = this.passBuffer.substring(0, this.passBuffer.length - 1);
                    this.inputField.text = this.inputField.text.substring(0, this.inputField.text.length - 2);
                    this.inputField.text += "_";
                }
                else if (event.keyCode == 13) {
                    console.log("LOGIN USER " + this.userBuffer);
                    this.registry.set("user", this.userBuffer);
                    this.registry.set("pass", this.passBuffer);
                    game.scene.start("GameScene");
                    game.scene.remove("Login");
                }
                else if (event.keyCode == 32 || (event.keyCode >= 48 && event.keyCode < 90)) {
                    console.log("BUFFERING INPUT");
                    this.passBuffer += event.key;
                    this.inputField.text += "*_";
                }
                else {
                    //invalid
                }
                break;
            default:
                console.log("why is there another state rn");
                break ;
        }
    }

    create()
    {
        this.input.keyboard.on('keydown', this.handleInput.bind(this));
		// TODO
	}

	selectButton(index: number)
	{
		// TODO
	}

	selectNextButton(change = 1)
	{
		// TODO
	}

	confirmSelection()
	{
		// TODO
	}
	
	update()
	{
	}
}