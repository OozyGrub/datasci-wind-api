import fs from "fs";
import {
  compact,
  filter,
  flow,
  forEach,
  map,
  slice,
  sortBy,
  split,
  trim,
  unionBy,
  uniqBy
} from "lodash";

const run = async () => {
  const text = fs.readFileSync("./resource/raw_th_dict.txt", {
    encoding: "utf8"
  });

  const cleanedPairs = flow(
    (x) => split(x, "</option>"),
    (x) => map(x, trim),
    (x) => map(x, (line) => /='(.*)'>([\w\s()/-]*)[.][\S\s]*/g.exec(line)),
    (x) => map(x, (line) => line?.slice(1)),
    compact,
    (x) =>
      map(x, ([locationCode, province]) => {
        return [`GHCND:TH0000${locationCode.slice(0, 5)}`, province];
      }),
    (x) => uniqBy(x, (x) => x[0])
  )(text);

  console.log(cleanedPairs);
};
run();
