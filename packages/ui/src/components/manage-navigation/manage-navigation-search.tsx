import { useEffect, useRef, useState } from 'react'

import { Button, Popover, ScrollArea, SearchBox, Text } from '@/components'
import { useDebounceSearch } from '@/hooks'
import { MenuGroupType, NavbarItemType } from '@components/app-sidebar/types'
import { cn } from '@utils/cn'

const filterItems = (categories: MenuGroupType[], query: string): MenuGroupType[] => {
  if (!query.trim()) return categories

  return categories.reduce<MenuGroupType[]>((acc, category) => {
    const filteredItems = category.items.filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
    if (filteredItems.length > 0) {
      acc.push({
        ...category,
        items: filteredItems
      })
    }
    return acc
  }, [])
}

interface ManageNavigationSearchProps {
  navbarMenuData: MenuGroupType[]
  addToPinnedItems: (item: NavbarItemType) => void
}

export const ManageNavigationSearch = ({ navbarMenuData, addToPinnedItems }: ManageNavigationSearchProps) => {
  const [filteredItems, setFilteredItems] = useState<MenuGroupType[]>(navbarMenuData)
  const [isSearchDialogOpen, setSearchDialogOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)

  const {
    search: searchQuery,
    handleSearchChange,
    handleResetSearch
  } = useDebounceSearch({
    handleChangeSearchValue: (val: string) => setFilteredItems(filterItems(navbarMenuData, val))
  })

  const handleItemClick = (item: NavbarItemType) => {
    addToPinnedItems(item)
    handleResetSearch()
    setSearchDialogOpen(false)
  }

  const handleInputFocus = () => {
    setSearchDialogOpen(true)
    if (searchQuery === '') {
      setFilteredItems(navbarMenuData)
    }
  }

  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'tab') {
        const isShift = e.shiftKey
        const activeElement = document.activeElement

        if (!popoverRef.current) return

        const focusableElements = popoverRef.current!.querySelectorAll<HTMLElement>('button:not([disabled])')
        const firstFocusableElement = focusableElements[0]

        if (!isShift && activeElement === inputRef.current) {
          e.preventDefault()

          if (firstFocusableElement) {
            firstFocusableElement.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleTabKey)

    return () => {
      window.removeEventListener('keydown', handleTabKey)
    }
  }, [])

  const countFilteredItems =
    filteredItems.length + filteredItems.reduce((acc, category) => acc + category.items.length, 0)

  return (
    <Popover.Root open={isSearchDialogOpen} onOpenChange={setSearchDialogOpen}>
      <Popover.Trigger asChild>
        <SearchBox.Root
          className="w-full"
          inputClassName="h-9 placeholder:text-cn-foreground-3"
          ref={inputRef}
          placeholder="Add menu element"
          value={searchQuery}
          handleChange={handleSearchChange}
          hasSearchIcon={false}
          onFocus={handleInputFocus}
        />
      </Popover.Trigger>
      <Popover.Content
        className="w-[368px] overflow-hidden !rounded border-cn-borders-2 bg-cn-background-2 !p-0"
        ref={popoverRef}
        align="start"
        onWheel={e => e.stopPropagation()}
        onOpenAutoFocus={e => e.preventDefault()}
        onCloseAutoFocus={e => e.preventDefault()}
      >
        <ScrollArea className={cn('relative max-h-[50vh]', countFilteredItems > 10 && 'h-[404px]')}>
          <div className="px-1 pb-2 pt-1">
            <span
              className="from-background-2 pointer-events-none absolute inset-x-0 top-0 h-3 w-full bg-gradient-to-b to-transparent"
              aria-hidden
            />
            <span
              className="from-background-2 pointer-events-none absolute inset-x-0 bottom-0 h-3 w-full bg-gradient-to-t to-transparent"
              aria-hidden
            />
            {countFilteredItems === 0 ? (
              <Text className="block w-full px-2 py-4 text-cn-foreground-3">No results found</Text>
            ) : (
              filteredItems.map((category, index) => (
                <div
                  className={cn(index > 0 ? 'border-cn-borders-4 mt-0.5 border-t pt-2' : 'pt-1')}
                  key={`category-${category.groupId}-${index}`}
                >
                  <Text className="inline-block px-2 leading-none text-cn-foreground-3" size={1}>
                    {category.title}
                  </Text>
                  <div className="mt-2.5 flex flex-col">
                    {category.items.map(item => (
                      <Button
                        className="h-9 cursor-pointer rounded-sm px-2 focus-visible:ring-offset-0"
                        variant="ghost"
                        key={`item-${item.id}`}
                        onClick={() => handleItemClick(item)}
                      >
                        <div className="flex w-full items-center gap-x-2">
                          <Text className="truncate leading-tight text-cn-foreground-1">{item.title}</Text>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Popover.Content>
    </Popover.Root>
  )
}
