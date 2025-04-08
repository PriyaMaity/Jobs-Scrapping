# 🧲 Job Scraping 

This Node.js project scrapes job listings from [TimesJobs](https://www.timesjobs.com) based on a specific job category (e.g., IT software) and stores the results in an Excel file.

---

## 📦 Features

- Scrapes multiple pages of job listings
- Extracts:
  - Job Title
  - Company Name
  - Location
  - Posted Date
  - Job Description
- Converts the results into a structured Excel file
- Saves raw HTML for debugging

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/jobs-scraping.git
cd jobs-scraping
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Scraper

```bash
npm start
```

This will:
- Fetch job listings from pages 1–20
- Save raw HTML to `jobs.txt`
- Extract relevant job details
- Export to `Jobs-Scrapping.xlsx`

---

## 🛠 Project Structure

```plaintext
├── index.js              # Main scraping logic
├── jobs.txt              # Raw HTML of job listing page (for debugging)
├── Jobs-Scrapping.xlsx   # Final exported Excel file
├── package.json          # Project metadata and dependencies
└── README.md             # Project documentation
```

---

## 📁 Output Example

Each job entry in the Excel file contains:

| Job Title       | Company Name | Location | Posted Date | Description       |
|-----------------|--------------|----------|-------------|-------------------|
| Software Dev... | ABC Tech     | Mumbai   | 2025-04-05  | Knowledge of JS...|

---
### 📊 Excel Sheet Output  
[👉 Click here to download Excel sheet](https://github.com/PriyaMaity/Jobs-Scrapping/raw/main/Jobs-Scrapping-1.xlsx)

------
## 🧩 Dependencies

- [axios](https://www.npmjs.com/package/axios) - For HTTP requests
- [cheerio](https://www.npmjs.com/package/cheerio) - For HTML parsing
- [xlsx](https://www.npmjs.com/package/xlsx) - For Excel export
- [nodemon](https://www.npmjs.com/package/nodemon) (dev) - For auto-restarting during development

---

## ⚠️ Disclaimer

This project is for educational purposes only. Please review [TimesJobs](https://www.timesjobs.com) terms of service before using this scraper at scale.

---

## 👩‍💻 Author

**Priya**

---

## 📃 License

This project is licensed under the ISC License.
```
