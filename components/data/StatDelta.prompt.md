Signed percentage change, coloured by whether the direction is good.

```jsx
<StatDelta value={-18.4} goodWhen="down" basis="vs. previous 7 days" />
```

Always pass `basis` — a delta without a comparison window is unreadable.
