Centred modal on a 44% ink scrim, 14px radius.

```jsx
<Dialog title="Apply strategy?" description="4 ad sets will change budget immediately."
  footer={<><Button onClick={close}>Cancel</Button><Button variant="primary">Apply</Button></>} onClose={close} />
```

Primary action goes last. Use `variant="danger"` for destructive confirmations.
