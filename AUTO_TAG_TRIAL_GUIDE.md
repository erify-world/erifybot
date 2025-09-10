# ERIFY™ Auto-Tag Workflow: Annotated Trial Run Guide

## Objective
Validate that the auto-tag workflow crowns every merged `release/*` PR into `main` (or `production`/`develop`) with:
- A version tag (`vX.Y.Z`)
- (Optional) a generated `CHANGELOG.md`
- Graceful exit on non-eligible events

---

## 1. Create a Release Branch
```sh
git checkout -b release/1.0.0
git push origin release/1.0.0
```
✅ Expect: Branch `release/1.0.0` appears on GitHub.

---

## 2. Open a Pull Request
- **Base:** `main` (or `production`/`develop`)
- **Compare:** `release/1.0.0`

✅ Expect: PR listed as “Open” from `release/1.0.0` → base branch.

---

## 3. Wait for CI
- Ensure workflow name matches: `CI` (or whatever you use)
- CI must finish with ✅ Success

✅ Expect: “All checks passed” in the PR.

---

## 4. Merge the PR
- Use GitHub’s “Merge pull request” button

✅ Expect: PR marked “Merged”, base branch updated.

---

## 5. Check Auto Tag Workflow
- Actions → look for **Auto Tag on Release Merge**
- Confirm it ran after CI completed

✅ Expect: Workflow succeeded (no errors, no skips).

---

## 6. Verify Tag
```sh
git fetch --tags
git tag | grep v1.0.0
```
Or check: **Tags** tab on GitHub

✅ Expect: New tag `v1.0.0` pointing to the merge commit.

---

## 7. Verify Changelog (if enabled)
If `CHANGELOG=1` is set:
- Check `CHANGELOG.md` on `main`

✅ Expect: Commit `docs(changelog): v1.0.0` and updated file.

---

## 8. Edge Case (Optional)
Push direct to `main`:
```sh
echo "# hotfix" >> README.md
git commit -am "chore: hotfix readme"
git push origin main
```

✅ Expect: Auto Tag workflow exits cleanly, no tag created.

---

## Troubleshooting

- **No tag?**
  - PR must be merged `release/*` → `main`/`production`/`develop`
  - CI workflow name must match in YAML
- **No changelog?**
  - `CHANGELOG=1` must be set
- **Workflow skipped/failed?**
  - CI must be green
  - Repo → Settings → Actions → Permissions = Read & write

---

## QA Checks After Each Step
- After PR merge: PR = “Merged”
- After workflow: Actions tab = succeeded run
- After tag: Tag visible locally & on GitHub
- After changelog: File updated if enabled
- After edge case: Workflow exits, no tag

---

_Created for ERIFY™ Technologies • Luxury-grade validation • Crown your releases_ 💎🔥