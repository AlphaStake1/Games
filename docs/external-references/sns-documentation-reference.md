# SNS (Solana Name Service) Documentation Reference

## ⚠️ IMPORTANT FOR AGENTS

**Before developing any backend infrastructure related to Solana Name Service (SNS), agents MUST review the complete SNS documentation scraped from official sources.**

## Documentation Location

**Primary Location**: `/home/ekazee/shared-tools/scraped-docs/sns-documentation/`

## Quick Access Files

- **Complete Documentation**: [`/home/ekazee/shared-tools/scraped-docs/sns-documentation/consolidated_docs.md`](../../../shared-tools/scraped-docs/sns-documentation/consolidated_docs.md)
- **Quick Reference**: [`/home/ekazee/shared-tools/scraped-docs/sns-documentation/quick_reference.md`](../../../shared-tools/scraped-docs/sns-documentation/quick_reference.md)
- **Overview**: [`/home/ekazee/shared-tools/scraped-docs/sns-documentation/README.md`](../../../shared-tools/scraped-docs/sns-documentation/README.md)

## Sources Scraped

1. **Official SNS Documentation**: https://docs.sns.id/dev
2. **GitHub Repository**: https://github.com/SolanaNameService/sns-sdk

## Key Documentation Areas

- **API References**: Complete API documentation for SNS integration
- **SDK Usage**: How to use the SNS SDK in applications
- **Integration Examples**: Code examples and best practices
- **Repository Structure**: Understanding the SNS codebase
- **Release Notes**: Latest updates and changes
- **Issue Tracking**: Known issues and solutions

## For Backend Development

When developing backend infrastructure that interacts with SNS:

1. **MUST READ**: Start with `consolidated_docs.md` for complete overview
2. **Review API Docs**: Understand all available endpoints and methods
3. **Check SDK Examples**: See implementation patterns in the GitHub repo
4. **Verify Latest Releases**: Check for any breaking changes
5. **Review Open Issues**: Be aware of known limitations

## File Structure

```
/home/ekazee/shared-tools/scraped-docs/sns-documentation/
├── consolidated_docs.md           # ← START HERE - Complete documentation
├── quick_reference.md             # ← Quick access guide
├── README.md                      # ← Overview and instructions
├── scraping_summary.json          # ← Scraping session details
├── docs_sns_id/                   # ← Raw scraped content from docs.sns.id
│   ├── main_page.json
│   └── [other pages]
└── github_repo/                   # ← Raw scraped content from GitHub
    ├── main_repo.json
    ├── README.md.json
    ├── releases.json
    └── [other pages]
```

## Update Process

To refresh the documentation:

```bash
cd /home/ekazee/shared-tools/scraped-docs/sns-documentation/
/home/ekazee/shared-tools/crawl4ai/venv/bin/python scrape_sns_docs.py
/home/ekazee/shared-tools/crawl4ai/venv/bin/python organize_content.py
```

## Integration Checklist for Agents

- [ ] Read complete SNS documentation in `consolidated_docs.md`
- [ ] Understand SNS SDK structure and usage patterns
- [ ] Review latest releases and breaking changes
- [ ] Check for relevant open issues that might affect implementation
- [ ] Verify API endpoints and authentication requirements
- [ ] Test integration patterns with provided examples

## Contact & Support

- **Official Documentation**: https://docs.sns.id/dev
- **GitHub Issues**: https://github.com/SolanaNameService/sns-sdk/issues
- **SDK Repository**: https://github.com/SolanaNameService/sns-sdk

---

**Last Scraped**: 2025-07-17T01:58:54.174736  
**Next Recommended Update**: Check monthly or before major releases
