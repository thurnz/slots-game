import { Game } from "./Game";
import * as PIXI from "pixi.js";

// ✅ Mock PIXI.Application so it returns a valid canvas
jest.mock("pixi.js", () => {
  const actualPixi = jest.requireActual("pixi.js");
  return {
    ...actualPixi,
    Application: jest.fn().mockImplementation(() => ({
      view: document.createElement("canvas"), // ✅ Real DOM element
      stage: {
        addChild: jest.fn(),
        scale: { set: jest.fn() },
        position: { set: jest.fn() },
        pivot: { set: jest.fn() },
      },
      renderer: { resize: jest.fn() },
      ticker: { add: jest.fn() },
      screen: { width: 1280, height: 800 },
    })),
    Container: jest.fn().mockImplementation(() => ({
      addChild: jest.fn(),
      mask: null,
    })),
  };
});

// ✅ Mock other dependencies
jest.mock("./utils/AssetLoader", () => ({
  AssetLoader: jest.fn().mockImplementation(() => ({
    loadAssets: jest.fn().mockResolvedValue(undefined),
  })),
}));

jest.mock("./slots/SlotMachine", () => ({
  SlotMachine: jest.fn().mockImplementation(() => ({
    container: new PIXI.Container(),
    update: jest.fn(),
  })),
}));

jest.mock("./ui/UI", () => ({
  UI: jest.fn().mockImplementation(() => ({
    container: new PIXI.Container(),
  })),
}));

describe("Game", () => {
  let game: Game;

  beforeEach(() => {
    document.body.innerHTML = `<div id="game-container" style="width:1280px;height:800px;"></div>`;
    game = new Game();
  });

  it("initializes successfully", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    await game.init();

    const { AssetLoader } = require("./utils/AssetLoader");
    const { SlotMachine } = require("./slots/SlotMachine");
    const { UI } = require("./ui/UI");

    expect(AssetLoader).toHaveBeenCalled();
    expect(SlotMachine).toHaveBeenCalled();
    expect(UI).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Game initialized successfully");

    consoleSpy.mockRestore();
  });
});
