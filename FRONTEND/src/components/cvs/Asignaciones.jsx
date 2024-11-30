const Asignaciones = () => {
    return (
      <div className="w-1/5" style={{ position: 'sticky', top: '-16px', maxHeight: '100vh', overflowY: 'auto' }}>
        <div className="border border-blue-300 bg-[#e9f0ff] rounded-lg p-4 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-[#293e68]">Asignaciones</h3>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index}>
                <label htmlFor={`asignacion${index}`} className="text-xs text-gray-600 block mb-1">
                  Asignación {index + 1}
                </label>
                <select
                  id={`asignacion${index}`}
                  className="form-select rounded p-1 text-sm w-full"
                >
                  <option value="">Seleccionar</option>
                  <option value="Etiqueta 1">Etiqueta 1</option>
                  <option value="Etiqueta 2">Etiqueta 2</option>
                  <option value="Etiqueta 3">Etiqueta 3</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  export default Asignaciones
  