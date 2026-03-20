# Follow-up for the next Codex session

This note preserves the cleanup plan from the latest review so the next pass starts with a narrower, easier-to-review change set.

## Immediate goal

Reduce future work into small, reviewable patches instead of mixing source fixes, UX rewrites, information-architecture changes, and generated-output churn in one commit.

## Recommended sequence

1. **Isolate the real blocker first.**
   - Keep source-level fixes that address broken routing or asset/base-path resolution.
   - Verify the affected page works under the configured site base path before changing unrelated content or navigation.
2. **Trim review noise.**
   - Avoid broad generated-file rebuilds until the source diff is settled.
   - Commit only the generated artifacts that are required for deployment.
3. **Reintroduce UX or IA changes separately.**
   - Treat navigation changes, copy rewrites, and card-interaction changes as product decisions.
   - Validate accessibility and keyboard behavior before landing whole-card click patterns.

## Working checklist for the next session

- [ ] Start by reviewing `git show --stat` and separate source changes from generated-output churn.
- [ ] Keep path/base-url fixes in their own commit when possible.
- [ ] Defer navigation changes unless they are explicitly requested and approved.
- [ ] Defer broad content rewrites unless they are being reviewed as a product/content pass.
- [ ] Rebuild deployment artifacts only after the source patch is final.
- [ ] Before opening a PR, summarize the patch as: bug fix, UX change, IA change, or generated output.

## Practical reminder

If a future task starts with "this page does not open/click/load correctly," investigate routing, build output, and client-side data loading before rewriting the page experience.
