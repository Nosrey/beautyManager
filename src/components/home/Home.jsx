import React, { useState, useEffect } from 'react';
// importo history de react router dom
import { useNavigate } from 'react-router-dom'
import CrearProducto from '../crearProducto/crearProducto.jsx';
import { setForm, setProductos, ordenarNombre, ordenarPrecio, ordenarStock, setEdit, ordenarDeposito, ordenarTotal, ordenarPrecioCompra, cambiarStock, filtrarProductos, ordenarCodigo, cambiarGatilloEliminar, cambiarPagina } from '../../actions/index'
import { connect } from "react-redux";
import CambiarProducto from '../cambiarProducto/cambiarProducto.jsx';
import BuscarProducto from '../buscarProducto/buscarProducto.jsx';
// importo el componente eliminarProducto.jsx
import EliminarProducto from '../eliminarProducto/eliminarProducto.jsx'
// importo axios
import Axios from 'axios';
import './Home.css'
import addBtn2 from '../../images/addBtn2.png'
// importo la imagen removeBtn
import removeBtn from '../../images/removeBtn.png'
// importar editBtn
import editBtn from '../../images/editBtn.png'
// importar transferBtn
import transferBtn from '../../images/transferBtn.png'
// importar imagen bannerMorado
import bannerMorado from '../../images/bannerHalfBlue.jpg'
// importar rightArrow.png
import rightArrow from '../../images/rightArrow.png'
// importar leftArrow.png
import leftArrow from '../../images/leftArrow.png'
// importo paginado.jsx
import Paginado from '../paginado/paginado.jsx'
// importo el componente botonSumar
import BotonSumar from '../botonSumar/botonSumar.jsx'
// importo boton3bars.png
import boton3bars from '../../images/boton3bars.png'
// importo loadingIcon
import loadingIcon from '../../images/loadingIcon.png'



const ip = "https://vercel-api-hazel-five.vercel.app"
// const ip = "http://localhost:3001"
const ipPagina = "https://inventorymanager.onrender.com"

const cantidadPagina = 25

// exporto las constantes ip e ipPagina
export { ip, ipPagina, addBtn2, removeBtn }

let gatilloNombre = true;
let gatilloStock = true;

function Home({ mostrarForm, setForm, setProductos, productos, mostrarEdit, productosFiltrados, ordenarNombre, ordenarPrecio, ordenarStock, activo, categorias, setEdit, input1, ordenarDeposito, ordenarTotal, ordenarPrecioCompra, cambiarStock, productoToEdit, filtrarProductos, ordenarCodigo, gatilloEliminar, cambiarGatilloEliminar, pagina, cambiarPagina }) {

    const navigate = useNavigate()

    useEffect(() => {
        const unlisten = navigate((location, action) => {
            // Verificamos que el cambio en la ruta se ha producido al presionar el botón de retroceso
            if (action === 'POP') {
                if (window.android) {
                    // Detecta cuando se presiona el botón de retroceder en el navegador
                    if (mostrarEdit || mostrarForm) {
                        // Desactiva la variable
                        if (mostrarForm) setForm()
                        if (mostrarEdit) setEdit(productoToEdit.id, productos)
                    } else {
                        window.android.minimize();
                    }
                }
            }
        });

        return () => {
          // Revisamos si unlisten es una función primero
          if (typeof unlisten === 'function') unlisten();
        };
        // eslint-disable-next-line
      }, [mostrarEdit, mostrarForm, navigate]);

    // declaro estados para mi componente cambiarProducto
    const [precio, setPrecio] = useState(productoToEdit.price)
    const [precioCompra, setPrecioCompra] = useState(productoToEdit.priceBuy)
    const [stock, setStock] = useState(productoToEdit.stock)
    const [stockDeposito, setStockDeposito] = useState(productoToEdit.stockDeposito)

    // declaro con useState numeroDeposito y numeroStock
    const [numeroDeposito, setNumeroDeposito] = useState(0);
    const [numeroStock, setNumeroStock] = useState(0);
    // declaro un estado controlado para el input donde sumare o restare diferencias entre stock y stockDeposito
    const [numeroBase, setNumeroBase] = useState(0);
    // declaro el estado gatilloCambiar
    const [gatilloCambiar, setGatilloCambiar] = useState(false);
    // declaro el estado sumarORestar en true
    const [sumarORestar, setSumarORestar] = useState(true);

    // declaro el estado gatilloSumar para activar la interfaz de sumar productos
    const [gatilloSumar, setGatilloSumar] = useState(false);
    // ahora creo el estado numeroASumar para establecer el numero que editare desde dicha interfaz
    const [numeroASumar, setNumeroASumar] = useState({});
    // creo el estado cargando que contendra un booleando para controlar si se activa la pantalla de carga o se apaga
    const [cargando, setCargando] = useState(false);

    const flechaImagen = 'https://cdn-icons-png.flaticon.com/512/37/37808.png'

    const ordenNombre = function () {
        ordenarNombre(gatilloNombre)
        gatilloNombre = !gatilloNombre
    }

    const ordenStock = function () {
        ordenarStock(gatilloStock)
        gatilloStock = !gatilloStock
    }

    function sumarRestar(num2, num3, bool) {
        setCargando(true)
        let { pnumeroBase } = document.forms[0];

        let productData = {}

        for (let i = 0; i < productos.length; i++) {
            if (productos[i].id === productoToEdit.id) productData = productos[i]
        }

        if (bool) {
            if (Number(num2) - Number(pnumeroBase.value) > 0) {
                // aplicar la resta y suma
                num2 = Number(num2) - Number(pnumeroBase.value)
                num3 = Number(num3) + Number(pnumeroBase.value);
            } else {
                // sumarle a num3 el valor de num2 y poner num2 en 0
                num3 = Number(num3) + Number(num2);
                num2 = Number(num2) - Number(num2);
            }

            //asignar a productData los valores de num2 y num3 a stock y stockDeposito
            productData.stockDeposito = Number(num2);
            productData.stock = Number(num3);

            console.log('soy el producto a enviar: ', productData)

            Axios.put(ip + '/products/' + productoToEdit.id, productData)
                .then(() => setProductos()) // para pedir los productos actualizados
                .then(() => {  // vaciamos el formulario
                    // pongo en cero numeroBase
                    setNumeroBase(0);
                    // desactivo gatilloCambiar
                })
                .then(() => setGatilloCambiar(false))
                .then(() => {
                    filtrarProductos(productos, '') // actualizamos el filtro al crear un nuevo producto
                })
                // pongo sumarORestar en true de nuevo
                .then(() => {
                    setSumarORestar(true)
                    setCargando(false)
                })
                .catch((err) => {
                    console.log('sucedio un error: ', err.response.data);
                    setCargando(false);
                })



        } else {
            // hago lo mismo que arriba pero invirtiendo num1 y num2
            if (Number(num3) - Number(pnumeroBase.value) > 0) {
                // aplicar la resta y suma
                num2 = Number(num2) + Number(pnumeroBase.value)
                num3 = Number(num3) - Number(pnumeroBase.value);
                // enviar como .put los numeros resueltos
            } else {
                // sumarle a num2 el valor de num3 y poner num3 en 0
                num2 = Number(num2) + Number(num3);
                num3 = Number(num3) - Number(num3);
            }

            //asignar a productData los valores de num2 y num3 a stock y stockDeposito
            productData.stockDeposito = Number(num2);
            productData.stock = Number(num3);

            console.log('soy el producto a enviar: ', productData)

            Axios.put(ip + '/products/' + productoToEdit.id, productData)
                .then(() => setProductos()) // para pedir los productos actualizados
                .then(() => {  // vaciamos el formulario
                    // pongo en cero numeroBase
                    setNumeroBase(0);
                    // desactivo gatilloCambiar
                })
                .then(() => setGatilloCambiar(false))
                .then(() => {
                    filtrarProductos(productos, '') // actualizamos el filtro al crear un nuevo producto
                })
                // pongo sumarORestar en true de nuevo
                .then(() => setSumarORestar(true))
                .catch((err) => {
                    console.log('sucedio un error: ', err.response.data);
                })



        }
    }

    useEffect(() => {
        // Your code here
        setProductos();
    }, []); //eslint-disable-line

    // implemento un useEffect que actualiza los estados de numeroDeposito y numeroStock solo cuando la variable productoToEdit reciba algun cambio
    useEffect(() => {
        setNumeroDeposito(productoToEdit.stockDeposito);
        setNumeroStock(productoToEdit.stock);
    }, [productoToEdit]) //eslint-disable-line

    // un useEffect donde si productoToEdit o productos cambian entonces se revisa una lista en base a esta foruma (productosFiltrados.length? productosFiltrados : productos).slice((pagina * 10) -10, (pagina * 10)) y si la longitud de la lista es menor a 1 entonces la pagina se retrocede en 1 a traves de cambiarPagina(pagina - 1)
    useEffect(() => {
        if (productos.length) {
            if (productosFiltrados.length) {
                if ((productosFiltrados.slice((pagina * cantidadPagina) - cantidadPagina, (pagina * cantidadPagina))).length < 1) {
                    cambiarPagina(pagina - 1)
                }
            } else {
                if ((productos.slice((pagina * cantidadPagina) - cantidadPagina, (pagina * cantidadPagina))).length < 1) {
                    cambiarPagina(pagina - 1)
                }
            }
            if (pagina <= 0) cambiarPagina(1)
        }

    }, [productosFiltrados, productos, pagina]) //eslint-disable-line

    return (
        <div className=''>
            <div className={cargando ? 'flex flex-col justify-center items-center w-screen h-screen fixed bg-slate-50 z-40 opacity-70' : 'hidden'}>
                <img className='animate-spin mx-auto my-auto w-auto h-[50%] fixed top-[25%]' src={loadingIcon} alt='loading' />
            </div>

            { }
            <div className={
                (gatilloSumar) ? 'w-screen h-screen fixed bg-slate-50 z-20 opacity-70 ' : 'hidden'
            }>
            </div>

            <BotonSumar gatilloSumar={gatilloSumar} numeroASumar={numeroASumar} setNumeroASumar={setNumeroASumar} setGatilloSumar={setGatilloSumar} precio={precio} setPrecio={setPrecio} precioCompra={precioCompra} setPrecioCompra={setPrecioCompra} stock={stock} setStock={setStock} stockDeposito={stockDeposito} setStockDeposito={setStockDeposito} />

            <div className={
                (gatilloCambiar) ? 'w-screen h-screen fixed bg-slate-50 z-20 opacity-70 blur-sm' : 'hidden'
            }>
            </div>

            <div className={
                (gatilloEliminar) ? 'w-screen h-screen fixed bg-slate-50 z-20 opacity-70 blur-sm' : 'hidden'
            }>
            </div>
            <EliminarProducto visible={gatilloEliminar} />


            <div className={
                (gatilloCambiar) ? 'text-4xl rounded-xl w-[80%] xl:w-[30%] fixed top-[30%] xl:top-[20%] md:top-[10%] left-[10%] xl:left-[35%] z-30' : 'hidden'
            }>
                <div className=' bg-white border shadow text-center rounded-2xl p-1 xl:p-3'>
                    <form className=' flex flex-col' onSubmit={(e) => { e.preventDefault(); sumarRestar(productoToEdit.stockDeposito, productoToEdit.stock, sumarORestar) }}>
                        <button className=' my-1' type='button' onClick={() => setSumarORestar(!sumarORestar)}>
                            <div className='hover:w-[95%] xl:hover:animate-pulse mx-auto w-[90%] flex flex-col justify-center items-center text-lg  '>
                                <img alt='arrowRight' src={(sumarORestar) ? rightArrow : leftArrow} className=' w-full' />
                            </div>
                        </button>
                        <div className='flex flex-row mx-auto inline items-center justify-center'>
                            <h4 className=' w-[25%] inline'>{numeroDeposito}</h4>
                            <input className='w-1/4 text-center' type='number' placeholder='0' name='pnumeroBase' value={numeroBase} onChange={(e) => {
                                // estableco el formulario controlado para este input
                                setNumeroBase(e.target.value)
                            }} />
                            <h4 className=' w-[25%] inline'>{numeroStock}</h4>
                        </div>
                        <div className='flex flex-row mx-auto mt-5 mb-1 '>
                            <button className='mx-4 m-0 text-lg bg-blue-500 text-white px-3 font-semibold py-0.5 rounded-md  text-md text-2xl xl:text-3xl shadow-sm xl:hover:animate-bounce italic p-10 md:text-3xl mb-2' type='button' onClick={() => { setGatilloCambiar(false); setSumarORestar(true) }}>Cerrar</button>
                            <button className='mx-4 m-0 text-lg bg-blue-500 text-white px-3 font-semibold py-0.5 rounded-md text-md text-2xl xl:text-3xl shadow-sm xl:hover:animate-bounce  italic p-1 md:text-3xl mb-2' type='submit'>Enviar</button>
                        </div>
                    </form>
                </div>
            </div>

            <nav className={"flex flex-col xl:flex-row items-center xl:justify-between bg-blue-900 py-3 pt-3 bg-[url(" + bannerMorado + ")] bg-cover xl:px-8"}>
                <BuscarProducto />

                <button onClick={setForm} className='z-10 hover:bg-slate-50 text-xl flex flex-row mb-1 mx-10 xl:ml-10 xl:fixed items-center xl:bottom-[-1%] xl:right-0 xl:mr-0 bg-white border p-3 pr-4 py-2 xl:py-3 shadow rounded-lg hover:animate-pulse items-center justify-center'>
                    <h1 className='mr-3 inline text-black font-bold text-1xl'>Nuevo Producto</h1>
                    <img className='inline rounded text-base xl:text-xl w-8' src={addBtn2} alt='addBtn2' />
                </button>
                <button className='mx:m-0 mt-2 mb-0 w-auto inline w-[8%] xl:w-[3.5%] '>
                    <img src={boton3bars} alt='3 bars btn' className='w-[100%]' />
                </button>
            </nav>

            <CrearProducto visible={mostrarForm} cargando={cargando} setCargando={setCargando} />
            <CambiarProducto visible={mostrarEdit} setGatilloSumar={setGatilloSumar} gatilloSumar={gatilloSumar} setNumeroASumar={setNumeroASumar} precio={precio} setPrecio={setPrecio} precioCompra={precioCompra} setPrecioCompra={setPrecioCompra} stock={stock} setStock={setStock} stockDeposito={stockDeposito} setStockDeposito={setStockDeposito} cargando={cargando} setCargando={setCargando} />
            <Paginado />
            <div className='w-screen overflow-x-auto'>
                {(input1.length && !productosFiltrados.length) ? <h1 className='text-center text-xl xl:text-2xl font-serif bg-red-600 mx-3 xl:mx-20 text-white font-bold py-2 xl:py-4 my-2 xl:my-6 rounded'>No hay productos que coincidan con tu busqueda</h1> : null}

                <ul className='font-serif flex flex-col items-center justify-center text-center my-6 mt-0 flex justify-around overflow-x-auto w-[260%] xl:w-[100%] xl:w-screen text-xl xl:text-2xl px-6 xl:pr-9  '>
                    <li className='font-serif flex flex-row my-3 font-bold flex w-full shadow pb-3'>
                        <h2 className='font-serif flex-grow min-w-0 basis-[6.25%]'>Img</h2>
                        <div className='font-serif flex-grow min-w-0 basis-[6.25%] flex flew-row items-center '>
                            {/* boton con una imagen dada */}
                            <button onClick={() => ordenarCodigo(productos, productosFiltrados, activo)} className='flex flex-row items-center xl:hover:animate-pulse hover:shadow hover:border hover:rounded-lg hover:p-2 hover:italic mx-auto'>
                                <img className='w-6 h-6 ' src={flechaImagen} alt='flecha' />
                                <h2>#</h2>
                            </button>
                        </div>
                        <div className='font-serif flex-grow min-w-0 basis-[18.75%] flex flew-row items-center'>
                            {/* boton con una imagen dada */}
                            <button onClick={ordenNombre} className='flex flex-row items-center xl:hover:animate-pulse hover:shadow hover:border hover:rounded-lg hover:p-2 hover:italic mx-auto'>
                                <img className='w-6 h-6 ' src={flechaImagen} alt='flecha' />
                                <h2>Nombre</h2>
                            </button>
                        </div>

                        <div className='font-serif flex-grow min-w-0 basis-[12.5%] flex flew-row items-center '>
                            {/* boton con una imagen dada */}
                            <button onClick={() => ordenarDeposito(productos, productosFiltrados, activo)} className='flex flex-row items-center xl:hover:animate-pulse hover:shadow hover:border hover:rounded-lg hover:p-2 hover:italic mx-auto'>
                                <img className='w-6 h-6 ' src={flechaImagen} alt='flecha' />
                                <h2>Deposito</h2>
                            </button>
                        </div>

                        <div className='font-serif flex-grow min-w-0 basis-[12.5%] flex flew-row items-center '>
                            {/* boton con una imagen dada */}
                            <button onClick={ordenStock} className='flex flex-row items-center xl:hover:animate-pulse hover:shadow hover:border hover:rounded-lg hover:p-2 hover:italic mx-auto'>
                                <img className='w-6 h-6 ' src={flechaImagen} alt='flecha' />
                                <h2>Tienda</h2>
                            </button>
                        </div>

                        <div className='font-serif flex-grow min-w-0 basis-[12.5%] flex flew-row items-center '>
                            {/* boton con una imagen dada */}
                            <button onClick={() => ordenarTotal(productos, productosFiltrados, activo)} className='flex flex-row items-center xl:hover:animate-pulse hover:shadow hover:border hover:rounded-lg hover:p-2 hover:italic mx-auto'>
                                <img className='w-6 h-6 ' src={flechaImagen} alt='flecha' />
                                <h2>Total</h2>
                            </button>
                        </div>

                        <div className='font-serif flex-grow min-w-0 basis-[12.5%] flex flew-row items-center'>
                            {/* boton con una imagen dada */}
                            <button onClick={() => ordenarPrecio(productos, productosFiltrados, activo)} className='flex flex-row items-center justify-center hover:xl:animate-pulse hover:shadow hover:border hover:rounded-lg hover:p-2 hover:italic mx-auto'>
                                <img className='w-6 h-6 ' src={flechaImagen} alt='flecha' />
                                <h2>Venta</h2>
                            </button>
                        </div>

                        <div className='font-serif flex-grow min-w-0 basis-[12.5%] flex flew-row items-center  '>
                            {/* boton con una imagen dada */}
                            <button onClick={() => ordenarPrecioCompra(productos, productosFiltrados, activo)} className='flex flex-row items-center justify-center xl:hover:animate-pulse hover:shadow hover:border hover:rounded-lg hover:p-2 hover:italic mx-auto'>
                                <img className='w-6 h-6 ' src={flechaImagen} alt='flecha' />
                                <h2 className=''>Compra</h2>
                            </button>
                        </div>
                        <h2 className='font-serif flex-grow min-w-0 basis-[6.25%]'> </h2>
                    </li>

                    {(!(productosFiltrados.length ? productosFiltrados : productos).slice((pagina * cantidadPagina) - cantidadPagina, (pagina * cantidadPagina)).length > 0) ?
                        <li className='w-full flex flex-col items-center justify-center xl:mt-6 italic'>
                            <h1 className='font-serif text-2xl xl:text-4xl mx-auto font-bold font-serif block mt-0'>No hay productos disponibles</h1>
                            <img className="w-3/4 xl:w-1/2 bottom-1" src="https://chryslergroup.navigation.com/static/WFS/Shop-Site/-/Shop/en_US/Product%20Not%20Found.png" alt="notFound" />
                        </li>


                        : (productosFiltrados.length ? productosFiltrados : productos).slice((pagina * cantidadPagina) - cantidadPagina, (pagina * cantidadPagina)).map(el => {
                            // permitir que mi elemento li se expanda a lo anchos de la pantalla
                            return <li className='border-4 shadow-2xl rounded font-serif flex flex-row py-6 odd:bg-white even:bg-slate-100 last:border-b-4 border-b-0 w-full relative font-bold text-3xl'>
                                <div className='ml-2 flex-grow min-w-0 basis-[6.25%] my-auto'>
                                    <img className='w-[90%] m-auto' src={el.imagen} alt="Product" />
                                </div>
                                <h3 className='flex-grow min-w-0 basis-[6.25%] my-auto static text-2xl italic '>{'#' + el.id}</h3>
                                <h3 className='flex-grow min-w-0 basis-[18.75%] my-auto break-normal static text-2xl'>{el.name}</h3>
                                <div className='flex flex-row flex-grow basis-[25%] relative justify-center items-center '>

                                    <h3 className='flex-grow min-w-0 basis-[50%] my-auto'>{el.stockDeposito}</h3>
                                    <button className="absolute w-[10%] xl:w-[10%] md:w-[6%] left-[45%] xl:left-[45%] md:left-[47%] xl:hover:animate-pulse" onClick={() => { cambiarStock(el.id, productos); setGatilloCambiar(true) }}>
                                        <img src={transferBtn} alt='transferArrow' className='w-[100%] h-[100%]' />
                                    </button>
                                    <h3 className='flex-grow min-w-0 basis-[50%] my-auto'>{el.stock}</h3>

                                </div>
                                <h3 className='flex-grow min-w-0 basis-[12.5%] my-auto  font-bold'>{Number(el.stock) + Number(el.stockDeposito)}</h3>
                                <h3 className='flex-grow min-w-0 basis-[12.5%] my-auto  font-bold'>{'$' + el.price}</h3>
                                <h3 className='flex-grow min-w-0 basis-[12.5%] my-auto  font-bold'>{'$' + el.priceBuy}</h3>

                                <div className='flex-grow min-w-0 basis-[6.25%] my-auto flex flex-col items-center justify-center'>
                                    <button className="xl:hover:animate-pulse font-bold rounded block my-auto flex flex-row items-center justify-center text-base hover:shadow hover:border hover:rounded-lg hover:p-2 hover:text-xl flex flex-col justify-center items-center mr-2" onClick={() => setEdit(el.id, productos)}>
                                        <h4>Editar</h4>
                                        <img src={editBtn} alt='pencil' className='w-8 h-8 hover:w-9 hover:h-9' />
                                    </button>
                                </div>
                            </li>
                        })}
                </ul>
            </div>
            <Paginado />

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        mostrarForm: state.mostrarForm,
        mostrarEdit: state.mostrarEdit,
        productos: state.productos,
        productosFiltrados: state.productosFiltrados,
        activo: state.activo,
        categorias: state.categorias,
        // importar de mi reducer el estado input1
        input1: state.input1,
        // implemento productoToEdit
        productoToEdit: state.productoToEdit,
        // traigo gatillo eliminar del reducer
        gatilloEliminar: state.gatilloEliminar,
        // traigo pagina del estado
        pagina: state.pagina,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setForm: () => dispatch(setForm()),
        setProductos: () => dispatch(setProductos()),
        ordenarNombre: (gatillo) => dispatch(ordenarNombre(gatillo)),
        ordenarPrecio: (lista, lista2, gatillo) => dispatch(ordenarPrecio(lista, lista2, gatillo)),
        ordenarStock: (gatillo) => dispatch(ordenarStock(gatillo)),
        setEdit: (id, productoLista) => dispatch(setEdit(id, productoLista)),
        ordenarDeposito: (lista, lista2, gatillo) => dispatch(ordenarDeposito(lista, lista2, gatillo)),
        ordenarTotal: (lista, lista2, gatillo) => dispatch(ordenarTotal(lista, lista2, gatillo)),
        ordenarPrecioCompra: (lista, lista2, gatillo) => dispatch(ordenarPrecioCompra(lista, lista2, gatillo)),
        // implemento cambiarStock
        cambiarStock: (id, lista) => dispatch(cambiarStock(id, lista)),
        // implemento filtrarProductos
        filtrarProductos: (input1, lista) => dispatch(filtrarProductos(input1, lista)),
        // implemento ordenarCodigo
        ordenarCodigo: (lista, lista2, gatillo) => dispatch(ordenarCodigo(lista, lista2, gatillo)),
        // implementar cambiarGatilloEliminar
        cambiarGatilloEliminar: () => dispatch(cambiarGatilloEliminar()),
        cambiarPagina: (pagina) => dispatch(cambiarPagina(pagina)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);