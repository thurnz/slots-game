import * as PIXI from "pixi.js";
import { Reel } from "./Reel";
import { AssetLoader } from "../utils/AssetLoader";

// --- Mock PIXI & AssetLoader ---
jest.mock("pixi.js", () => ({
  Container: jest.fn().mockImplementation(() => ({
    addChild: jest.fn(),
  })),
  Sprite: jest.fn().mockImplementation(() => ({
    x: 0,
    width: 0,
    scale: { x: 1, y: 1 },
  })),
  Texture: jest.fn(),
}));

jest.mock("../utils/AssetLoader", () => ({
  AssetLoader: {
    getTexture: jest.fn(() => ({})),
  },
}));

describe("Reel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates the correct number of symbols", () => {
    const reel = new Reel(5, 100);
    expect(PIXI.Sprite).toHaveBeenCalledTimes(6); // symbolCount + 1
    expect((reel as any).symbols.length).toBe(6);
  });

  it("starts spinning when startSpin() is called", () => {
    const reel = new Reel(5, 100);
    reel.startSpin();
    expect((reel as any).isSpinning).toBe(true);
    expect((reel as any).speed).toBeGreaterThan(0);
  });

  it("stops spinning and begins slowing down when stopSpin() is called", () => {
    const reel = new Reel(5, 100);
    reel.startSpin();
    reel.stopSpin();
    expect((reel as any).isSpinning).toBe(false);
  });

  it("updates symbol positions while spinning", () => {
    const reel = new Reel(3, 50);
    reel.startSpin();
    const symbols = (reel as any).symbols;
    const initialX = symbols[0].x;

    reel.update(1); // one frame
    expect(symbols[0].x).not.toBe(initialX);
  });

  it("snaps to grid when slowing down", () => {
    const reel = new Reel(3, 50);
    const symbols = (reel as any).symbols;

    symbols.forEach((s: any, i: number) => (s.x = i * 50 - 47));
    (reel as any).speed = 4;
    (reel as any).isSpinning = false;

    reel.update(1);

    expect((reel as any).speed).toBeLessThanOrEqual(4);

    for (const s of symbols) {
      expect(Math.abs(Math.round(s.x) % 50)).toBe(0);
    }
  });
});
