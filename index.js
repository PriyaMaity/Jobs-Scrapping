const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const xlsx = require("xlsx");

const fetchData = async () => {
  try {
    let jobs = [];

    for (let seq = 1; seq <= 20; seq++) {
      const res = await axios.get(
        `https://www.timesjobs.com/candidate/job-search.html?from=submit&luceneResultSize=25&postWeek=60&searchType=Home_Search&cboPresFuncArea=35&pDate=Y&sequence=${seq}&startPage=1`
      );

      const $ = cheerio.load(res.data);
      const jobCard = $(".new-joblist");

      jobCard.each((idx, ele) => {
        const jobTitle = $(ele).find("h2.heading-trun > a").text().trim();
        const companyName = $(ele).find("h3.joblist-comp-name").text().trim();
        let locationEl = $(ele).find("li.srp-zindex.location-tru");
        let location = locationEl.attr("title") || locationEl.text() || "";
        location = location.trim();

        let postedDateText = $(ele).find(".sim-posted span").text().trim();
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

        const description = $(ele).find(".job-description__").text().trim();

        if (jobTitle && companyName && location && actualDate && description) {
          jobs.push({
            JobTitle: jobTitle,
            CompanyName: companyName,
            Location: location,
            PostedDate: actualDate,
            Description: description,
          });
        }
      });

      console.log(`Page ${seq} processed, total jobs: ${jobs.length}`);
    }

    const workBook = xlsx.utils.book_new();
    const sheet = xlsx.utils.json_to_sheet(jobs);
    xlsx.utils.book_append_sheet(workBook, sheet, "Jobs");
    xlsx.writeFile(workBook, "Jobs-Scrapping.xlsx");

    console.log(" XLSX file created successfully!");
  } catch (err) {
    console.error(" Error:", err);
  }
};

fetchData();
