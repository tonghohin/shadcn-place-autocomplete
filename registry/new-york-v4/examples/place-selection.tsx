"use client"

import { PlaceAutocomplete } from "@/registry/new-york-v4/ui/place-autocomplete"
import React from "react"

export function PlaceSelection() {
    const [selectedPlace, setSelectedPlace] = React.useState("")

    return (
        <div className="flex flex-col gap-2">
            <PlaceAutocomplete
                className="w-96"
                onPlaceSelect={(feature) => {
                    setSelectedPlace(
                        feature.properties.name ||
                            feature.properties.street ||
                            "Unknown place"
                    )
                }}
            />
            <p className="text-muted-foreground text-sm">
                {selectedPlace
                    ? `Selected place: ${selectedPlace}`
                    : "Start typing to select a place"}
            </p>
        </div>
    )
}
