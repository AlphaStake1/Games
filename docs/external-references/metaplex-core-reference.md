# Metaplex Core Documentation Reference

## ⚠️ IMPORTANT FOR AGENTS
**Before developing any backend infrastructure related to Metaplex Core, agents MUST review the complete Metaplex Core documentation.**

## Documentation Location
**Primary Location**: `/home/ekazee/shared-tools/scraped-docs/metaplex-core/`

## Quick Access Files
- **Complete Documentation**: [`/home/ekazee/shared-tools/scraped-docs/metaplex-core/consolidated_docs.md`](../../../shared-tools/scraped-docs/metaplex-core/consolidated_docs.md)
- **Quick Reference**: [`/home/ekazee/shared-tools/scraped-docs/metaplex-core/quick_reference.md`](../../../shared-tools/scraped-docs/metaplex-core/quick_reference.md)

## Source Scraped
- **Metaplex Core Developer Docs**: https://developers.metaplex.com/core

## Key Documentation Areas
- **Core Concepts**: Overview of Metaplex Core architecture and components
- **API References**: Available API endpoints and usage
- **Integration Guides**: How to integrate with Metaplex Core
- **Examples**: Code samples and best practices

## For Backend Development
When developing backend infrastructure that interacts with Metaplex Core:

1. **MUST READ**: Start with `consolidated_docs.md` for complete overview
2. **Review API Docs**: Understand all available endpoints and methods
3. **Check Integration Guides**: Follow recommended integration patterns
4. **Test Examples**: Use provided code samples for validation

## File Structure
```
/home/ekazee/shared-tools/scraped-docs/metaplex-core/
├── consolidated_docs.md     # ← START HERE - Complete documentation
├── quick_reference.md       # ← Quick access guide
├── documentation/           # ← Raw scraped content
│   └── main_page.json
└── scraping_summary.json    # ← Scraping session details
```

## Update Process
To refresh the documentation:
```bash
cd /home/ekazee/shared-tools/scraped-docs/metaplex-core/
/home/ekazee/shared-tools/crawl4ai/venv/bin/python scrape_metaplex_docs.py
/home/ekazee/shared-tools/crawl4ai/venv/bin/python organize_content.py
```

## Integration Checklist for Agents
- [ ] Read complete Metaplex Core documentation in `consolidated_docs.md`
- [ ] Understand core concepts and architecture
- [ ] Review API endpoints and integration guides
- [ ] Test integration with provided examples

---

**Last Scraped**: 2025-07-17T12:02:48.000000  
**Next Recommended Update**: Check monthly or before major releases