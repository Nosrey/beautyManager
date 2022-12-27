import { SET_FORM, SET_PRODUCTOS, SET_EDIT, FILTRAR_PRODUCTOS, ORDENAR_NOMBRE, ORDENAR_PRECIO, ORDENAR_STOCK, SET_CATEGORIAS, SET_INPUT1, SET_INPUT2 } from "./actions-types";

export function setForm() {
    return function (dispatch) {
        return (
            dispatch({ type: SET_FORM })
        )
    }
}

export function setEdit(id, productoLista) {
    let producto = {}
    for (let i = 0; i < productoLista.length; i++) {
        if (productoLista[i].id === id) producto = productoLista[i]
    }
    console.log('soy el producto: ', producto)
    return function (dispatch) {
        return (
            dispatch({ type: SET_EDIT, payload: producto })
        )
    }
}

export function setProductos() {
    return function (dispatch) {
        return (
            fetch('http://192.168.1.108:3001/products')
                .then((res) => res.json())
                .then((json) => {
                    dispatch({ type: SET_PRODUCTOS, payload: json })
                })
        )
    }
}

export function filtrarProductos(lista, filtro, filtro2) {
    return function (dispatch) {
        // funcion para eliminar acentos de una palabra dada
        function eliminarAcentos(palabra) {
            let palabraSinAcentos = palabra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return palabraSinAcentos
        }

        

        // una funcion que separe palabras por espacio entre ellas y las guarde en un array
        function separarPalabras(texto) {
            let palabras = []
            let palabra = ''
            for (let i = 0; i < texto.length; i++) {
                if (texto[i] === ' ') {
                    palabras.push(palabra)
                    palabra = ''
                }
                else palabra = palabra + texto[i]
            }
            palabras.push(palabra)
            return palabras
        }


        let palabrasJuntas = separarPalabras(eliminarAcentos(filtro))

        // declaramos resultados para guardar las coincidencias
        let resultados = []

        // un filtro que recibe un input y las separa por espacios en un array, luego revisa si cada una de esas palabras coincide con el nombre del producto o si tiene coincidencia con las categorias del producto, las coincidencias se guardan en un array y se retorna ese array
        if (palabrasJuntas.length && lista.length) {
            for (let i = 0; i < lista.length; i++) {
                let aprobado = 0; // para confirmar que cumple los valores del buscador
                for (let j = 0; j < palabrasJuntas.length; j++) {
                    for (let k = 0; k < lista[i].Categories.length; k++) {
                        if (lista[i].Categories[k].name.toLowerCase().includes(palabrasJuntas[j].toLowerCase()) && palabrasJuntas[j].length) { aprobado = aprobado + 1; }
                    }

                    if (lista[i].name.toLowerCase().includes(palabrasJuntas[j].toLowerCase()) && palabrasJuntas[j].length) { aprobado = aprobado + 1; }
                }
                // pushear el elemento de la lista si la variable aprobado es mayor o igual a la longitud de palabrasJuntas
                if (aprobado >= palabrasJuntas.length) resultados.push(lista[i])
            }
        }

        // revisar coincidencias en palabrasJuntas con respecto al nombre de los productos
        if (palabrasJuntas.length && lista.length) {
            for (let i = 0; i < lista.length; i++) {

            }
        }

        if (!resultados.length) { resultados = []; dispatch({ type: FILTRAR_PRODUCTOS, payload: resultados }) }
        else dispatch({ type: FILTRAR_PRODUCTOS, payload: resultados })
    }
}

export function ordenarNombre(gatillo) {
    // console.log('entro ordenar nombre')
    return function (dispatch) {
        dispatch({ type: ORDENAR_NOMBRE, payload: gatillo })
    }
}


export function ordenarPrecio(gatillo) {
    // console.log('entro ordenar precio')
    return function (dispatch) {
        dispatch({ type: ORDENAR_PRECIO, payload: gatillo })
    }
}


export function ordenarStock(gatillo) {
    // console.log('entro ordenar stock')
    return function (dispatch) {
        dispatch({ type: ORDENAR_STOCK, payload: gatillo })
    }
}

export function setCategorias() {
    return function (dispatch) {
        return (
            fetch('http://192.168.1.108:3001/categories')
                .then((res) => res.json())
                .then((json) => {
                    dispatch({ type: SET_CATEGORIAS, payload: json })
                })
        )
    }
}

export function filtrarCategorias(lista, filtro, filtro2) {
    return function (dispatch) {
        let resultados = []
        let lista2 = []
        if (filtro2.length) {
            lista2 = lista.filter((el) => el.name.toLowerCase().includes(filtro2.toLowerCase()))
            lista = lista2
        }

        for (let i = 0; i < lista.length; i++) {
            let aprobado = 0; // para confirmar que cumple los valores del buscador
            for (let j = 0; j < filtro.length; j++) {
                for (let k = 0; k < lista[i].Categories.length; k++) {
                    if (lista[i].Categories[k].name.toLowerCase() === filtro[j].toLowerCase() && filtro[j].length) { aprobado = aprobado + 1; break; }
                }
                if (aprobado === filtro.length) resultados.push(lista[i])
            }
        }
        if (!resultados.length && lista2.length) resultados = lista2
        if (!resultados.length && !filtro2.length) dispatch({ type: FILTRAR_PRODUCTOS, payload: [] })
        else { dispatch({ type: FILTRAR_PRODUCTOS, payload: resultados }) }
    }
}

export function setInput1(text) {
    return function (dispatch) {
        dispatch({ type: SET_INPUT1, payload: text })
    }
}

export function setInput2(text) {
    return function (dispatch) {
        dispatch({ type: SET_INPUT2, payload: text })
    }
}