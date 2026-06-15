# Advanced Todo Card - Stage 1a

## Overview

This project is an upgraded version of my Stage 0 Todo Card. In Stage 0, the card displayed hardcoded task information such as the task title, description, due date, priority, status, complete toggle, edit button, and delete button.

In Stage 1a, the Todo Card was extended into a more interactive and stateful component. The card now supports editing, status changes, priority indicators, expandable descriptions, dynamic time updates, and improved accessibility patterns.

The goal of this stage was to move beyond a static UI and build a card that responds to user interaction using JavaScript state management and DOM rendering.

## What Changed From Stage 0

In Stage 0, the Todo Card mainly displayed task information. The edit and delete buttons only performed dummy actions such as alerts or console messages.

In Stage 1a, the card became interactive. The user can now edit task values, update status, change priority, expand or collapse long descriptions, and see more dynamic due date behavior.

Main improvements include:

- Edit mode for updating task content
- Save and cancel functionality
- Status dropdown with `Pending`, `In Progress`, and `Done`
- Checkbox and status synchronization
- Priority indicator that changes visually based on priority
- Expand and collapse behavior for long descriptions
- Dynamic time remaining display
- Completed state when task status becomes `Done`
- More accessible form labels and interactive controls

## Features

### Edit Mode

Clicking the Edit button switches the card into edit mode. In edit mode, the user can update:

- Task title
- Task description
- Task priority
- Task due date

The edit form uses the required test ids:

- `data-testid="test-todo-edit-form"`
- `data-testid="test-todo-edit-title-input"`
- `data-testid="test-todo-edit-description-input"`
- `data-testid="test-todo-edit-priority-select"`
- `data-testid="test-todo-edit-due-date-input"`
- `data-testid="test-todo-save-button"`
- `data-testid="test-todo-cancel-button"`

Save applies the new values to the task. Cancel exits edit mode without saving changes.

## Status Control

The card includes a status dropdown that allows the user to change the task status.

Allowed statuses are:

- `Pending`
- `In Progress`
- `Done`

The status control uses:

```html
data-testid="test-todo-status-control"
