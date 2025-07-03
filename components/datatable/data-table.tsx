"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"



import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { getUsers, deleteUser } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EditUserForm } from "./edit-user-form"
import { AddUserForm } from "./add-user-form"

export type User = {
  _id: string
  name: string
  age: number
  email: string
  avatarUrl: string
}

export type UserWithPagination = {
  docs: User[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage?: number | null
  nextPage?: number | null
}

export function DataTable( { data ,start,limit,setStart,setLimit,searchQuery,setSearchQuery, mutate}: { data: UserWithPagination, start: number, limit: number, setStart: (start: number) => void, setLimit: (limit: number) => void, searchQuery: string, setSearchQuery:(query: string) => void, mutate: any }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)

  const columns: ColumnDef<User>[] = [
 
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
    {
      accessorKey: "age",
      header: () => <div className="text-right">age</div>,
      cell: ({ row }) => {
        
        return <div className="text-right font-medium">{row.getValue("age")}</div>
      },
    },
    {
      accessorKey: "avatarUrl",
      header: () => <div className="text-right">avatarUrl</div>,
      cell: ({ row }) => {
       
        return <div className="text-right font-medium">{row.getValue("avatarUrl")}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original
  
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user)
                  setIsEditDialogOpen(true)
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setUserToDelete(user)
                  setIsDeleteDialogOpen(true)
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [currentPageInput, setCurrentPageInput] = React.useState(String(data.page))

  React.useEffect(() => {
    setCurrentPageInput(String(data.page))
  }, [data.page])

  const handleDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete._id)
        mutate()
        setIsDeleteDialogOpen(false)
        setUserToDelete(null)
      } catch (error) {
        console.error("Failed to delete user", error)
      }
    }
  }

  const table = useReactTable({
    data : data.docs,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter..."
          value={ searchQuery }
          onChange={(event) =>
            setSearchQuery(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="ml-auto flex items-center space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                Add User
              </Button>
            </DialogTrigger>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
              
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {data.page} of {data.totalPages}
        </div>
        <div className="space-x-2 flex items-center">
          <Input
            type="number"
            value={currentPageInput}
            onChange={(e) => setCurrentPageInput(e.target.value)}
            onBlur={() => {
              const page = parseInt(currentPageInput);
              if (!isNaN(page) && page > 0 && page <= data.totalPages) {
                setStart((page - 1) * limit + 1);
              } else {
                setCurrentPageInput(String(data.page)); // Revert to current page if invalid
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const page = parseInt(currentPageInput);
                if (!isNaN(page) && page > 0 && page <= data.totalPages) {
                  setStart((page - 1) * limit + 1);
                } else {
                  setCurrentPageInput(String(data.page)); // Revert to current page if invalid
                }
              }
            }}
            className="w-20 text-center"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStart(start - limit)}
            disabled={!data.hasPrevPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStart(start + limit)}
            disabled={!data.hasNextPage}
          >
            Next
          </Button>
        </div>
      </div>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <EditUserForm
              user={selectedUser}
              onClose={() => setIsEditDialogOpen(false)}
              mutate={mutate}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            Are you sure you want to delete {userToDelete?.name}?
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <AddUserForm onClose={() => setIsAddDialogOpen(false)} mutate={mutate} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
