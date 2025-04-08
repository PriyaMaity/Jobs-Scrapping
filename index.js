const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("node:fs");
const xlsx = require("xlsx");

const cleanText = (text) =>
  text
    .replace(/\s+/g, " ") // Collapse multiple spaces/newlines/tabs into one space
    .replace(/&nbsp;/g, " ") // Decode HTML space
    .replace(/&amp;/g, "&") // Decode HTML ampersand
    .trim();

const fetchData = async () => {
  try {
    let jobs = [];
    for (let seq = 1; seq < 21; seq++) {
      const res = await axios.get(
        `https://www.timesjobs.com/candidate/job-search.html?from=submit&luceneResultSize=25&postWeek=60&searchType=Home_Search&cboPresFuncArea=35&pDate=Y&sequence=${seq}&startPage=1`
      );

      fs.writeFile("jobs.txt", res.data, (err) => {
        if (err) {
          console.log(err, "Error in creating File");
        }
        console.log("File Created Succesfully");
        const data = fs.readFileSync("jobs.txt", "utf-8");
        const $ = cheerio.load(data);
        // console.log($, "cheerio");

        const jobCard = $(".new-joblist");
        jobCard.each((idx, ele) => {
          const jobTitle = cleanText($(ele).find("h2.heading-trun > a").text());
          // console.log(jobTitle, "job_title");

          const companyName = cleanText(
            $(ele).find("h3.joblist-comp-name").text()
          );
          // console.log(companyName, "company Name");

          let locationEl = $(ele).find("li.srp-zindex.location-tru");
          let location = cleanText(
            locationEl.attr("title") || locationEl.text() || ""
          );
          location = location.trim();
          console.log(location, "location");

          // const jobType = $(ele).find(".job-description__").text();
          // console.log(jobType, "jobType");

          let postedDateText = cleanText(
            $(ele).find(".sim-posted span").text().trim()
          );

          let actualDate = postedDateText;
          if (postedDateText.toLowerCase() === "posted today") {
            const today = new Date();
            actualDate = today.toISOString().split("T")[0];
          } else {
            const match = postedDateText.match(/(\d+)\s*day/i);
            if (match && match[1]) {
              const daysAgo = parseInt(match[1], 10);
              const now = new Date();
              now.setDate(now.getDate() - daysAgo);
              actualDate = now.toISOString().split("T")[0];
            }
          }

          console.log("Converted posted date:", actualDate);

          const description = cleanText(
            $(ele).find(".job-description__").text()
          );

          // console.log(description, "descriprtion");

          if (
            jobTitle &&
            companyName &&
            location &&
            actualDate &&
            description
          ) {
            jobs.push({
              JobTitle: jobTitle,
              CompanyName: companyName,
              Location: location,
              PostedDate: actualDate,
              Description: description,
            });
          }
        });
        console.log(jobs, "jobs");
        console.log(`Page ${seq} processed, total jobs so far: ${jobs.length}`);
      });
    }
    const workBook = xlsx.utils.book_new();
    const sheet = xlsx.utils.json_to_sheet(jobs);
    xlsx.utils.book_append_sheet(workBook, sheet, "jobs", {
      header: [
        "JobTitle",
        "CompanyName",
        "Location",
        "PostedDate",
        "Description",
      ],
    });
    xlsx.writeFile(workBook, "Jobs-Scrapping-1.xlsx");
    console.log("XLSX file created successfully!");
  } catch (err) {
    console.log(err, "error while fetching data");
  }
};
fetchData();
