"use client"

import { PlaceAutocomplete } from "@/registry/new-york-v4/ui/place-autocomplete"
import React from "react"

export function ControlledPlaceAutocomplete() {
    const [address, setAddress] = React.useState("")

    return (
        <PlaceAutocomplete
            value={address}
            onChange={(value) => setAddress(value)}
        />
    )
}
