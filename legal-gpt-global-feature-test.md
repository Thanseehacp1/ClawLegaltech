# Legal GPT Global Feature Testing Guide

## Current Implementation Status

### ✅ **Components Implemented:**

1. **State Management**

   ```typescript
   const [isGlobalMode, setIsGlobalMode] = useState(false);
   ```

2. **Globe Icon Button**

   - Location: Next to paperclip button
   - Icon: FeatherIcon "globe"
   - Size: 24px
   - Colors: Primary (active) / Secondary (inactive)

3. **Global Mode Indicator**

   - Badge: "🌐 Global Mode Active" with close button
   - Position: Above input field
   - Conditional rendering: `{isGlobalMode && ...}`

4. **Dynamic Placeholder**

   - Normal: "Ask Anything You Want To Know ...."
   - Global: "Ask any legal question globally..."

5. **Navigation Integration**

   - Passes `isGlobalMode: isGlobalMode` to ChatScreen
   - Console logging for debugging

6. **Styles Defined**
   - `globalIconActive`: Background + border for active state
   - `globalModeIndicator`: Badge styling
   - `globalModeText`: Text styling
   - `globalModeClose`: Close button styling

## Testing Steps

### 1. **Visual Verification**

- [ ] Open Legal GPT screen
- [ ] Look for globe icon next to paperclip button
- [ ] Verify debug text shows "Global Mode = false"

### 2. **Toggle Functionality**

- [ ] Click globe icon
- [ ] Check console for: "Globe icon pressed, current mode: false"
- [ ] Verify debug text changes to "Global Mode = true"
- [ ] Verify globe icon color changes to primary color
- [ ] Verify globe icon gets background highlight

### 3. **Global Mode Indicator**

- [ ] When global mode active, verify badge appears above input
- [ ] Badge should show: "🌐 Global Mode Active [X]"
- [ ] Click X button to close global mode
- [ ] Verify badge disappears and globe icon returns to normal

### 4. **Placeholder Text**

- [ ] Normal mode: "Ask Anything You Want To Know ...."
- [ ] Global mode: "Ask any legal question globally..."

### 5. **Navigation Test**

- [ ] Enable global mode
- [ ] Type a question
- [ ] Click send button
- [ ] Verify navigation to ChatScreen
- [ ] Check if ChatScreen opens with global mode enabled

## Troubleshooting

### If Globe Icon Not Visible:

1. **Check Console Logs**

   - Look for any JavaScript errors
   - Verify ThemeContext is working

2. **Check Styles**

   - Verify `colors.primary` and `colors.secondaryText` are defined
   - Check if `inputIcon` style is applied correctly

3. **Check Layout**
   - Verify the TouchableOpacity is not hidden
   - Check if there are layout conflicts

### If Click Not Working:

1. **Check onPress Handler**

   - Should log: "Globe icon pressed, current mode: [boolean]"
   - Verify `setIsGlobalMode` is being called

2. **Check Touch Target**
   - Verify TouchableOpacity has proper dimensions
   - Check if there are overlapping elements

### If Styles Not Applied:

1. **Check Color Values**

   - Verify `colors.primary` exists and has valid value
   - Check if color concatenation (`colors.primary + '20'`) works

2. **Check Style Object**
   - Verify `globalIconActive` style is properly defined
   - Check if conditional styling `isGlobalMode && styles.globalIconActive` works

## Debug Information Added

### Console Logging:

```typescript
console.log('Globe icon pressed, current mode:', isGlobalMode);
console.log('Sending input:', inputText, 'Global Mode:', isGlobalMode);
```

### Visual Debug:

```typescript
<Text
  style={{
    color: colors.text,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  }}>
  Debug: Global Mode = {isGlobalMode.toString()}
</Text>
```

### Enhanced Styles:

```typescript
globalIconActive: {
  backgroundColor: colors.primary + '30',  // More visible
  borderRadius: 8,
  padding: 4,
  borderWidth: 2,                          // Added border
  borderColor: colors.primary,
}
```

## Expected Behavior

### Normal State:

- Globe icon: Gray color, no background
- No global mode badge
- Normal placeholder text
- Debug shows: "Global Mode = false"

### Active State:

- Globe icon: Primary color with background + border
- Global mode badge visible above input
- Global placeholder text
- Debug shows: "Global Mode = true"
- Console logs when clicked

### Navigation:

- Creates session normally
- Passes `isGlobalMode: true` to ChatScreen
- ChatScreen initializes with global mode enabled

## Common Issues & Solutions

### Issue: Icon not changing color

**Solution**: Check if `colors.primary` is properly defined in ThemeContext

### Issue: Background not showing

**Solution**: Verify style concatenation (`colors.primary + '30'`) works

### Issue: Badge not appearing

**Solution**: Check if `isGlobalMode` state is properly updating

### Issue: Navigation not working

**Solution**: Verify `handleSend` function includes `isGlobalMode` parameter

The implementation should be fully functional. If issues persist, check the console logs and debug indicators to identify the specific problem area.
