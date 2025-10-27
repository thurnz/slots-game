module.exports = {
  Spine: jest.fn().mockImplementation(() => ({
    state: {
      hasAnimation: jest.fn().mockReturnValue(true),
      setAnimation: jest.fn(),
    },
    visible: false,
    addEventListener: jest.fn(),
  })),
};
