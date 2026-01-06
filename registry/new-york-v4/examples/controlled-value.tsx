"use client"

import { PlaceAutocomplete } from "@/registry/new-york-v4/ui/place-autocomplete"
import React from "react"

export function ControlledValue() {
    const [address, setAddress] = React.useState("")

    return (
        <PlaceAutocomplete
            className="w-96"
            value={address}
            onChange={(value) => setAddress(value)}
        />
    )
}
