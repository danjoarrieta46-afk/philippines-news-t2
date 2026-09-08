# PH News Hub 🇵🇭

A free Philippines news aggregator with:
- multiple RSS sources
- automatic cached updates every 30 minutes through GitHub Actions
- breaking-news banner
- article images when supplied by RSS
- source/category/search filters
- dark mode
- English / Filipino interface toggle
- responsive mobile layout
- links to original publishers

## Free hosting

GitHub Pages is available in public repositories on GitHub Free. Put these files in a public repository and enable **Settings → Pages → Deploy from a branch → main → /(root)**.

The included GitHub Action fetches RSS feeds every 30 minutes and commits `data/news.json`, so the public website itself stays static and does not need paid server hosting.

## RSS sources

The list is in `fetch_news.py`. RSS URLs can change or be disabled by publishers. If a source stops working, replace its URL with the publisher's current RSS endpoint.

## Copyright / attribution

This project is an aggregator, not a republisher. It displays headlines, short excerpts, and RSS-provided images and links readers to the original articles. Check each publisher's terms and RSS policy before deployment or monetization.

## Important

GitHub Pages has usage limits and is intended for project/static sites; review GitHub's current Pages terms if traffic becomes substantial or the project becomes commercial.
