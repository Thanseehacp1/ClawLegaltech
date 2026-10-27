# Global Chat Feature Implementation

## Overview

Added a global chat mode that uses the `/api/v1/gpt/generate/global` endpoint for general legal questions without session context.

## API Endpoint Details

- **Endpoint**: `wss://api.clawlaw.in:8000/api/v1/gpt/generate/global`
- **Method**: WebSocket connection
- **Payload**:
  ```json
  {
    "prompt": "user question",
    "context": "",
    "language": "user language or empty"
  }
  ```

## Implementation Features

### 1. **Global Mode Toggle Button**

- **Location**: Next to attachment (paperclip) button in input area
- **Icon**: Globe icon (FeatherIcon "globe")
- **States**:
  - **Inactive**: Gray color, normal background
  - **Active**: Primary color with light background highlight

### 2. **Visual Indicators**

#### Global Mode Badge:

```
🌐 Global Mode Active                    [✕]
```

- Appears above input field when global mode is enabled
- Shows globe icon + "Global Mode Active" text
- Includes close button to disable global mode
- Styled with primary color theme

#### Input Placeholder:

- **Normal Mode**: "Ask Anything You Want To Know ...."
- **Global Mode**: "Ask any legal question globally..."

### 3. **WebSocket Integration**

#### Endpoint Selection:

```typescript
const websocketUrl = isGlobalMode
  ? 'wss://api.clawlaw.in:8000/api/v1/gpt/generate/global'
  : 'wss://api.clawlaw.in:8000/api/v1/gpt/generate';
```

#### Payload Modification:

```typescript
const payload = isGlobalMode
  ? {
      prompt: apiMessageText,
      context: '', // Empty context for global
      language: currentUser?.language || '',
    }
  : {
      prompt: apiMessageText,
      context: context, // Full context for regular chat
      language: currentUser?.language,
    };
```

### 4. **User Experience**

#### Activation Flow:

1. User clicks globe icon next to attachment button
2. Globe icon highlights with primary color and background
3. Global mode indicator appears above input field
4. Input placeholder changes to global mode text
5. All subsequent messages use global endpoint

#### Deactivation Flow:

1. User clicks globe icon again OR clicks X in global mode indicator
2. Globe icon returns to normal gray state
3. Global mode indicator disappears
4. Input placeholder returns to normal text
5. Subsequent messages use regular endpoint with context

### 5. **Technical Implementation**

#### State Management:

```typescript
const [isGlobalMode, setIsGlobalMode] = useState(false);
```

#### Styles Added:

```typescript
globalIconActive: {
  backgroundColor: colors.primary + '20',
  borderRadius: 8,
  padding: 4,
}

globalModeIndicator: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: colors.primary + '10',
  paddingHorizontal: 12,
  paddingVertical: 8,
  marginBottom: 8,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: colors.primary + '30',
}
```

## Usage Scenarios

### Regular Chat Mode (Default):

- Uses session context and conversation history
- Endpoint: `/api/v1/gpt/generate`
- Best for: Follow-up questions, case-specific queries

### Global Chat Mode:

- No session context, fresh conversation each time
- Endpoint: `/api/v1/gpt/generate/global`
- Best for: General legal questions, new topics, standalone queries

## Example Usage

### Global Mode Query:

```json
{
  "prompt": "medical negligence where the doctors are held liable for system error during operations",
  "context": "",
  "language": ""
}
```

### Response:

```
# Medical Negligence Where Doctors Are Held Liable for System Error...
[Detailed legal response about medical negligence]
```

## Benefits

### For Users:

- ✅ **Clear mode indication** - Visual feedback for current mode
- ✅ **Easy toggle** - One-click switching between modes
- ✅ **Contextual placeholders** - Different prompts for different modes
- ✅ **Flexible usage** - Choose appropriate mode for query type

### For System:

- ✅ **Endpoint flexibility** - Uses appropriate backend service
- ✅ **Context control** - Global mode bypasses session context
- ✅ **Performance** - Global queries don't need context processing
- ✅ **Scalability** - Separate endpoints for different use cases

The global chat feature provides users with flexibility to ask general legal questions without being constrained by current session context, while maintaining clear visual indicators of the current mode.
