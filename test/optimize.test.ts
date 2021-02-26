import FileSystemMock from "./mocks/file-system.mock";
import * as inputs from "./mocks/inputs.mock";
import * as svgoImport from "./mocks/svgo.mock";

import { optimize } from "../src/optimize";


const config = new inputs.ActionConfig();
const svgo = new svgoImport.SVGOptimizer();


describe("optimize", () => {

  test("does something", async () => {
    await optimize(FileSystemMock, config, svgo);
    expect(FileSystemMock.listFiles).toHaveBeenCalled();
  });

});