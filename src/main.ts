import * as core from "@actions/core";
import * as github from "@actions/github";

import SVGOptimizer from "./svgo";
import { decode, encode } from "./encoder";
import {
  PR_NOT_FOUND,

  CommitInfo,
  FileData,
  FileInfo,

  getPrFile,
  getPrFiles,
  getPrNumber,

  commit,
} from "./github-api";


const SVG_FILE_EXTENSION = ".svg";

const STATUS_ADDED = "added";
const STATUS_MODIFIED = "modified";


function svgFiles(fileInfo: FileInfo): boolean {
  return fileInfo.path.endsWith(SVG_FILE_EXTENSION);
}

function existingFiles(fileInfo: FileInfo): boolean {
  return fileInfo.status === STATUS_MODIFIED
      || fileInfo.status === STATUS_ADDED;
}

export default async function main(): Promise<boolean> {
  try {
    const token = core.getInput("repo-token", { required: true });
    const configPath = core.getInput("configuration-path", { required: true });

    const prNumber: number = getPrNumber();
    if (prNumber === PR_NOT_FOUND) {
      core.error("Could not get Pull Request number from context, exiting");
      return false;
    }

    const svgo: SVGOptimizer = new SVGOptimizer();
    const client: github.GitHub = new github.GitHub(token);

    core.debug(`fetching changed files for pull request #${prNumber}`);
    const prFiles: FileInfo[] = await getPrFiles(client, prNumber);
    core.debug(`the pull request contains ${prFiles.length} file(s)`);

    const prSvgs: FileInfo[] = prFiles.filter(svgFiles).filter(existingFiles);
    core.debug(`the pull request contains ${prSvgs.length} SVG(s)`);

    core.debug(`fetching content of files in pull request #${prNumber}`);
    for (const svgFileInfo of prSvgs) {
      core.debug(`fetching file contents of '${svgFileInfo.path}'`);
      const fileData: FileData = await getPrFile(client, svgFileInfo.path);

      core.debug(`decoding ${fileData.encoding}-encoded '${svgFileInfo.path}'`);
      const originalSvg: string = decode(fileData.content, fileData.encoding);

      core.debug(`optimizing '${svgFileInfo.path}'`);
      const optimizedSvg: string = await svgo.optimize(originalSvg);

      core.debug(`encoding optimized '${svgFileInfo.path}' back to ${fileData.encoding}`);
      const optimizedData: string = encode(optimizedSvg, fileData.encoding);

      core.debug(`committing optimized '${svgFileInfo.path}'`);
      const commitInfo: CommitInfo = await commit(
        client,
        fileData.path,
        optimizedData,
        fileData.encoding,
        `Optimize '${fileData.path}' with SVGO`
      );

      core.debug(`commit successful (see ${commitInfo.url})`);
    }

    return true;
  } catch (error) {
    console.log(error);
    // core.error(error);
    // core.setFailed(error.message);

    return false;
  }
}


main();
