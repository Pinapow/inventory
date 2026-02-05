import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ListsPage from './pages/ListsPage';
import ListDetail from './pages/ListDetail';
import ListForm from './pages/ListForm';
import ItemForm from './pages/ItemForm';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/lists" element={<ListsPage />} />
        <Route path="/lists/new" element={<ListForm />} />
        <Route path="/lists/:id" element={<ListDetail />} />
        <Route path="/lists/:id/edit" element={<ListForm />} />
        <Route path="/lists/:listId/items/new" element={<ItemForm />} />
        <Route path="/lists/:listId/items/:itemId/edit" element={<ItemForm />} />
        {/* Redirect old routes */}
        <Route path="/inventory" element={<Navigate to="/lists" replace />} />
        <Route path="/inventory/*" element={<Navigate to="/lists" replace />} />
      </Routes>
    </Layout>
  );
}
