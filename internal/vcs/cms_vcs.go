package vcs

import (
	"fmt"
	"path/filepath"
)

type CMSVCS struct {
	gitManager    *GitManager
	dataHandler   *DataHandler
	workingBranch string
}

func NewCMSVCS(repoPath string) (*CMSVCS, error) {
	gm, err := NewGitManager(repoPath)
	if err != nil {
		return nil, fmt.Errorf("failed to create git manager: %w", err)
	}

	dh := NewDataHandler()

	return &CMSVCS{
		gitManager:    gm,
		dataHandler:   dh,
		workingBranch: "main",
	}, nil
}

// SaveContent saves and commits content changes
func (cms *CMSVCS) SaveContent(filePath string, content string) error {
	// Save content to file
	if err := cms.dataHandler.SaveToFile(filePath, content); err != nil {
		return fmt.Errorf("failed to save content: %w", err)
	}

	// Create commit message
	fileName := filepath.Base(filePath)
	message := fmt.Sprintf("Update content: %s", fileName)

	// Commit changes
	if err := cms.gitManager.Commit(message, nil); err != nil {
		return fmt.Errorf("failed to commit changes: %w", err)
	}

	return nil
}

// SyncContent synchronizes local and remote content
func (cms *CMSVCS) SyncContent() error {
	// Pull latest changes
	if err := cms.gitManager.Pull(cms.workingBranch); err != nil {
		return fmt.Errorf("failed to pull changes: %w", err)
	}

	// Push local changes
	if err := cms.gitManager.Push(cms.workingBranch); err != nil {
		return fmt.Errorf("failed to push changes: %w", err)
	}

	return nil
}

// Deploy pushes changes to the production branch
func (cms *CMSVCS) Deploy(productionBranch string) error {
	// Switch to production branch
	if err := cms.gitManager.SwitchBranch(productionBranch); err != nil {
		return fmt.Errorf("failed to switch to production branch: %w", err)
	}

	// Merge working branch into production
	if err := cms.gitManager.Pull(cms.workingBranch); err != nil {
		return fmt.Errorf("failed to merge working branch: %w", err)
	}

	// Push to production
	if err := cms.gitManager.Push(productionBranch); err != nil {
		return fmt.Errorf("failed to push to production: %w", err)
	}

	// Switch back to working branch
	if err := cms.gitManager.SwitchBranch(cms.workingBranch); err != nil {
		return fmt.Errorf("failed to switch back to working branch: %w", err)
	}

	return nil
}

// PreviewBranch creates a new branch for content preview
func (cms *CMSVCS) PreviewBranch(previewBranch string) error {
	// Create new preview branch
	if err := cms.gitManager.CreateBranch(previewBranch); err != nil {
		return fmt.Errorf("failed to create preview branch: %w", err)
	}

	// Switch to preview branch
	if err := cms.gitManager.SwitchBranch(previewBranch); err != nil {
		return fmt.Errorf("failed to switch to preview branch: %w", err)
	}

	return nil
}

// ResolveConflict handles content conflicts
func (cms *CMSVCS) ResolveConflict(file string, resolution string) error {
	// Save resolution content
	if err := cms.dataHandler.SaveToFile(file, resolution); err != nil {
		return fmt.Errorf("failed to save resolution: %w", err)
	}

	// Commit resolution
	message := fmt.Sprintf("Resolve conflict in %s", filepath.Base(file))
	if err := cms.gitManager.Commit(message, nil); err != nil {
		return fmt.Errorf("failed to commit resolution: %w", err)
	}

	return nil
}
