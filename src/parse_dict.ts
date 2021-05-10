import fs from "fs";
import { compact, flow, map, split, trim, uniqBy } from "lodash";
import { Parser } from "json2csv";

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
      map(x, ([locationCode, province]) => [
        `GHCND:TH0000${locationCode.slice(0, 5)}`,
        province
      ]),
    (x) => uniqBy(x, (x) => x[0]),
    (x) => map(x, (pair) => ({ station_id: pair[0], province_code: pair[1] }))
  )(text);

  const fields = ["station_id", "province_code"];
  const parser = new Parser({ fields });
  const csv = parser.parse(cleanedPairs);

  fs.writeFileSync("parse_table.csv", csv);
};
run();
