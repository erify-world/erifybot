# Auto Tag on Merge Workflow

This repository includes an automated tagging system that creates version tags when release branches are merged into main branches.

## How It Works

1. **CI Workflow**: The `CI` workflow runs on push/PR to `main`, `develop`, or `production` branches
2. **Auto Tag Workflow**: The `Auto Tag on Merge` workflow triggers when the CI workflow completes successfully
3. **Branch Validation**: Only processes merges from `release/*` branches to allowed target branches
4. **Version Tagging**: Extracts version from release branch name and creates corresponding git tag

## Usage

### Creating a Release

1. Create a release branch with semantic version format:
   ```bash
   git checkout -b release/v1.4.0
   # Make your changes
   git push origin release/v1.4.0
   ```

2. Create a Pull Request to merge `release/v1.4.0` into `main` (or `develop`/`production`)

3. Once the PR is merged and CI passes:
   - A git tag `v1.4.0` will be automatically created
   - If `CHANGELOG=1` is set, `CHANGELOG.md` will be updated

### Supported Branch Patterns

- **Release branches**: `release/v1.2.3`, `release/v2.0.0-beta.1`, etc.
- **Target branches**: `main`, `develop`, `production`
- **Version format**: Must start with `v` followed by semantic version (e.g., `v1.2.3`)

### Repository Configuration

#### Required Settings
1. **Workflow Permissions**: Ensure `Read and write permissions` are enabled:
   - Go to `Settings > Actions > General`
   - Under "Workflow permissions", select "Read and write permissions"

#### Optional Settings
1. **Changelog Generation**: Set repository variable `CHANGELOG=1` to enable automatic changelog updates:
   - Go to `Settings > Secrets and variables > Actions`
   - Under "Repository variables", add `CHANGELOG` with value `1`

## Workflow Files

- **`.github/workflows/ci.yml`**: Basic CI workflow that validates the code
- **`.github/workflows/auto-tag-on-merge.yml`**: Auto-tagging workflow triggered by CI completion
- **`.github/workflows/auto-tag.yml`**: Legacy auto-tag workflow (preserved)

## Troubleshooting

### Tag Not Created
- Ensure the release branch follows the format `release/v1.2.3`
- Verify the target branch is `main`, `develop`, or `production`
- Check that the CI workflow completed successfully
- Confirm workflow permissions are set to "Read and write permissions"

### Changelog Not Generated
- Verify the `CHANGELOG` repository variable is set to `1`
- Check that the workflow has write permissions

### Rollback
If you need to disable the auto-tagging feature:
- Delete or rename `.github/workflows/auto-tag-on-merge.yml`
- Or set `CHANGELOG=0` to disable only changelog generation

## Example

```bash
# Create release branch
git checkout -b release/v1.5.0

# Make changes and commit
git add .
git commit -m "Prepare v1.5.0 release"
git push origin release/v1.5.0

# Create PR: release/v1.5.0 → main
# After merge and CI success: tag v1.5.0 is automatically created
```