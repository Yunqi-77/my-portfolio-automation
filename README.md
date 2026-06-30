# 🚀 My Portfolio Automation Testing

An end-to-end (E2E) test automation framework built with **Playwright** and **TypeScript** to validate the functionality of my personal portfolio website.

## 🌐 Application Under Test

**Portfolio Website**

https://yunqi-77.github.io/my-portfolio/index.html

**Portfolio Source Code**

https://github.com/Yunqi-77/my-portfolio

---

# ✨ Features

* End-to-End web UI testing with Playwright
* TypeScript-based automation framework
* Page Object Model (POM) architecture
* Reusable fixtures for cleaner test code
* HTML test reports
* Headed and headless execution
* GitHub Actions CI workflow
* Easy-to-maintain project structure

---

# 🛠 Tech Stack

* Playwright
* TypeScript
* Node.js
* GitHub Actions

---

# 📂 Project Structure

```text
my-portfolio-automation/
│
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── docs/
│   └── Test Cases for My Portfolio.xlsx
│
├── pages/
│   ├── base/
│   │   ├── base.page.ts
│   │   └── fixtures.ts
│   │
│   ├── homepage/
│   │   └── homepage.page.ts
│   │
│   ├── about/
│   │   └── about.page.ts
│   │
│   └── project/
│       ├── projects.page.ts
│       └── projectDetail.page.ts
│
├── tests/
│   ├── homepage.spec.ts
│   ├── about.spec.ts
│   ├── projects.spec.ts
│   ├── e2e.spec.ts
│   └── advanced.spec.ts
│
├── playwright.config.ts
├── package.json
└── README.md
```

---

# 🧪 Test Coverage

## Homepage

* Verify homepage loads successfully
* Verify hero section is visible
* Verify navigation menu
* Verify page content is displayed correctly

## About Page

* Navigate to the About page
* Verify personal information
* Verify skills and technologies section
* Validate page content

## Projects Page

* Verify Projects page opens successfully
* Verify project cards are displayed
* Verify project details
* Validate project navigation

## End-to-End Scenarios

* Complete user navigation across the portfolio
* Verify links between pages
* Validate overall user journey

---

# 🏗 Framework Design

This project follows the **Page Object Model (POM)** design pattern to improve maintainability and scalability.

Each page contains its own:

* Locators
* Page actions
* Assertions
* Navigation methods

Benefits include:

* Cleaner test files
* Better code reuse
* Easier maintenance
* Reduced duplication

---

# 📦 Installation

Clone the repository:

```bash
git clone https://github.com/Yunqi-77/my-portfolio-automation.git
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

---

# ▶️ Running Tests

Run all tests

```bash
npm test
```

Run in headed mode

```bash
npm run test:headed
```

Run Playwright UI Mode

```bash
npm run test:ui
```

---

# 📊 Test Report

After execution, open the HTML report:

```bash
npm run report
```

---

# ⚙ Continuous Integration

The project includes a **GitHub Actions** workflow that can automatically execute the Playwright test suite on every push or pull request, helping ensure code quality through continuous integration.

---

# 📄 Test Documentation

Detailed manual test cases are available in:

```text
docs/
└── Test Cases for My Portfolio.xlsx
```

---

# 🎯 Learning Objectives

This project demonstrates my ability to:

* Build a Playwright automation framework from scratch
* Implement the Page Object Model
* Write maintainable and reusable automation code
* Organize scalable test suites
* Configure automated test execution with GitHub Actions
* Generate and analyze Playwright HTML reports

---

# 👨‍💻 Author

**Yunqi**

QA Automation Portfolio Project built with Playwright and TypeScript to showcase practical end-to-end web automation testing skills.
