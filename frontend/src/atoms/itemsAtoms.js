// src/atoms/itemsAtoms.js
import { atom } from 'jotai';

const API_URL = 'http://localhost:5000/api/items';

export const itemsAtom = atom([]);
export const loadingAtom = atom(false);
export const errorAtom = atom(null);

export const fetchItemsAtom = atom(null, async (get, set) => {
    set(loadingAtom, true);
    set(errorAtom, null);
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        set(itemsAtom, data);
    } catch (error) {
        set(errorAtom, error.message);
    } finally {
        set(loadingAtom, false);
    }
});

export const addItemAtom = atom(null, async (get, set, item) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });
        const newItem = await response.json();
        const items = get(itemsAtom);
        set(itemsAtom, [...items, newItem]);
        return newItem;
    } catch (error) {
        set(errorAtom, error.message);
    }
});

export const updateItemAtom = atom(null, async (get, set, item) => {
    try {
        const response = await fetch(`${API_URL}/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });
        const updatedItem = await response.json();
        const items = get(itemsAtom);
        const newItems = items.map(i => i.id === item.id ? updatedItem : i);
        set(itemsAtom, newItems);
        return updatedItem;
    } catch (error) {
        set(errorAtom, error.message);
    }
});

export const deleteItemAtom = atom(null, async (get, set, id) => {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        const items = get(itemsAtom);
        set(itemsAtom, items.filter(i => i.id !== id));
    } catch (error) {
        set(errorAtom, error.message);
    }
});
