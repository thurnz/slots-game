import * as PIXI from "pixi.js";
import { SlotMachine } from "./SlotMachine";
import { sound } from "../utils/sound";

// Mock sound to prevent real audio calls
jest.mock("../utils/sound", () => ({
  sound: {
    play: jest.fn(() => console.log("Mocked sound.play called")),
    stop: jest.fn(() => console.log("Mocked sound.stop called")),
  },
}));

// Mock Reel class
const startSpinMock = jest.fn();
const stopSpinMock = jest.fn();

jest.mock("./Reel", () => {
  return {
    Reel: jest.fn().mockImplementation(() => ({
      container: new PIXI.Container(),
      startSpin: startSpinMock,
      stopSpin: stopSpinMock,
      update: jest.fn(),
    })),
  };
});

describe("SlotMachine", () => {
  let app: PIXI.Application;
  let slotMachine: SlotMachine;

  beforeEach(() => {
    jest.useFakeTimers(); // So we can fast-forward setTimeouts
    jest.clearAllMocks();
    app = new PIXI.Application({ width: 800, height: 600 });
    slotMachine = new SlotMachine(app);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("plays spin sound when spin() is called", () => {
    slotMachine.spin();
    expect(sound.play).toHaveBeenCalledWith("Reel spin");
  });

  it("calls startSpin on all reels when spin() is called", () => {
    slotMachine.spin();

    // Fast-forward timeouts
    jest.runAllTimers();

    // There are 4 reels in SlotMachine
    expect(startSpinMock).toHaveBeenCalledTimes(4);
  });

  it("calls stopSpin on all reels when spin() finishes", () => {
    slotMachine.spin();

    jest.runAllTimers(); // Advance all the setTimeouts (spin + stop)

    expect(stopSpinMock).toHaveBeenCalledTimes(4);
    expect(sound.stop).toHaveBeenCalledWith("Reel spin");
  });

  it("plays win sound and shows animation when randomWin is true", () => {
    // Force Math.random() < 0.3
    jest.spyOn(global.Math, "random").mockReturnValue(0.1);

    const winSpine = {
      visible: false,
      state: {
        hasAnimation: jest.fn().mockReturnValue(true),
        setAnimation: jest.fn(),
      },
    } as any;

    // Inject fake winAnimation directly
    (slotMachine as any).winAnimation = winSpine;

    // Run checkWin manually
    (slotMachine as any).checkWin();

    expect(sound.play).toHaveBeenCalledWith("win");
    expect(winSpine.visible).toBe(true);
    expect(winSpine.state.setAnimation).toHaveBeenCalledWith(0, "start", false);

    jest.spyOn(global.Math, "random").mockRestore();
  });

  it("does not play win sound when randomWin is false", () => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.9); // No win

    const winSpine = {
      visible: false,
      state: {
        hasAnimation: jest.fn().mockReturnValue(true),
        setAnimation: jest.fn(),
      },
    } as any;

    (slotMachine as any).winAnimation = winSpine;

    (slotMachine as any).checkWin();

    // sound.play("win") should not be called this time
    expect(sound.play).not.toHaveBeenCalledWith("win");
    expect(winSpine.visible).toBe(false);

    jest.spyOn(global.Math, "random").mockRestore();
  });

  it("updates all reels when update() is called", () => {
    const delta = 1.5;

    // Call the update method
    slotMachine.update(delta);

    // Each reel’s mock update() should be called once with delta
    expect((slotMachine as any).reels.length).toBe(4);
    for (const reel of (slotMachine as any).reels) {
      expect(reel.update).toHaveBeenCalledWith(delta);
    }
  });
});
