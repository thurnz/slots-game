module.exports = {
  Application: jest.fn().mockImplementation(() => ({
    screen: { width: 1280, height: 800 },
    stage: {
      addChild: jest.fn(),
      scale: { set: jest.fn() },
      position: { set: jest.fn() },
      pivot: { set: jest.fn() },
    },
    renderer: { resize: jest.fn() },
    ticker: { add: jest.fn() },
  })),
  Container: jest.fn().mockImplementation(() => ({
    addChild: jest.fn(),
  })),
  Graphics: jest.fn().mockImplementation(() => ({
    beginFill: jest.fn(),
    drawRect: jest.fn(),
    endFill: jest.fn(),
  })),
  Sprite: jest.fn(),
};
