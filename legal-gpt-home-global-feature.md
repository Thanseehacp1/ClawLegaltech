# Legal GPT Home Page Global Chat Feature

## Overview

Added the same global chat functionality to the Legal GPT home page (LegalGptScreen.tsx) that was implemented in ChatScreen.tsx.

## Implementation Details

### 1. **State Management**

```typescript
const [isGlobalMode, setIsGlobalMode] = useState(false);
```

### 2. **UI Components Added**

#### Global Mode Toggle Button:

- **Location**: Next to attachment (paperclip) button
- **Icon**: Globe icon (FeatherIcon "globe")
- **States**:
  - Inactive: Gray color
  - Active: Primary color with background highlight

#### Global Mode Indicator:

- **Badge above input**: "🌐 Global Mode Active" with close button
- **Styling**: Primary color theme with subtle background
- **Functionality**: Shows when global mode is enabled

#### Dynamic Placeholder:

- **Normal Mode**: "Ask Anything You Want To Know ...."
- **Global Mode**: "Ask any legal question globally..."

### 3. **Navigation Integration**

Updated `handleSend` function to pass global mode to ChatScreen:

```typescript
navigation.navigate('ChatScreen', {
  userMessage: inputText,
  sessionId: data._id,
  isDocument: false,
  isGlobalMode: isGlobalMode, // Pass global mode
});
```

### 4. **ChatScreen Integration**

Updated ChatScreen to receive and use global mode from route params:

```typescript
const initialGlobalMode = route?.params?.isGlobalMode ?? false;
const [isGlobalMode, setIsGlobalMode] = useState(initialGlobalMode);
```

### 5. **Type Definitions Updated**

Updated `HomeStackParamList` in HomeStack.tsx:

```typescript
ChatScreen: {
  userMessage: string;
  sessionId: string;
  isDocument: string;
  uploadedfiletext: string;
  documentName?: string;
  isGlobalMode?: boolean; // Added global mode parameter
};
```

### 6. **Styles Added**

```typescript
globalIconActive: {
  backgroundColor: colors.primary + '20',
  borderRadius: 8,
  padding: 4,
},
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
},
globalModeText: {
  fontSize: 14,
  fontFamily: 'Poppins-Medium',
  flex: 1,
},
globalModeClose: {
  padding: 4,
  marginLeft: 8,
},
```

## User Flow

### From Legal GPT Home Page:

1. **User opens Legal GPT screen**
2. **Clicks globe icon** to enable global mode
3. **Globe icon highlights** and global mode indicator appears
4. **Types question** with global placeholder text
5. **Clicks send** - creates session and navigates to ChatScreen
6. **ChatScreen opens** with global mode already enabled
7. **First message** uses global endpoint automatically

### Seamless Integration:

- ✅ **State persistence**: Global mode carries over to ChatScreen
- ✅ **Visual consistency**: Same UI elements in both screens
- ✅ **Endpoint selection**: Automatic global endpoint usage
- ✅ **User experience**: Smooth transition between screens

## Benefits

### For Users:

- ✅ **Consistent experience** across Legal GPT screens
- ✅ **Mode persistence** when navigating to chat
- ✅ **Clear visual indicators** in both screens
- ✅ **One-click global mode** activation

### For System:

- ✅ **Unified global chat** functionality
- ✅ **Proper state management** across navigation
- ✅ **Type safety** with updated param lists
- ✅ **Maintainable code** with shared patterns

## Technical Architecture

### Screen Flow:

```
LegalGptScreen (Home)
├── Enable Global Mode
├── Type Question
├── Click Send
└── Navigate to ChatScreen
    ├── Receive isGlobalMode: true
    ├── Initialize with global mode active
    └── Use global endpoint for messages
```

### State Management:

```
LegalGptScreen: isGlobalMode (local state)
       ↓ (navigation params)
ChatScreen: initialGlobalMode → isGlobalMode (persistent state)
```

The Legal GPT home page now provides the same global chat functionality as the main chat screen, with seamless state persistence and consistent user experience across both screens.
