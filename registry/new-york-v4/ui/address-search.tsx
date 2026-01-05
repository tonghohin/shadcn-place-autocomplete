"use client"

import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/registry/new-york-v4/ui/command"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/registry/new-york-v4/ui/input-group"
import { Spinner } from "@/registry/new-york-v4/ui/spinner"
import type { BBox, Feature, FeatureCollection, Point } from "geojson"
import { MapPinIcon, SearchIcon } from "lucide-react"
import * as React from "react"

interface AddressFeatureProperties {
    osm_id: number
    osm_type: "N" | "W" | "R"
    osm_key: string
    osm_value: string
    type: string
    name?: string
    housenumber?: string
    street?: string
    locality?: string
    district?: string
    postcode?: string
    city?: string
    county?: string
    state?: string
    country?: string
    countrycode?: string
    extent?: [number, number, number, number]
    extra?: Record<string, string>
}
type AddressFeature = Feature<Point, AddressFeatureProperties>
type AddressFeatureCollection = FeatureCollection<
    Point,
    AddressFeatureProperties
>

/**
 * Query parameters for Photon geocoding API
 * @see https://github.com/komoot/photon#photon-api
 */
interface AddressSearchOptions {
    /** Search text (address, place name, or POI) */
    query: string
    /** Preferred language for results (e.g., "en", "de", "fr") */
    lang?: string
    /** Maximum number of results to return */
    limit?: number
    /**
     * Bounding box used to restrict results.
     * Format: [minLongitude, minLatitude, maxLongitude, maxLatitude]
     */
    bbox?: BBox
    /** Latitude used to bias results toward a specific location */
    lat?: number
    /** Longitude used to bias results toward a specific location */
    lon?: number
    /**
     * Zoom level used for location biasing.
     * Higher values increase locality.
     */
    zoom?: number
    /**
     * Strength of the location bias.
     */
    locationBiasScale?: number
}

function formatAddress(properties: AddressFeatureProperties) {
    const parts = []

    if (properties.name) {
        parts.push(properties.name)
    }

    if (properties.housenumber && properties.street) {
        parts.push(`${properties.housenumber} ${properties.street}`)
    } else if (properties.street) {
        parts.push(properties.street)
    }

    if (properties.city) {
        parts.push(properties.city)
    } else if (properties.locality) {
        parts.push(properties.locality)
    }

    if (properties.state && properties.state !== properties.city) {
        parts.push(properties.state)
    }

    if (properties.country) {
        parts.push(properties.country)
    }

    return [...new Set(parts)].join(", ")
}

function buildSearchUrl({
    query,
    bbox,
    lang,
    lat,
    limit,
    locationBiasScale,
    lon,
    zoom,
}: AddressSearchOptions) {
    const url = new URL("https://photon.komoot.io/api")
    url.searchParams.set("q", query)

    if (lang) {
        url.searchParams.set("lang", lang)
    }

    if (limit) {
        url.searchParams.set("limit", String(limit))
    }

    if (bbox) {
        url.searchParams.set("bbox", bbox.join(","))
    }

    if (lat !== undefined && lon !== undefined) {
        url.searchParams.set("lat", String(lat))
        url.searchParams.set("lon", String(lon))
    }

    if (zoom !== undefined) {
        url.searchParams.set("zoom", String(zoom))
    }

    if (locationBiasScale !== undefined) {
        url.searchParams.set("location_bias_scale", String(locationBiasScale))
    }

    return String(url)
}

function useDebounce<T>(value: T, delay: number = 300) {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])

    return debouncedValue
}

function useAddressSearch({
    debounceMs,
    query,
    ...props
}: {
    debounceMs: number
} & AddressSearchOptions) {
    const [results, setResults] = React.useState<AddressFeature[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<Error | null>(null)
    const [hasSearched, setHasSearched] = React.useState(false)

    const debouncedQuery = useDebounce(query, debounceMs)

    React.useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([])
            setIsLoading(false)
            setHasSearched(false)
            return
        }

        const abortController = new AbortController()

        async function fetchResults() {
            setIsLoading(true)
            setError(null)
            setHasSearched(true)

            try {
                const url = buildSearchUrl({
                    query: debouncedQuery,
                    ...props,
                })

                const response = await fetch(url, {
                    signal: abortController.signal,
                })

                if (!response.ok) {
                    throw new Error(
                        `Photon API error: ${response.status} ${response.statusText}`
                    )
                }

                const data: AddressFeatureCollection = await response.json()
                const features = data.features
                const addressOsmIds = new Set()
                const dedupedFeatures = features.filter((feature) => {
                    const featureOsmId = feature.properties.osm_id
                    if (addressOsmIds.has(featureOsmId)) {
                        return false
                    }
                    addressOsmIds.add(featureOsmId)
                    return true
                })
                setResults(dedupedFeatures)
            } catch (err) {
                if (err instanceof Error && err.name !== "AbortError") {
                    setError(err)
                    setResults([])
                }
            } finally {
                setIsLoading(false)
            }
        }

        fetchResults()

        return () => {
            abortController.abort()
        }
    }, [
        debouncedQuery,
        props.lang,
        props.limit,
        props.bbox,
        props.lat,
        props.lon,
        props.zoom,
        props.locationBiasScale,
    ])

    return { results, isLoading, error, hasSearched }
}

function AddressSearch({
    debounceMs = 300,
    lang,
    limit = 5,
    bbox,
    lat,
    lon,
    zoom,
    locationBiasScale,
    className,
    value: controlledValue,
    onChange: controlledOnChange,
    onSelect,
    onResultsChange,
    ...props
}: {
    debounceMs?: number
    onSelect?: (feature: AddressFeature) => void
    onResultsChange?: (results: AddressFeature[]) => void
} & Omit<AddressSearchOptions, "query"> &
    React.ComponentProps<"input">) {
    const [internalValue, setInternalValue] = React.useState("")
    const isControlled = controlledValue !== undefined
    const value = String(isControlled ? controlledValue : internalValue)
    const onChange = isControlled
        ? controlledOnChange
        : (event: React.ChangeEvent<HTMLInputElement>) =>
              setInternalValue(event.target.value)

    const { results, isLoading, error, hasSearched } = useAddressSearch({
        query: value,
        debounceMs,
        lang,
        limit,
        bbox,
        lat,
        lon,
        zoom,
        locationBiasScale,
    })

    React.useEffect(() => {
        onResultsChange?.(results)
    }, [results, onResultsChange])

    function handleSelect(feature: AddressFeature) {
        const address = formatAddress(feature.properties)
        setInternalValue(address)
        onSelect?.(feature)
    }

    const hasNoResults =
        hasSearched && !isLoading && !error && results.length === 0
    const hasResults = results.length > 0

    return (
        <Command
            className={cn("border shadow-md", className)}
            shouldFilter={false}>
            <InputGroup
                data-disabled
                className="rounded-none border-none shadow-none !ring-0 dark:bg-transparent">
                <InputGroupAddon>
                    <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput
                    placeholder="Search for an address..."
                    value={value}
                    onChange={onChange}
                    {...props}
                />
                {isLoading && (
                    <InputGroupAddon align="inline-end">
                        <Spinner />
                    </InputGroupAddon>
                )}
            </InputGroup>
            {(error || hasNoResults || hasResults) && (
                <CommandList className="border-t">
                    {error && (
                        <CommandEmpty>Error: {error.message}</CommandEmpty>
                    )}
                    {hasNoResults && (
                        <CommandEmpty>Can't find {value}.</CommandEmpty>
                    )}
                    {hasResults && (
                        <CommandGroup>
                            {results.map((feature) => {
                                const formattedAddress = formatAddress(
                                    feature.properties
                                )

                                return (
                                    <CommandItem
                                        key={feature.properties.osm_id}
                                        value={String(
                                            feature.properties.osm_id
                                        )}
                                        onSelect={() => handleSelect(feature)}>
                                        <MapPinIcon />
                                        <div>
                                            <p className="font-medium">
                                                {feature.properties.name ||
                                                    feature.properties.street ||
                                                    "Unknown Address"}
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                {formattedAddress}
                                            </p>
                                        </div>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    )}
                </CommandList>
            )}
        </Command>
    )
}

export { AddressSearch }
