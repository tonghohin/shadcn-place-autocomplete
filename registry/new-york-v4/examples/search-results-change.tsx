"use client"

import { PlaceAutocomplete } from "@/registry/new-york-v4/ui/place-autocomplete"
import React from "react"

export function SearchResultsChange() {
    const [resultCount, setResultCount] = React.useState(0)

    return (
        <div className="flex flex-col gap-2">
            <PlaceAutocomplete
                className="w-96"
                onResultsChange={(results) => {
                    setResultCount(results.length)
                }}
            />
            {resultCount > 0 && (
                <p className="text-muted-foreground text-sm">
                    Found {resultCount} result{resultCount !== 1 ? "s" : ""}.
                </p>
            )}
        </div>
    )
}
