import useSWR from "swr";

interface Personnel {
    id: string;
    name: string;
    role: string;
    isDriver: boolean;
    isCrew: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useOptions() {
    const { data, error } = useSWR<Personnel[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/options`, fetcher);

    const driverOptions = data?.filter((person) => person.isDriver) || [];
    const crewOptions = data?.filter((person) => person.isCrew) || [];

    return {
        driverOptions,
        crewOptions,
        isLoading: !error && !data,
        isError: error,
    };
}
