export const mockDateNow = (dVal: number) => {
  const nowOrig = Date.now;
  const mockNow = jest.fn().mockReturnValue(dVal);
  Date.now = mockNow;
  afterAll(() => {
    Date.now = nowOrig;
  });
  return mockNow;
};
