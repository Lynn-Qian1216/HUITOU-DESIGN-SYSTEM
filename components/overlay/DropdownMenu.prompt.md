Action menu anchored to a trigger.

```jsx
<DropdownMenu trigger={<IconButton icon="ellipsis" label="More" />} onSelect={run}
  items={[{ id: 'dup', label: 'Duplicate', icon: 'copy' }, { divider: true }, { id: 'del', label: 'Delete', icon: 'trash-2', tone: 'danger' }]} />
```
