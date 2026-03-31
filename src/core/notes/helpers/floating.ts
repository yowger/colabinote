export function getAnchorFromPlacement(
    placement: string,
): "left" | "right" | "top" | "bottom" {
    if (placement.includes("left")) return "left"
    if (placement.includes("right")) return "right"
    if (placement.includes("top")) return "top"
    if (placement.includes("bottom")) return "bottom"
    return "right" 
}
