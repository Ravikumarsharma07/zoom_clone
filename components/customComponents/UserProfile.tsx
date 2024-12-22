"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut, useSession } from "next-auth/react"

type Checked = DropdownMenuCheckboxItemProps["checked"]

export function UserProfile() {
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
  const [showPanel, setShowPanel] = React.useState<Checked>(false)

  const {data:session} = useSession()
  const user = session?.user

  const imageURL = user?.image || "/images/user-profile.jpg"
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <img src={`${imageURL}`} className="w-9 max-sm:mt-1 sm:w-10 rounded-full" alt="user profile"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-max p-2 flex flex-col gap-1">
        <DropdownMenuLabel className="text-xl pl-0">Profile</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <p className="text-md opacity-80">{user?.name || user?.username}</p>
        <p className="text-md opacity-80">{user?.email}</p>
        <DropdownMenuSeparator />
        <Button variant="destructive" className="w-full" onClick={()=>signOut()}>Log out</Button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
