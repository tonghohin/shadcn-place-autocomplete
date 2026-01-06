"use client"

import { PlaceAutocomplete } from "@/registry/new-york-v4/ui/place-autocomplete"
import React from "react"

export function SearchResultsChange() {
    const [resultCount, setResultCount] = React.useState(0)

    return (
        <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-sm">
                {resultCount === 0
                    ? "No results found"
                    : `${resultCount} result${resultCount !== 1 ? "s" : ""} found`}
            </p>
            <PlaceAutocomplete
                className="w-96"
                onResultsChange={(results) => {
                    setResultCount(results.length)
                }}
            />
        </div>
    )
}
