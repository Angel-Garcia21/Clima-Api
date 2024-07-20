import { SearchType } from "../types"
import axios from "axios"
import { useMemo, useState } from "react"
import {z} from 'zod'



/* function isWeatherResponse (weather: unknown):  {
    
    //TYPE GUARD O ASSERTION
    /* return(
        Boolean(weather) &&
        typeof weather === 'object' && 
        typeof (weather as Weather).name === 'string' && 
        typeof(weather as Weather).main.temp === 'number' &&
        typeof(weather as Weather).main.temp_max === 'number' &&
        typeof(weather as Weather).main.temp_min === "number"
    ) */
    //}

    //ZOD
    const Weather = z.object({
        name:z.string(),
        main: z.object({
            temp_min:z.number(),
            temp_max:z.number(),
            temp:z.number()
            })
                })
        export type Weather = z.infer<typeof Weather> 

        //VALIBOT
        /* const   WeatherSchema = object({
            name:string(),
            main:object ({
                temp_min:number(),
                temp_max:number(),
                temp:number()
            })
        })

        type Weather = Output<typeof WeatherSchema> */


    export default function useWeather() {

        const initialState = {
            name:'',
            main: {
                temp:0,
                temp_max:0,
                temp_min:0
            }
        }

        const [weather, setWeather] = useState<Weather>(initialState)
        const [loading, setLoading] = useState(false)
        const [notFound, setNotFound] = useState(false)

        const fetchWeather = async(search: SearchType) => {
        const appId = import.meta.env.VITE_API_KEY 
        setLoading(true)
        setWeather(initialState)
        try {
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`
                const {data} = await axios.get(geoUrl)

                //Comprobar si existe Pais
                    if(!data[0]){
                        setNotFound(true)
                        return
                    }
                const lat = data[0].lat
                const lon = data[0].lon

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

                //CASTEAR EL TYPE
                    //const {data:weatherResult} = await axios<Weather>(weatherUrl)
                    //console.log(weatherResult.main.temp_max)
                    //console.log(weatherResult.name)

                //TYPE GUARDS
                    /* const {data:weatherResult} = await axios(weatherUrl)
                    const result = isWeatherResponse(weatherResult)
                    if(result) {
                        console.log(weatherResult.name)
                    } else {
                        console.log('Respuesta Incorrecta')
                    } */

                //ZOD
                const {data:weatherResult} = await axios.get(weatherUrl)
                const result = Weather.safeParse(weatherResult)
                if(result.success) {
                    setWeather(result.data)
                } else {
                    console.log('Respuesta mal obtenida')
                } 

                //Valibot
                /* const {data:weatherResult} = await axios(weatherUrl)
                const result = parse(WeatherSchema, weatherResult)
                if(result) {
                    console.log(result.name)
                }  */

        } catch (error) {
            console.log(error)
        
    } finally{
        setLoading(false)
    }

    }

    const hasWeatherData = useMemo(() =>weather.name, [weather])

  return {
    fetchWeather,
    weather, 
    hasWeatherData, 
    loading,
    notFound
    }
}
