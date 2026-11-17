The app's fixed 240px left rail; collapses to 64px.

```jsx
<SidebarNav activeId="diagnosis" onSelect={setView}
  sections={[{ label: 'Workspace', items: [{ id: 'diagnosis', label: 'Diagnosis', icon: 'activity' }] }]} />
```
