import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { fetchItemsAtom, loadingAtom, errorAtom } from './atoms/itemsAtoms';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';
import './App.css';

function App() {
    const [, fetchItems] = useAtom(fetchItemsAtom);
    const [loading] = useAtom(loadingAtom);
    const [error] = useAtom(errorAtom);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const handleEdit = (item) => {
        setEditingItem(item);
    };

    const handleCancel = () => setEditingItem(null);

    return (
        <div className="App">
            <h1>CRUD App (React + Jotai)</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {loading && <p>Loading...</p>}
            <ItemForm editingItem={editingItem} onCancel={handleCancel} />
            <ItemList onEdit={handleEdit} />
        </div>
    );
}

export default App;
