# References Feature Implementation

## What was implemented:

1. **New State Variables:**

   - `selectedReference`: Stores the currently selected reference for the dialog
   - `isReferenceDialogVisible`: Controls the visibility of the reference dialog modal

2. **New Functions:**

   - `openReferenceDialog(reference)`: Opens the dialog with the selected reference
   - `closeReferenceDialog()`: Closes the dialog and clears the selected reference

3. **Updated UI:**

   - References now display as clickable file buttons with file icons
   - Each reference shows: file icon + filename + external link icon
   - Clicking a reference opens a full-screen modal dialog

4. **Dialog Modal Features:**
   - Full-screen modal with proper header
   - Shows filename in the header
   - Close button (X) in the top right
   - Scrollable content area with Markdown rendering
   - Proper styling that matches the app theme

## How it works:

When you click on "References" button:

1. The app fetches references from the API
2. References are displayed as a list of clickable file buttons
3. Each button shows the filename with appropriate icons
4. Clicking any filename opens a dialog modal
5. The dialog shows the full document content with proper formatting
6. User can scroll through the content and close when done

## API Response Format Expected:

```json
{
  "references": [
    {
      "filename": "The Consumer Protection Act, 2019.pdf",
      "document_text": "\nPage 1\n1 \n \nTHE CONSUMER PRO..."
    }
  ]
}
```

The implementation is complete and ready to use!
