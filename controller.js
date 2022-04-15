const puppeteer = require("puppeteer");
const reponseHandler = require("./utills");

exports.get = async (req, res) => {
  URL = req.body.url;
  if (!URL) {
    return res.json(reponseHandler(400, "URL is missing"));
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: "domcontentloaded" });

    const result = await page.$$eval("#customerReviews .review", (reviews) => {
      let rowList = [];
      reviews.forEach((review) => {
        let record = {};
        // To get name and date of review
        Array.from(review.querySelectorAll(".reviewer"), (column) => {
          const temp = column.querySelectorAll("dd");
          record.name = temp[0].innerText;
          record.date = temp[1].innerText;
        });
        review.querySelectorAll(".itemReview");

        record.Overall = review
          .querySelectorAll("dd")[0]
          .innerText.replaceAll("\n", "");

        record.review = review.querySelector("blockquote").innerText;
        // record.date = name_date[1];
        rowList.push(record);
      });
      return rowList;
    });
    await browser.close();
    return res.json(reponseHandler(200, result));
  } catch (error) {
    return res.json(reponseHandler(500, error));
  }
};
