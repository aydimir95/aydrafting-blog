+++
title = "C# + Revit API: Lesson №16 - Contribute to Open Source"
date = 2025-10-23T00:54:34+03:00
draft = true
tags = ["C#", "Revit", "Tutorial"]
+++

# 🌟 How to Contribute to Open Source Projects

Let me explain the open source contribution workflow in a  beginner-friendly way.

## The Big Picture

Fork and clone the repository. The setup is done! Here's the workflow to contribute:

1. Your Fork (aydimir95/revit-mcp-plugin) ← You control this
	 ↓
2. Make changes in a feature branch
	 ↓
3. Push to your fork
	 ↓
4. Create Pull Request to upstream (revit-mcp/revit-mcp-plugin)
	 ↓
5. Maintainers review & merge

  ---
  
# 📖 Step-by-Step Contribution Guide

## Step 1: Always Start Fresh

Before making any changes, sync with the latest upstream:

```bash
git checkout main
git fetch revit-mcp-plugin
git reset --hard revit-mcp-plugin/main
git push origin main --force-with-lease
```

## Step 2: Create a Feature Branch

Never work directly on main. Always create a new branch:

### Example: Adding a new feature
```bash
git checkout -b feature/add-window-command
```

### Or: Fixing a bug
```bash
git checkout -b fix/socket-connection-issue
```

Branch naming conventions:
- feature/description - for new features
- fix/description - for bug fixes
- docs/description - for documentation
- refactor/description - for code refactoring

## Step 3: Make Your Changes

Edit files, add features, fix bugs, etc.

## Step 4: Commit Your Changes

### See what changed
```bash
git status
```

### Stage your changes
```bash
git add .
```

### Commit with a clear message
```bash
git commit -m "Add window creation command with size parameters"
```

### Good commit messages:
- ✅ "Add create_window command to support window placement"
- ✅ "Fix socket timeout issue when creating large walls"
- ✅ "Update README with installation instructions for Revit 2025"
- ❌ "Update" (too vague)
- ❌ "Fixed stuff" (not descriptive)

## Step 5: Push to Your Fork

### Push your feature branch to YOUR fork
```bash
git push origin feature/add-window-command
```

## Step 6: Create a Pull Request

1. Go to your fork on GitHub: https://github.com/aydimir95/revit-mcp-plugin
2. You'll see a yellow banner: "Compare & pull request" button
3. Click it
4. Fill out the PR description:
- What does this change do?
- Why is it needed?
- How to test it?
1. Click "Create pull request"

## Step 7: Wait for Review

- Maintainers will review your code
- They may request changes
- Make requested changes in the same branch and push again
- Once approved, they'll merge it!

---
# 🎯 Complete Example Workflow

Let me show you a real example:

## 1. Start fresh
```bash
git checkout main
git fetch revit-mcp-plugin
git reset --hard revit-mcp-plugin/main
```
## 2. Create feature branch
```bash
git checkout -b feature/add-window-support
```

## 3. Make changes (edit files in Visual Studio)
```C#
 ... add WindowCommand.cs, WindowEventHandler.cs ...
```

## 4. Commit
```bash
git add .
git commit -m "Add window creation command
```

- Implement CreateWindowCommand and CreateWindowEventHandler
- Support window size and position parameters
- Add window family type lookup
- Update SocketService to register new command"

## 5. Push to your fork
```bash
git push origin feature/add-window-support
```

## 6. Go to GitHub and create Pull Request

---
# 💡 Best Practices

## ✅ DO:

- One feature per branch - Makes reviews easier
- Write clear commit messages - Explain what and why
- Test your changes - Make sure they work in Revit
- Keep commits small - Easier to review and revert if needed
- Update documentation - If you add features, update README
- Follow existing code style - Match the project's coding patterns

## ❌ DON'T:

- Don't commit to main - Always use feature branches
- Don't mix unrelated changes - One PR = one feature/fix
- Don't push without testing - Test in Revit first
- Don't force push to main - Only force push to feature branches if needed
- Don't commit sensitive data - API keys, passwords, etc.

---
# 🔄 After Your PR is Merged

Once your PR is accepted:

## 1. Switch back to main
```bash
git checkout main
```

## 2. Pull the latest (includes your merged changes)
```bash
git fetch revit-mcp-plugin
git reset --hard revit-mcp-plugin/main
```
## 3. Update your fork
```bash
git push origin main
```

## 4. Delete your feature branch (cleanup)
```bash
git branch -d feature/add-window-support
git push origin --delete feature/add-window-support
```

---
# 🆘 Common Scenarios

`"I made changes on main by accident!"`

## Save your changes to a new branch
```bash
git checkout -b feature/my-changes
```

## Reset main back to upstream
```bash
git checkout main
git reset --hard revit-mcp-plugin/main`
```

"Upstream updated while I was working!"

## On your feature branch
```bash
git fetch revit-mcp-plugin
git rebase revit-mcp-plugin/main
```
## Or use merge if rebase seems scary
```bash
git merge revit-mcp-plugin/main
```

`"I want to undo my last commit"`

## Keep changes but undo commit
```bash
git reset --soft HEAD~1
```
## Discard changes completely
```bash
git reset --hard HEAD~1
```


---
# 📚 Quick Reference

## Check what branch you're on
```bash
git branch
```
## See what changed
```bash
git status
git diff
```
## See commit history
```bash
git log --oneline
```

## Switch branches
```bash
git checkout branch-name
```
## Create new branch
```bash
git checkout -b new-branch-name
```

## Update from upstream
```bash
git fetch revit-mcp-plugin
git merge revit-mcp-plugin/main
```

---
# 🎓 Summary

The golden rule:
1. main branch = always matches upstream (clean)
2. feature branches = where you make changes
3. Pull Requests = how you propose changes

> You're all set up! Your fork is synced, and you're ready to contribute. 
