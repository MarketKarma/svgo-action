const silent = jest.fn()
  .mockReturnValue(undefined)
  .mockName("import-cwd::silent");

export default {
  silent,
};
