import { withDefaultSize, withDefaultVariant } from "@chakra-ui/react";

export const withDefaults = [
    withDefaultVariant({
        variant: "filled",
        components: ["Input", "Textarea", "Select", "Checkbox", "Switch"],
    }),
    withDefaultSize({
        size: "md",
        components: ["Button"],
    }),
];
