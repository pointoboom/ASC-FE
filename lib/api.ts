'use client'
import useSWR from "swr"
import fetcher, { fetcherWithBody } from "./fetcher"


export function getUsers(q: string | null = null, start: number = 1, limit: number = 10) {
    const { data, error, mutate, isLoading } = useSWR(`/api/user?start=${start}&limit=${limit}&q=${q || ''}`, fetcher)
    return { data, error, mutate, isLoading }
}

export async function updateUser(id: string, data: any) {
    const res = await fetcherWithBody(`/api/user/${id}`, "PATCH", data)
    return res
}

export async function deleteUser(id: string) {
    const res = await fetcherWithBody(`/api/user/${id}`, "DELETE", null)
    return res
}

export async function createUser(data: any) {
    const res = await fetcherWithBody(`/api/user`, "POST", data)
    return res
}
