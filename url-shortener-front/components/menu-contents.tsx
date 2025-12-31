import { cn } from '@/lib/utils'
import { ChartNoAxesCombined, LinkIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { redirect } from 'next/navigation'

export default function MenuContents ({pathname, classname}: {pathname: string, classname: string}){
  return (
     <div className={cn('md:flex w-1/5 mt-2 mb-2 ms-2 me-2 p-2 flex-col items-start justify-between', 
        classname
     )}>
 
        <div className='flex flex-col items-start w-full'>
                 <div className="flex items-center justify-center w-full mt-2 ">
          <h1 className="text-2xl font-bold ">Menu</h1>
        </div>
                  <Link
          href="/links"
          className={cn(
            "flex items-center justify-start gap-4 w-full mt-4 rounded-md ps-4 py-2 ",
            pathname == "/links" ? "bg-sky-100" : ""
          )}
        >
          <LinkIcon
            className={cn(pathname == "/links" ? "text-sky-700" : "")}
          />
          <h1
            className={cn(
              "text-xl",
              pathname == "/links" ? "text-sky-700 font-semibold" : ""
            )}
          >
            Links
          </h1>
        </Link>

        <Link
          href="/analytics"
          className={cn(
            "flex items-center justify-start gap-4 w-full mt-4 rounded-md ps-4 py-2 ",
            pathname == "/analytics" ? "bg-sky-100" : ""
          )}
        >
          <ChartNoAxesCombined
            className={cn(pathname == "/analytics" ? "text-sky-700" : "")}
          />
          <h1
            className={cn(
              "text-xl",
              pathname == "/analytics" ? "text-sky-700 font-semibold" : ""
            )}
          >
            Analytics
          </h1>
        </Link>
        </div>

        <div className='w-full mb-10'>
          <Button className="w-full " variant={"outline"} onClick={async ()=> {
            await fetch("/api/external/auth/sign-out");
            redirect("sign-in")

          }}>Sign out</Button>
        </div>

      </div>
  )
}

