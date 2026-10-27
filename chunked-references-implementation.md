# Chunked References Implementation

## New API Format

```json
{
  "references": [
    {
      "DocumentName.pdf": [
        {
          "chunk_index": 0,
          "chunk_text": "First paragraph content..."
        },
        {
          "chunk_index": 1,
          "chunk_text": "Second paragraph content..."
        }
      ]
    }
  ]
}
```

## Updated Implementation

### 1. **New Type Definitions**

```typescript
interface ChunkData {
  chunk_index: number;
  chunk_text: string;
}

interface Reference {
  [filename: string]: ChunkData[];
}

interface ProcessedReference {
  filename: string;
  chunks: ChunkData[];
  fullText: string;
}
```

### 2. **New Utility Functions**

```typescript
// Process API response into usable format
export const processReferences = (references: any): ProcessedReference[]

// Get initial chunks for preview (first 2 paragraphs)
export const getInitialChunks = (chunks: any[], maxChunks: number = 2): string
```

### 3. **Enhanced UI Features**

#### Reference List Display:

- **Filename** with document icon
- **Section count badge** showing "X sections"
- **Preview text** from first chunk/paragraph
- **External link icon** for opening dialog

#### Modal Dialog:

- **Paragraph-based rendering** - each chunk as separate paragraph
- **Visual separators** between paragraphs
- **Progressive loading** - loads paragraphs one by one
- **Chunk-based progress** - shows "X/Y sections loaded"

### 4. **Performance Optimizations**

#### Initial Load:

- Shows first 2 paragraphs immediately
- No processing of full document text
- Fast preview generation from first chunk

#### Progressive Loading:

- Loads paragraphs with 100ms delays (vs 50ms for text chunks)
- Each paragraph renders as separate container
- Progress bar based on paragraph count (not text length)

#### Memory Efficiency:

- Uses pre-chunked paragraphs from API
- No need to split large text client-side
- Better memory management with paragraph boundaries

### 5. **UI Improvements**

#### Reference Cards:

```
[📄] Document Name.pdf        [3 sections] [🔗]
     First paragraph preview text...
```

#### Modal Content:

```
Document Name.pdf                    [✕]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Paragraph 1 content here...
────────────────────────────────────

Paragraph 2 content here...
────────────────────────────────────

[Show All Sections] or [Loading... (2/5 sections)]
```

### 6. **Benefits of New Approach**

#### For Users:

- ✅ **Natural reading flow** - paragraph-based structure
- ✅ **Clear section boundaries** - visual separators
- ✅ **Section count visibility** - know document size upfront
- ✅ **Faster previews** - immediate first paragraph display

#### For Performance:

- ✅ **Server-side chunking** - no client-side text processing
- ✅ **Paragraph boundaries** - natural break points
- ✅ **Reduced initial load** - only 2 paragraphs vs full text
- ✅ **Better progress tracking** - section-based vs character-based

#### For Development:

- ✅ **Cleaner API contract** - structured chunk format
- ✅ **Easier debugging** - clear paragraph boundaries
- ✅ **Better scalability** - handles any document size
- ✅ **Consistent UX** - same flow regardless of content size

### 7. **Technical Flow**

1. **API Response** → Raw chunked format
2. **processReferences()** → Convert to ProcessedReference[]
3. **Reference List** → Show filename + section count + preview
4. **Dialog Open** → Show first 2 paragraphs immediately
5. **Load More** → Progressive paragraph loading with delays
6. **Full Content** → All paragraphs with visual separators

This implementation provides optimal performance for large documents while maintaining excellent user experience with natural paragraph-based reading flow.
