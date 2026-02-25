# React Jotai CRUD

A CRUD application demonstrating **Jotai** for primitive state management with a Node.js backend.

## Features

- ✅ Primitive atom-based state management
- ✅ Minimal boilerplate
- ✅ Fetch items from backend API
- ✅ Create, update, delete items
- ✅ Client-server synchronization
- ✅ Async atoms for API calls
- ✅ Error handling and loading states

## Setup

```bash
npm install
```

## Development

```bash
npm start
```

The app runs on `http://localhost:3000`

## API Configuration

Connects to backend at `http://localhost:5000/api/items`

## State Management

Uses **Jotai** atoms:

- `itemsAtom` - List of items
- `loadingAtom` - Loading state
- `errorAtom` - Error messages
- `fetchItemsAtom` - Fetch items action
- `addItemAtom` - Add item action
- `updateItemAtom` - Update item action
- `deleteItemAtom` - Delete item action

## Key Concepts

### Atoms

```javascript
const itemsAtom = atom([]);
const fetchItemsAtom = atom(null, async (get, set) => {
  const data = await fetch(API_URL);
  set(itemsAtom, data);
});
```

### Using Atoms

```javascript
const [items] = useAtom(itemsAtom);
const [, fetchItems] = useAtom(fetchItemsAtom);
```

## Comparison

| Aspect | Jotai |
|--------|-------|
| Paradigm | Primitive atoms |
| Learning Curve | Gentle |
| Boilerplate | Minimal |
| Bundle Size | Very Small |
| Best For | Small to medium apps |

## When to Use Jotai

✅ Want minimal state management
✅ Prefer primitive atoms
✅ Building small to medium apps
✅ Need fine-grained control

❌ Very large applications
❌ Need complex devtools
❌ Team unfamiliar with atoms
