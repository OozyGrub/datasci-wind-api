import axios, { AxiosResponse } from "axios";
import fs from "fs";
import { flatten } from "lodash";

type NoaaResponse = {
  results: any[];
  metadata: any;
};

const run = async () => {
  const token = "lOFgkMxJfHJCktMkcFbPoiedmEIxXTJO";
  const baseUrl = "https://www.ncdc.noaa.gov/cdo-web/api/v2";
  for (let year = 2017; year <= 2017; year++) {
    console.log(`year: ${year}`);
    let yearData: any[] = [];

    const startDate = `${year}-01-01`;
    const endDate = `${year + 1}-01-01`;
    const locationId = "FIPS:TH";
    const datasetId = "GHCND";

    console.log("fetching api...");
    const pilotResponse: AxiosResponse<NoaaResponse> = await axios.get(
      `${baseUrl}/data?datasetid=${datasetId}&startdate=${startDate}&enddate=${endDate}&locationid=${locationId}`,
      {
        headers: {
          token
        }
      }
    );
    console.log("sending success!");
    const { count } = pilotResponse.data.metadata.resultset;
    console.log(count);

    for (let offset = 0; offset <= Math.round(count / 25); offset++) {
      console.log(
        `${new Date().toUTCString()} ${offset}/${Math.round(count / 25)}`
      );
      const response: AxiosResponse<NoaaResponse> = await axios.get(
        `${baseUrl}/data?datasetid=${datasetId}&startdate=${startDate}&enddate=${endDate}&locationid=${locationId}&offset=${
          offset * 25 + 1
        }`,
        {
          headers: {
            token
          }
        }
      );
      yearData.push(response.data.results);
    }

    fs.writeFileSync(
      `${datasetId}_${year}.json`,
      JSON.stringify(flatten(yearData), null, 2)
    );
  }
};
run();
