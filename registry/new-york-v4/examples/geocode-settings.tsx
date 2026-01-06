import { PlaceAutocomplete } from "@/registry/new-york-v4/ui/place-autocomplete"

export function GeocodeSettings() {
    return (
        <PlaceAutocomplete
            className="w-96"
            limit={10}
            lang="en"
            lat={40.7128}
            lon={-74.006}
            zoom={12}
        />
    )
}
