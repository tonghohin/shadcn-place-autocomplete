import { type Registry } from "shadcn/schema"

export const ui: Registry["items"] = [
    {
        name: "place-autocomplete",
        title: "Place Autocomplete",
        description: "A place autocomplete component.",
        author: "Hin",
        type: "registry:ui",
        registryDependencies: ["command", "input-group", "spinner"],
        devDependencies: ["@types/geojson"],
        files: [
            {
                path: "ui/place-autocomplete.tsx",
                type: "registry:ui",
            },
        ],
    },
]
