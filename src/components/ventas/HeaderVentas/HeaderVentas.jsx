

export default function HeaderVentas() {
    return (
        <div className="border-2 border-black">
            {/* creo un boton que me redirecciona a la ruta de la pagina que termina en /inventario */}
            <button className="border-2 border-black rounded"
            onClick={
                () => {
                    window.location.href = '/inventario'
                }
            }
            >Inventario</button>
        </div>
    )
}