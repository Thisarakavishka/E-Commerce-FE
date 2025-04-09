/**
 * @param data Array of objects to export
 * @param headers Array of header objects with label and key
 * @param filename Name of the exported file
 */
export const exportToCSV = <T extends Record<string, any>>(
    data: T[],
    headers: { label: string; key: keyof T | ((item: T) => string) }[],
    filename = "export.csv",
): void => {
    // Create header row
    const headerRow = headers.map((header) => header.label)

    // Create data rows
    const rows = data.map((item) => {
        return headers.map((header) => {
            // If the header key is a function, call it with the item
            if (typeof header.key === "function") {
                return header.key(item)
            }
            // Otherwise, get the value from the item using the key
            const value = item[header.key as keyof T]
            return value !== undefined ? value : ""
        })
    })

    // Combine headers and rows
    const csvContent =
        "data:text/csv;charset=utf-8," +
        [headerRow, ...rows]
            .map((row) =>
                row
                    .map(String)
                    .map((cell) => `"${cell.replace(/"/g, '""')}"`)
                    .join(","),
            )
            .join("\n")

    // Create and trigger download
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
