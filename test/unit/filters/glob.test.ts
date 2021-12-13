import type { IMinimatch } from "minimatch";

jest.mock("minimatch");

import * as minimatch from "minimatch";

import New from "../../../src/filters/glob";

const Minimatch = minimatch.Minimatch as jest.MockedClass<typeof minimatch.Minimatch>; // eslint-disable-line max-len

describe("filters/glob.ts", () => {
  describe("::New", () => {
    beforeEach(() => {
      Minimatch.mockClear();
    });

    test("a file matching the glob", () => {
      const query = "foo/bar.svg";

      const match = jest.fn().mockReturnValue(true);
      Minimatch.mockReturnValueOnce({ match } as unknown as IMinimatch);

      const  filter = New("foo/*");

      const result = filter(query);
      expect(result).toBe(false);
      expect(match).toHaveBeenCalledWith(query);
    });

    test("a file not matching the glob", () => {
      const query = "foobar.svg";

      const match = jest.fn().mockReturnValue(false);
      Minimatch.mockReturnValueOnce({ match } as unknown as IMinimatch);

      const  filter = New("foo/*");

      const result = filter(query);
      expect(result).toBe(true);
      expect(match).toHaveBeenCalledWith(query);
    });
  });
});
