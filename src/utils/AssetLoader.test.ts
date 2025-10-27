import { AssetLoader } from "./AssetLoader";
import * as PIXI from "pixi.js";
import { sound } from "./sound";

// ---- Mock PIXI and sound dependencies ----
jest.mock("pixi.js", () => ({
  Assets: {
    init: jest.fn(),
    addBundle: jest.fn(),
    loadBundle: jest.fn(),
  },
  Texture: jest.fn(),
}));

jest.mock("./sound", () => ({
  sound: {
    add: jest.fn(),
  },
}));

describe("AssetLoader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes PIXI.Assets on construction", () => {
    new AssetLoader();
    expect(PIXI.Assets.init).toHaveBeenCalledWith({ basePath: "" });
  });

  it("loads all assets successfully", async () => {
    // Mock image & spine bundle results
    (PIXI.Assets.loadBundle as jest.Mock)
      .mockResolvedValueOnce({ symbol1: {}, symbol2: {} }) // images
      .mockResolvedValueOnce({ spine1: {} }); // spines

    const loader = new AssetLoader();

    await loader.loadAssets();

    // Should register image & spine bundles
    expect(PIXI.Assets.addBundle).toHaveBeenCalledWith(
      "images",
      expect.any(Array)
    );
    expect(PIXI.Assets.addBundle).toHaveBeenCalledWith(
      "spines",
      expect.any(Array)
    );

    // Should load both bundles
    expect(PIXI.Assets.loadBundle).toHaveBeenNthCalledWith(1, "images");
    expect(PIXI.Assets.loadBundle).toHaveBeenNthCalledWith(2, "spines");

    // Should call sound.add() for each file
    expect(sound.add).toHaveBeenCalledTimes(3);
    expect(sound.add).toHaveBeenCalledWith(
      "Reel spin",
      expect.stringContaining("Reel spin.webm")
    );
  });

  it("handles spine loading errors gracefully", async () => {
    (PIXI.Assets.loadBundle as jest.Mock)
      .mockResolvedValueOnce({}) // images succeed
      .mockRejectedValueOnce(new Error("Spine failed")); // spines fail

    const loader = new AssetLoader();
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await loader.loadAssets();

    expect(consoleError).toHaveBeenCalledWith(
      "Error loading spine animations:",
      expect.any(Error)
    );

    consoleError.mockRestore();
  });

  it("throws error if overall asset loading fails", async () => {
    (PIXI.Assets.loadBundle as jest.Mock).mockRejectedValueOnce(
      new Error("load failed")
    );

    const loader = new AssetLoader();
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await expect(loader.loadAssets()).rejects.toThrow("load failed");

    expect(consoleError).toHaveBeenCalledWith(
      "Error loading assets:",
      expect.any(Error)
    );

    consoleError.mockRestore();
  });
});
