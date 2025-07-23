import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { PiCaretLeft, PiCaretRight } from "react-icons/pi"
import { cn } from "@/lib/utils"

export default function Pagination<T>({ table }: { table: Table<T> }) {
  const [pageNumbers, setPageNumbers] = useState<Array<number | string>>([])

  useEffect(() => {
    setPageNumbers(getPageNumbers())
  }, [table.getState().pagination.pageIndex, table.getPageCount()])

  function getPageNumbers() {
    const pages = []
    const siblingCount = 1

    const totalNumbers = siblingCount * 2 + 5 // first, last, current, and siblings
    const totalBlocks = totalNumbers + 2 // includes ...

    if (table.getPageCount() > totalBlocks) {
      const leftSiblingIndex = Math.max(table.getState().pagination.pageIndex - siblingCount, 1)
      const rightSiblingIndex = Math.min(table.getState().pagination.pageIndex + siblingCount, table.getPageCount() - 2)

      const showLeftDots = leftSiblingIndex > 2
      const showRightDots = rightSiblingIndex < table.getPageCount() - 3

      pages.push(0) // Always show first page (index 0)

      if (showLeftDots) pages.push("left-dots")

      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pages.push(i)
      }

      if (showRightDots) pages.push("right-dots")

      pages.push(table.getPageCount() - 1) // Always show last page
    } else {
      for (let i = 0; i < table.getPageCount(); i++) {
        pages.push(i)
      }
    }

    return pages
  }

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
        <PiCaretLeft size={16} />
      </Button>
      {pageNumbers.map((page, index) => {
        return page === "left-dots" || page === "right-dots" ? (
          <span key={index} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className={cn(
              "bodySB",
              page === table.getState().pagination.pageIndex ? "border-0 bg-gray-200" : "text-[#A5A7A6]",
            )}
            onClick={() => table.setPageIndex(page as number)}
          >
            {(page as number) + 1}
          </Button>
        )
      })}

      <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
        <PiCaretRight size={16} />
      </Button>
    </div>
  )
}
