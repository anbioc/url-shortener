import { redirect } from 'next/navigation'
import React from 'react'

const page = () => {

    redirect("/links")
  return (
    <div>
      "Home"
    </div>
  )
}

export default page
