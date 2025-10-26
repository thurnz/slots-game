import { Howl } from "howler";

// TODO: Implement sound player using the "howler" package
const sounds: Record<string, Howl> = {};

export const sound = {
    add: (alias: string, url: string): void => {
        console.log(`Sound added: ${alias} from ${url}`);
        sounds[alias] = new Howl({ src: [url] });
    },
    play: (alias: string): void => {
        console.log(`Playing sound: ${alias}`);
        sounds[alias].play();
    },
    stop: (alias: string): void => {
        sounds[alias].stop();
    }
};
