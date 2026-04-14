# Regex Tester — Build and Test Regular Expressions Quickly

Regular expressions are one of the most powerful text-processing tools in programming — and one of the most intimidating to write from scratch. The **Regex Tester** on THRJ gives you a live environment to write, test, and debug regex patterns instantly, with real-time match highlighting and replacement previews. [Open the Regex Tester](/regex-tester)
  
## What Is a Regular Expression?

A **regular expression** (regex or regexp) is a sequence of characters that defines a search pattern. Think of it as a highly flexible "find" query. While a plain text search finds exact strings, a regex can match:

- Any email address in a block of text
- All phone numbers regardless of formatting (`123-456-7890`, `(123) 456 7890`, `+1 123 456 7890`)
- Lines that start or end with specific words
- Repeated characters or patterns
- Optional or mandatory groups within a string

Regex is built into virtually every programming language (JavaScript, Python, Java, Go, Ruby) and many text editors, command-line tools (`grep`, `sed`, `awk`), and database engines.
  
## Overview

Regex Tester provides a live environment to write regular expressions, test them against sample text, and visualize matches. It shows match groups, replacement previews, and common flags (g, i, m, s, u).
  
## Quick Steps

1. Open the Regex Tester page: `/regex-tester`.
2. Enter or paste sample text into the input area.
3. Type your regular expression into the pattern field.
4. Toggle flags like `i` (ignore case) or `g` (global) as needed.
5. See matches highlighted live and use replacement preview to test substitutions.
  
## Features

- Live highlighting of matches and capture groups.
- Replacement preview (show what `replace()` would produce).
- Flag toggles and quick common pattern snippets.
- Export your pattern and sample text for sharing.
  
## Understanding Regex Flags

Flags modify how a pattern is applied to the input text. Most regex engines support a consistent set:

| Flag | Symbol | Effect |
|---|---|---|
| Global | `g` | Find all matches, not just the first one |
| Ignore case | `i` | Match regardless of uppercase/lowercase |
| Multiline | `m` | `^` and `$` match start/end of each line, not just the whole string |
| Dot all | `s` | `.` matches newline characters too (by default `.` skips newlines) |
| Unicode | `u` | Enables full Unicode matching for non-ASCII characters |
| Indices | `d` | Returns start and end indices for each match (JS only) |

**Practical tip**: Always enable `g` when you want to see all matches in a block of text. Use `i` when matching user input where case cannot be controlled. Use `m` when processing text line by line.
  
## Common Regex Patterns Reference

| Pattern | Purpose | Example |
|---|---|---|
| `^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$` | Email address | `user@example.com` |
| `https?:\/\/[^\s]+` | URL (http or https) | `https://example.com/path` |
| `\+?[\d\s\-().]{7,15}` | Phone number (flexible) | `+1 (555) 123-4567` |
| `\b\d{4}-\d{2}-\d{2}\b` | ISO date (YYYY-MM-DD) | `2024-07-15` |
| `\b\d{1,2}\/\d{1,2}\/\d{2,4}\b` | US date (MM/DD/YYYY) | `07/15/2024` |
| `#[0-9a-fA-F]{6}\b` | Hex color code | `#4f8ef7` |
| `\b\d{5}(-\d{4})?\b` | US ZIP code | `90210` or `90210-1234` |
| `\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}\b` | IBAN bank number | — |
| `^\s*$` | Blank line | Lines with only spaces |
| `\b(\w+)\b.*\b\1\b` | Repeated word | "the the", "is is" |
  
## How to Use the Replacement Mode

The replacement preview mode lets you test `String.replace()` or `sed`-style substitutions before applying them to real data.

**Example 1 — Normalize date formats:**
- Pattern: `(\d{4})-(\d{2})-(\d{2})`
- Replacement: `$2/$3/$1`
- Result: `2024-07-15` → `07/15/2024`

**Example 2 — Redact email addresses:**
- Pattern: `[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}`
- Replacement: `[REDACTED]`
- Result: `Contact john@example.com for info` → `Contact [REDACTED] for info`

**Example 3 — Strip HTML tags:**
- Pattern: `<[^>]+>`
- Replacement: `` (empty)
- Result: `<b>Hello</b> world` → `Hello world`
  
## Step-by-Step Scenarios

### Validating a form field pattern
1. Paste a set of sample field values (valid and invalid) into the input area.
2. Write your validation regex (e.g., to match a valid ZIP code).
3. Toggle the `g` flag to see all matches highlighted.
4. Adjust your pattern until only valid entries are highlighted.
  
### Cleaning up copied data
1. Paste messy text (e.g., a column of data copied from a spreadsheet).
2. Write a pattern to match the unwanted characters or prefixes.
3. Use replacement mode with an empty replacement string to strip them out.
4. Copy the cleaned result.
  
### Debugging a regex that isn't matching
1. Paste your non-matching pattern and sample text.
2. Simplify the pattern to a few characters and confirm it matches.
3. Gradually add complexity back, observing when highlighting breaks.
4. Check for missing escape characters (`\`) on special regex characters like `.`, `*`, `+`, `?`, `(`, `)`.
  
## Tips

- Use the replacement preview to verify complex substitutions before running them globally.
- Start with simple patterns and progressively add complexity.
- Test with multiple sample lines to ensure multiline behavior is correct.
- Escape literal special characters: `.`, `*`, `+`, `?`, `(`, `)`, `[`, `]`, `{`, `}`, `^`, `$`, `|`, `\` all have special meaning in regex and must be escaped with `\` when you need to match them literally.
- Use **named capture groups** (`(?<year>\d{4})`) instead of `$1`, `$2` in complex replacements — they make the pattern self-documenting.
  
## Common Mistakes and How to Fix Them

**No matches when expected**: Check if the `g` (global) flag is off. Without it, only the first match is highlighted.

**Too many matches (over-matching)**: Add word boundaries `\b` around your pattern, or use anchors `^` and `$` to constrain where the match can occur.

**Special characters not matching**: If your pattern includes `.` but you mean a literal period, escape it as `\.`. Unescaped `.` matches any character.

**Pattern works in the tester but fails in code**: Verify that you apply the same flags in your code as in the tester. Also check whether your language uses the same regex syntax (some languages use slightly different syntax for lookbehinds or named groups).
  
## Privacy

All processing is local to your browser. Your patterns and test text never leave your device. Do not paste sensitive data if you are concerned about clipboard history.
  
## Frequently Asked Questions

**Do I need to know programming to use this tool?**
No. The tester is designed for anyone who needs to find or validate patterns in text — developers, data analysts, writers, and system administrators all use regex regularly. The quick-reference table above covers the most common use cases without requiring programming knowledge.

**What's the difference between a match and a capture group?**
A **match** is the entire portion of text the pattern matched. A **capture group** (defined with parentheses `()`) is a sub-portion of the match you explicitly extracted. For example, in `(\d{4})-(\d{2})-(\d{2})` matching `2024-07-15`, the full match is `2024-07-15`, and the three capture groups are `2024`, `07`, and `15`.

**Can I test multiline patterns?**
Yes. Enable the `m` flag and use `^` or `$` in your pattern to anchor to line beginnings and ends. Enable the `s` flag if your pattern needs `.` to match across line breaks.

**Why does my valid-looking email pattern match invalid addresses?**
Email address validation via regex is deceptively complex. Basic patterns will either over-match (accept invalid emails) or under-match (reject valid unusual addresses like `user+tag@subdomain.example.co.uk`). For production use, rely on a well-tested library validator rather than a hand-rolled regex.

---
Published by THRJ Tech
