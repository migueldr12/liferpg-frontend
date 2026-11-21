import React from 'react';

export const TablaCodigos = ({ codigos, onRevocar }) => {
  return (
    <section className="m07-panel">
      <h2>Mis códigos</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="m07-tabla">
          <thead>
            <tr>
              <th>CÓDIGO</th>
              <th>ESTADO</th>
              <th>USOS</th>
              <th>VIGENCIA</th>
              <th>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {codigos.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.codigo}</strong></td>
                <td>
                  <span className={`m07-status-tag ${item.estado.toLowerCase()}`}>
                    {item.estado}
                  </span>
                </td>
                <td>{item.usosActuales}/{item.usosMaximos}</td>
                <td>{item.vigenciaText}</td>
                <td>
                  {item.estado === 'Vigente' && (
                    <button className="m07-btn-peligro" onClick={() => onRevocar(item.id)}>
                      Revocar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};