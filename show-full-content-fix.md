# Show Full Content Button Fix

## Issue

The "Show Full Content" button was not displaying properly in the references modal.

## Root Causes Identified

### 1. **Condition Too Restrictive**

- **Before**: `selectedReference.chunks.length > 2`
- **Problem**: Only showed button if more than 2 chunks
- **Issue**: We show first 2 chunks initially, so button only appeared with 3+ chunks

### 2. **Missing Null Checks**

- **Before**: `selectedReference.chunks.length > 2`
- **Problem**: Could fail if `selectedReference` or `chunks` was null/undefined
- **Fix**: Added proper null checking

### 3. **Button Visibility Issues**

- **Before**: Subtle border styling
- **Problem**: Button might be hard to see
- **Fix**: Enhanced styling with background color and prominent border

## Fixes Applied

### 1. **Improved Condition Logic**

```typescript
// Before
{!showFullContent && selectedReference.chunks.length > 2 && (

// After
{!showFullContent &&
  selectedReference &&
  selectedReference.chunks &&
  Array.isArray(selectedReference.chunks) &&
  selectedReference.chunks.length > 1 && (
```

### 2. **Enhanced Button Styling**

```typescript
style={[
  styles.showMoreButton,
  {
    borderColor: colors.primary,        // More visible border
    backgroundColor: colors.primary + '10', // Background tint
    borderWidth: 2,                     // Thicker border
  },
]}
```

### 3. **Better Button Text**

```typescript
// Before
Show Full Content

// After
Show All Sections ({selectedReference.chunks.length})
```

### 4. **Debug Information (Temporary)**

Added debug panel to help identify issues:

- Shows chunk count
- Shows showFullContent state
- Shows button condition result

## Expected Behavior Now

### With 1 Chunk:

- ❌ No "Show All Sections" button (not needed)
- ✅ Shows single chunk content

### With 2 Chunks:

- ✅ Shows "Show All Sections (2)" button
- ✅ Initially displays first 2 chunks
- ✅ Button allows switching to formatted full view

### With 3+ Chunks:

- ✅ Shows "Show All Sections (X)" button
- ✅ Initially displays first 2 chunks
- ✅ Button loads remaining chunks progressively

## Testing Steps

1. **Open reference with 2+ chunks**
2. **Verify button appears** with "Show All Sections (X)" text
3. **Click button** - should show loading state
4. **Verify progressive loading** of all chunks
5. **Check "Show Less" button** appears after full load

## Debug Panel

Temporary debug info shows:

- Chunk count
- showFullContent state
- Button condition evaluation

Remove debug panel after confirming fix works.

## Performance Impact

- ✅ **No performance regression**
- ✅ **Better UX** with section count in button
- ✅ **More reliable** with proper null checks
- ✅ **More visible** with enhanced styling
