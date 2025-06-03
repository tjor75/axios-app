/*
* Módulo OMDBWrapper
* Se asume que si la web cae, se devuelve returnObject original
*/
import 'dotenv/config';
import axios from "axios";

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;


const OMDB_KEY = process.env.EXPO_PUBLIC_OMDB_KEY; // Poné tu OMDB_KEY, esta no funciona.

function armarRequestUrl(queryParams) {
    const requestUrl = new URL("https://www.omdbapi.com/");
    requestUrl.searchParams.append("apikey", OMDB_KEY);
    for (const key in queryParams)
        requestUrl.searchParams.append(key, queryParams[key]);
    return requestUrl.href;
}

const OMDBSearchByPage = async (searchText, page = 1) => {
    let returnObject = {
        respuesta : false,
        cantidadTotal : 0,
        datos : []
    };
    const requestUrl = armarRequestUrl({ s: searchText, page: page });

    try {
        const response = await axios.get(requestUrl);
        returnObject.respuesta = response.data.Response === "True";
        if (returnObject.respuesta) {
            returnObject.cantidadTotal = parseInt(response.data.totalResults);
            returnObject.datos = response.data.Search;
        }
    } catch (error) {
        console.error("No se pudo conectar a la API:", error);
    }

    return returnObject;
};
const OMDBSearchComplete = async (searchText) => {
    let returnObject = {
        respuesta : false,
        cantidadTotal : 0,
        datos : []
    };
    let cantidadObtenida = 0;
    let page = 1;
    let requestUrl;
    let response;
    let respuesta, cantidadTotal = 0, datos = [];

    try {
        requestUrl = armarRequestUrl({ s: searchText });
        response = await axios.get(requestUrl);
        respuesta = response.data.Response === "True";
        if (respuesta) {
            cantidadTotal = parseInt(response.data.totalResults);
            datos.push(...response.data.Search);
            cantidadObtenida += response.data.Search.length;
        }

        while (respuesta && cantidadObtenida < cantidadTotal && page < 100) {
            page++;
            requestUrl = armarRequestUrl({ s: searchText, page });
            response = await axios.get(requestUrl);
            datos.push(...response.data.Search);
            cantidadObtenida += response.data.Search.length;
        }

        returnObject.respuesta = respuesta;
        returnObject.cantidadTotal = cantidadTotal;
        returnObject.datos = datos;
    } catch (error) {
        console.error("No se pudo conectar a la API:", error);
    }
    
    return returnObject;
};
const OMDBGetByImdbID = async (imdbID) => {
    let returnObject = {
        respuesta : false,
        cantidadTotal : 0,
        datos : {}
    };
    const requestUrl = armarRequestUrl({ i: imdbID });

    try {
        const response = await axios.get(requestUrl);
        returnObject.respuesta = response.data.Response === "True";
        if (returnObject.respuesta) {
            delete response.data.Response
            returnObject.datos = response.data;
            returnObject.cantidadTotal = 1;
        }
    } catch (error) {
        console.error("No se pudo conectar a la API:", error);
    }

    return returnObject;
};
// Exporto todo lo que yo quiero exponer del módulo:
export {OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID};