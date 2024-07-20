export type SearchType ={
    city:string,
    country:string
}

export type Country = {
    code:string
    name:string
}

export type Weather = {
    name:string
    main: {
        temp_min:number
        temp_max:number
        temp:number
    }
}