import { type Registry } from "shadcn/schema"

export const ui: Registry["items"] = [
    {
        name: "address-search",
        title: "Address Search",
        description: "An address search component.",
        author: "Hin",
        type: "registry:ui",
        registryDependencies: [],
        files: [
            {
                path: "ui/address-search.tsx",
                type: "registry:ui",
            },
        ],
    },
]
