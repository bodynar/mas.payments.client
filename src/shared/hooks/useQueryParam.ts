import { useLocation } from "react-router-dom";

/**
 * Extract query parameter value from query string
 * @param paramKey Name of parameter to look
 * @returns Found parameter value of null
 */
export default function useQueryParam(paramKey: string): string | undefined {
    const { search } = useLocation();
    const params = new URLSearchParams(search);

    return params.has(paramKey)
        ? params.get(paramKey)!
        : undefined;
}
