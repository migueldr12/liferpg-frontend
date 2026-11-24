import { CATEGORIES, ITEMS } from '../../../shared/assets/registry';
import { useEffect, useMemo, useState } from 'react';
import {
  createCategory,
  createItem,
  deleteCategory,
  getCategories,
  getItems,
  setItemActive,
  updateCategory,
} from '../api/economiaApi';

// Hook de 14.2 Gestión de catálogo (RF044): categorías y artículos.

export const CATEGORY_TYPES = [
  { key: 'habitos', label: 'Hábitos' },
  { key: 'misiones', label: 'Misiones' },
  { key: 'tienda', label: 'Tienda' },
  { key: 'stickers', label: 'Stickers' },
];

export const ITEM_GROUPS = [
  { key: 'tienda', label: 'Tienda' },
  { key: 'exclusivos', label: 'Exclusivos' },
  { key: 'regalables', label: 'Regalables' },
  { key: 'stickers', label: 'Stickers' },
];

// Íconos disponibles: claves del registro de assets (RDF139). Cada clave existe como
// `icon_assets.key` en Mongo y como archivo en `public/catalog`.
export const CATEGORY_ICON_OPTIONS = CATEGORIES.map((c) => c.key);
export const ITEM_ICON_OPTIONS = ITEMS.map((i) => i.key);
export const ICON_OPTIONS = [...CATEGORY_ICON_OPTIONS, ...ITEM_ICON_OPTIONS];

const emptyCategory = { name: '', type: 'habitos', icon: CATEGORY_ICON_OPTIONS[0] };
const emptyItem = { name: '', icon: ITEM_ICON_OPTIONS[0], price: 50, tag: '' };

export function useCatalogo() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [group, setGroup] = useState('tienda');

  const [categoryForm, setCategoryForm] = useState(null); // null = cerrado
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [itemForm, setItemForm] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    Promise.all([getCategories(), getItems()])
      .then(([cats, its]) => {
        setCategories(cats);
        setItems(its);
      })
      .catch(() => setError('No se pudo cargar el catálogo.'))
      .finally(() => setLoading(false));
  }, []);

  const run = async (action, okMessage) => {
    setError(null);
    setNotice(null);
    try {
      await action();
      if (okMessage) setNotice(okMessage);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  };

  // ── Categorías ──
  const openNewCategory = () => {
    setEditingCategoryId(null);
    setCategoryForm({ ...emptyCategory });
  };
  const openEditCategory = (category) => {
    setEditingCategoryId(category.id);
    setCategoryForm({ name: category.name, type: category.type, icon: category.icon });
  };
  const closeCategoryForm = () => {
    setCategoryForm(null);
    setEditingCategoryId(null);
  };
  const saveCategory = () =>
    run(async () => {
      if (editingCategoryId) {
        const updated = await updateCategory(editingCategoryId, categoryForm);
        setCategories((list) => list.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const created = await createCategory(categoryForm);
        setCategories((list) => [...list, created]);
      }
      closeCategoryForm();
    }, editingCategoryId ? 'Categoría actualizada.' : 'Categoría creada.');

  const removeCategory = (category) =>
    run(async () => {
      await deleteCategory(category.id);
      setCategories((list) => list.filter((c) => c.id !== category.id));
    }, `Categoría "${category.name}" eliminada.`);

  // ── Artículos ──
  const visibleItems = useMemo(() => items.filter((i) => i.group === group), [items, group]);
  const activeCount = visibleItems.filter((i) => i.active).length;

  const toggleItem = (item) =>
    run(async () => {
      const updated = await setItemActive(item.id, !item.active);
      setItems((list) => list.map((i) => (i.id === updated.id ? updated : i)));
    });

  const openNewItem = () => setItemForm({ ...emptyItem });
  const closeItemForm = () => setItemForm(null);
  const saveItem = () =>
    run(async () => {
      const created = await createItem({ ...itemForm, group, price: Number(itemForm.price) });
      setItems((list) => [...list, created]);
      closeItemForm();
    }, 'Artículo agregado.');

  return {
    categories,
    group,
    setGroup,
    visibleItems,
    activeCount,
    categoryForm,
    setCategoryForm,
    editingCategoryId,
    openNewCategory,
    openEditCategory,
    closeCategoryForm,
    saveCategory,
    removeCategory,
    itemForm,
    setItemForm,
    openNewItem,
    closeItemForm,
    saveItem,
    toggleItem,
    loading,
    error,
    notice,
  };
}
