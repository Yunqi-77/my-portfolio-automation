# Portfolio Website Automation Testing

This repository contains the automated end-to-end (E2E) test suite for my personal portfolio website. The automation framework is built using **Playwright** and **TypeScript**, following best practices to demonstrate modern web UI test automation skills.

## Application Under Test

**Portfolio Website:** https://yunqi-77.github.io/my-portfolio/index.html

**Source Repository:** https://github.com/Yunqi-77/my-portfolio

---

## Tech Stack

* Playwright
* TypeScript
* Node.js

---

## Test Coverage

The current automation suite covers the following areas of the website:

### End-to-End (E2E)

* User navigation through the website
* Verification of core user journeys
* Validation of page transitions and content rendering

### Homepage

* Homepage loads successfully
* Hero section is displayed
* Navigation menu is accessible
* Essential page elements are visible
* External links and navigation function correctly

### Projects Page

* Projects section is accessible
* Project cards are displayed correctly
* Project information is visible
* Project links navigate to the expected destinations

### About Me Page

* About Me section is displayed
* Personal information and content are visible
* Skills and related information are rendered correctly
* Navigation to and from the page works as expected

---

## Project Structure

```text
.
├── tests/
│   ├── e2e.spec.ts
│   ├── homepage.spec.ts
│   ├── projects.spec.ts
│   └── aboutme.spec.ts
├── pages/
├── playwright.config.ts
├── package.json
└── README.md
```

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Run all tests

```bash
npx playwright test
```

### Run tests in headed mode

```bash
npx playwright test --headed
```

### View the HTML report

```bash
npx playwright show-report
```

---

## Objectives

This project demonstrates:

* End-to-end web automation using Playwright
* Test organization and maintainable test structure
* Reliable UI validation for a modern web application
* Automation skills applicable to real-world web testing projects

---

## Future Enhancements

Planned improvements include:

* Cross-browser execution
* Mobile viewport testing
* Visual regression testing
* Accessibility testing
* CI/CD integration with GitHub Actions
* Screenshot and video capture on test failure

---

## Author

Developed by **Yunqi** as part of my QA Automation portfolio to showcase practical experience in Playwright-based web automation testing.
