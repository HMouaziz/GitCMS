package vcs

import (
	"fmt"
	"github.com/go-git/go-git/v5/config"
	"os"
	"time"

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
	"github.com/go-git/go-git/v5/plumbing/object"
)

// GitManager handles core Git operations
type GitManager struct {
	repo     *git.Repository
	worktree *git.Worktree
	path     string
}

// NewGitManager creates a new GitManager instance
func NewGitManager(path string) (*GitManager, error) {
	repo, err := git.PlainOpen(path)
	if err != nil && err != git.ErrRepositoryNotExists {
		return nil, fmt.Errorf("failed to open repository: %w", err)
	}

	wt, err := repo.Worktree()
	if err != nil {
		return nil, fmt.Errorf("failed to get worktree: %w", err)
	}

	return &GitManager{
		repo:     repo,
		worktree: wt,
		path:     path,
	}, nil
}

// Clone clones a remote repository to the local path
func (gm *GitManager) Clone(repoURL string) error {
	// Check if directory exists
	if _, err := os.Stat(gm.path); os.IsNotExist(err) {
		if err := os.MkdirAll(gm.path, 0755); err != nil {
			return fmt.Errorf("failed to create directory: %w", err)
		}
	}

	// Clone the repository
	repo, err := git.PlainClone(gm.path, false, &git.CloneOptions{
		URL:      repoURL,
		Progress: os.Stdout,
	})
	if err != nil {
		return fmt.Errorf("failed to clone repository: %w", err)
	}

	// Update GitManager instance
	gm.repo = repo
	wt, err := repo.Worktree()
	if err != nil {
		return fmt.Errorf("failed to get worktree: %w", err)
	}
	gm.worktree = wt

	return nil
}

// Pull fetches and merges changes from the remote repository
func (gm *GitManager) Pull(branch string) error {
	err := gm.worktree.Pull(&git.PullOptions{
		RemoteName:    "origin",
		ReferenceName: plumbing.NewBranchReferenceName(branch),
	})

	if err == git.NoErrAlreadyUpToDate {
		return nil
	}

	if err != nil {
		return fmt.Errorf("failed to pull changes: %w", err)
	}

	return nil
}

// Push pushes local changes to the remote repository
func (gm *GitManager) Push(branch string) error {
	err := gm.repo.Push(&git.PushOptions{
		RemoteName: "origin",
		RefSpecs:   []config.RefSpec{config.RefSpec(fmt.Sprintf("refs/heads/%s:refs/heads/%s", branch, branch))},
	})

	if err == git.NoErrAlreadyUpToDate {
		return nil
	}

	if err != nil {
		return fmt.Errorf("failed to push changes: %w", err)
	}

	return nil
}

// Commit stages and commits changes
func (gm *GitManager) Commit(message string, author *object.Signature) error {
	status, err := gm.worktree.Status()
	if err != nil {
		return fmt.Errorf("failed to get status: %w", err)
	}

	if status.IsClean() {
		return nil
	}

	// Stage all changes
	if err := gm.worktree.AddGlob("."); err != nil {
		return fmt.Errorf("failed to stage changes: %w", err)
	}

	if author == nil {
		author = &object.Signature{
			Name:  "System",
			Email: "system@example.com",
			When:  time.Now(),
		}
	}

	_, err = gm.worktree.Commit(message, &git.CommitOptions{
		Author: author,
	})

	if err != nil {
		return fmt.Errorf("failed to commit changes: %w", err)
	}

	return nil
}

// CreateBranch creates a new branch
func (gm *GitManager) CreateBranch(branch string) error {
	headRef, err := gm.repo.Head()
	if err != nil {
		return fmt.Errorf("failed to get HEAD reference: %w", err)
	}

	ref := plumbing.NewHashReference(
		plumbing.NewBranchReferenceName(branch),
		headRef.Hash(),
	)

	if err := gm.repo.Storer.SetReference(ref); err != nil {
		return fmt.Errorf("failed to create branch: %w", err)
	}

	return nil
}

// SwitchBranch switches to the specified branch
func (gm *GitManager) SwitchBranch(branch string) error {
	err := gm.worktree.Checkout(&git.CheckoutOptions{
		Branch: plumbing.NewBranchReferenceName(branch),
	})

	if err != nil {
		return fmt.Errorf("failed to switch branch: %w", err)
	}

	return nil
}

// Status returns the current repository status
func (gm *GitManager) Status() (map[string]string, error) {
	status, err := gm.worktree.Status()
	if err != nil {
		return nil, fmt.Errorf("failed to get status: %w", err)
	}

	result := make(map[string]string)
	for file, fileStatus := range status {
		// Convert status to string representation
		var statusStr string
		switch {
		case fileStatus.Staging == git.Untracked:
			statusStr = "Untracked"
		case fileStatus.Staging == git.Modified:
			statusStr = "Modified"
		case fileStatus.Staging == git.Added:
			statusStr = "Added"
		case fileStatus.Staging == git.Deleted:
			statusStr = "Deleted"
		default:
			statusStr = "Unknown"
		}
		result[file] = statusStr
	}

	return result, nil
}

// Log returns recent commits
func (gm *GitManager) Log(limit int) ([]object.Commit, error) {
	logIter, err := gm.repo.Log(&git.LogOptions{})
	if err != nil {
		return nil, fmt.Errorf("failed to get log: %w", err)
	}

	var commits []object.Commit
	err = logIter.ForEach(func(c *object.Commit) error {
		if len(commits) >= limit {
			return nil
		}
		commits = append(commits, *c)
		return nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to iterate log: %w", err)
	}

	return commits, nil
}

// Revert reverts changes to a specific commit
func (gm *GitManager) Revert(commitHash string) error {
	hash := plumbing.NewHash(commitHash)
	commit, err := gm.repo.CommitObject(hash)
	if err != nil {
		return fmt.Errorf("failed to get commit: %w", err)
	}

	err = gm.worktree.Reset(&git.ResetOptions{
		Commit: commit.Hash,
		Mode:   git.HardReset,
	})

	if err != nil {
		return fmt.Errorf("failed to revert changes: %w", err)
	}

	return nil
}
