import AdminHeader from '../components/AdminHeader';
import { CATEGORY_TYPES, ICON_OPTIONS, ITEM_GROUPS, useCatalogo } from '../hooks/useCatalogo';
import '../components/economia.css';

const typeLabel = (key) => CATEGORY_TYPES.find((t) => t.key === key)?.label ?? key;

// Selector de ícono reutilizado por los dos formularios (RDF139)
function IconPicker({ value, onChange }) {
  return (
    <div className="m14-icons">
      {ICON_OPTIONS.map((icon) => (
        <button key={icon} type="button" className={icon === value ? 'm14-icon activo' : 'm14-icon'}
          onClick={() => onChange(icon)} aria-label={`Ícono ${icon}`}>
          {icon}
        </button>
      ))}
    </div>
  );
}

// 14.2 Gestión de catálogo (RF044)
export default function CatalogoPage() {
  const vm = useCatalogo();

  return (
    <main className="page m14">
      <AdminHeader title="Catálogo" subtitle="Alimenta la tienda (M04), el cofre (M08) y los stickers (M10)" />

      {vm.error && <p className="m14-error">{vm.error}</p>}
      {vm.notice && <p className="m14-notice">{vm.notice}</p>}

      {vm.loading ? (
        <p className="texto-suave">Cargando catálogo…</p>
      ) : (
        <div className="m14-grid-catalogo">
          {/* Categorías (RDF137, RDF138) */}
          <section className="m14-panel">
            <div className="m14-panel-head">
              <h2 className="titulo-pixel">Categorías</h2>
              <button className="m14-btn-chico" onClick={vm.openNewCategory}>+ Nueva</button>
            </div>

            {vm.categoryForm && (
              <form className="m14-subform" onSubmit={(e) => { e.preventDefault(); vm.saveCategory(); }}>
                <input placeholder="Nombre de la categoría" value={vm.categoryForm.name} autoFocus
                  onChange={(e) => vm.setCategoryForm({ ...vm.categoryForm, name: e.target.value })} />
                <select value={vm.categoryForm.type}
                  onChange={(e) => vm.setCategoryForm({ ...vm.categoryForm, type: e.target.value })}>
                  {CATEGORY_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
                </select>
                <IconPicker value={vm.categoryForm.icon} onChange={(icon) => vm.setCategoryForm({ ...vm.categoryForm, icon })} />
                <div className="m14-row">
                  <button type="submit" className="m14-btn-chico">{vm.editingCategoryId ? 'Guardar' : 'Crear'}</button>
                  <button type="button" className="m14-btn-texto" onClick={vm.closeCategoryForm}>Cancelar</button>
                </div>
              </form>
            )}

            <ul className="m14-categorias">
              {vm.categories.map((c) => (
                <li key={c.id}>
                  <span className="m14-cat-icon">{c.icon}</span>
                  <button className="m14-cat-body" onClick={() => vm.openEditCategory(c)} title="Editar">
                    <strong>{c.name}</strong>
                    <small>{typeLabel(c.type)} · {c.inUse > 0 ? `${c.inUse} en uso` : 'sin uso'}</small>
                  </button>
                  <button className="m14-btn-borrar" onClick={() => vm.removeCategory(c)} disabled={c.inUse > 0}
                    title={c.inUse > 0 ? 'No se puede eliminar: está en uso' : 'Eliminar'} aria-label={`Eliminar ${c.name}`}>
                    🗑
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Artículos (RDF140) */}
          <section className="m14-panel">
            <div className="m14-panel-head">
              <div className="m14-tabs chicas" role="tablist">
                {ITEM_GROUPS.map((g) => (
                  <button key={g.key} role="tab" aria-selected={vm.group === g.key}
                    className={vm.group === g.key ? 'm14-tab activo' : 'm14-tab'} onClick={() => vm.setGroup(g.key)}>
                    {g.label}
                  </button>
                ))}
              </div>
              <span className="texto-suave">{vm.activeCount} de {vm.visibleItems.length} activos</span>
              <button className="m14-btn-chico" onClick={vm.openNewItem}>+ Artículo</button>
            </div>

            {vm.itemForm && (
              <form className="m14-subform" onSubmit={(e) => { e.preventDefault(); vm.saveItem(); }}>
                <input placeholder="Nombre del artículo" value={vm.itemForm.name} autoFocus
                  onChange={(e) => vm.setItemForm({ ...vm.itemForm, name: e.target.value })} />
                <div className="m14-row">
                  <label className="m14-input-box m14-inline">
                    <small>Precio</small>
                    <input type="number" min="0" value={vm.itemForm.price}
                      onChange={(e) => vm.setItemForm({ ...vm.itemForm, price: e.target.value })} />
                  </label>
                  <input placeholder="Etiqueta (p. ej. Ropa)" value={vm.itemForm.tag}
                    onChange={(e) => vm.setItemForm({ ...vm.itemForm, tag: e.target.value })} />
                </div>
                <IconPicker value={vm.itemForm.icon} onChange={(icon) => vm.setItemForm({ ...vm.itemForm, icon })} />
                <div className="m14-row">
                  <button type="submit" className="m14-btn-chico">Agregar</button>
                  <button type="button" className="m14-btn-texto" onClick={vm.closeItemForm}>Cancelar</button>
                </div>
              </form>
            )}

            <div className="m14-items">
              {vm.visibleItems.map((item) => (
                <article key={item.id} className={item.active ? 'm14-item' : 'm14-item inactivo'}>
                  <div className="m14-item-head">
                    <span className="m14-item-icon">{item.icon}</span>
                    <div>
                      <strong>{item.name}</strong>
                      <small className="m14-precio">{item.price > 0 ? `${item.price} monedas` : 'Sin costo'}</small>
                    </div>
                  </div>
                  <div className="m14-tags">
                    {item.tags.map((t) => <span key={t}>{t}</span>)}
                  </div>
                  <label className="m14-switch">
                    <input type="checkbox" checked={item.active} onChange={() => vm.toggleItem(item)} />
                    <span className="m14-switch-ui" />
                    {item.active ? 'Activo' : 'Inactivo'}
                  </label>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
