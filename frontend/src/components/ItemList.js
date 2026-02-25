// src/components/ItemList.js
import React from 'react';
import { useAtom } from 'jotai';
import { itemsAtom, deleteItemAtom } from '../atoms/itemsAtoms';

export default function ItemList({ onEdit }) {
    const [items] = useAtom(itemsAtom);
    const [, deleteItem] = useAtom(deleteItemAtom);

    if (!items.length) return <p>No items found.</p>;

    return (
        <ul>
            {items.map((item) => (
                <li key={item.id}>
                    <div>
                        <strong>{item.title}</strong>
                        <p>{item.description}</p>
                    </div>
                    <button onClick={() => onEdit(item)}>Edit</button>
                    <button onClick={() => deleteItem(item.id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
}
