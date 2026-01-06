import { type Registry } from "shadcn/schema"

export const examples: Registry["items"] = [
    {
        name: "controlled-value",
        type: "registry:example",
        registryDependencies: ["place-autocomplete"],
        files: [
            {
                path: "examples/controlled-value.tsx",
                type: "registry:example",
            },
        ],
    },
    {
        name: "geocode-settings",
        type: "registry:example",
        registryDependencies: ["place-autocomplete"],
        files: [
            {
                path: "examples/geocode-settings.tsx",
                type: "registry:example",
            },
        ],
    },
    {
        name: "place-selection",
        type: "registry:example",
        registryDependencies: ["place-autocomplete"],
        files: [
            {
                path: "examples/place-selection.tsx",
                type: "registry:example",
            },
        ],
    },
    {
        name: "search-results-change",
        type: "registry:example",
        registryDependencies: ["place-autocomplete"],
        files: [
            {
                path: "examples/search-results-change.tsx",
                type: "registry:example",
            },
        ],
    },
]
