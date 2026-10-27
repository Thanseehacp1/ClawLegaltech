# Performance Optimizations for References Feature

## Problem

Large document text in references was causing performance issues when rendering in the modal dialog.

## Solutions Implemented

### 1. Text Truncation

- **Initial Load**: Only show first 2000 characters of document text
- **Preview Text**: Show only first 100 characters in reference list with cleaned formatting
- **Lazy Loading**: Full content loads only when user clicks "Show Full Content"

### 2. Utility Functions Added (`src/utils/util.ts`)

```typescript
// Truncate text to specified length
export const truncateText = (text: string, maxLength: number = 2000): string

// Clean and truncate text for previews (removes extra whitespace)
export const cleanTextForPreview = (text: string, maxLength: number = 100): string

// Check if text is considered large
export const isLargeText = (text: string, threshold: number = 2000): boolean
```

### 3. UI Improvements

- **Reference List**: Shows filename + preview text (first 100 chars)
- **Modal Dialog**:
  - Initially shows truncated content (2000 chars)
  - "Show Full Content" button for large documents
  - Loading indicator during content expansion
  - "Show Less" button to collapse back to truncated view

### 4. Performance Benefits

- **Faster Initial Render**: Only renders small portion of text initially
- **Reduced Memory Usage**: Large text not kept in memory until needed
- **Better UX**: Users see content immediately, can choose to load more
- **Smooth Animations**: No lag when opening/closing dialogs

### 5. State Management

```typescript
const [showFullContent, setShowFullContent] = useState(false);
const [isLoadingFullContent, setIsLoadingFullContent] = useState(false);
```

### 6. Smart Loading

- Uses `setTimeout` to prevent UI blocking during content expansion
- Resets states when dialog opens/closes
- Graceful loading states with animations

## Usage

The optimizations are automatic - users will see:

1. Fast-loading reference list with previews
2. Quick dialog opening with truncated content
3. Option to load full content when needed
4. Smooth transitions between states

This approach handles documents of any size while maintaining good performance and user experience.
