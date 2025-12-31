import ChartComponent from '@/components/chart.component'
import FilterAnalyticsComponent from '@/components/filter-analytics.component'
import React from 'react'

const page = () => {



  return (
    <div className='w-full h-full px-8 py-6'>

      <h1 className='text-2xl font-semibold'>Analytics</h1>

      <hr className='mt-4'/>

      <FilterAnalyticsComponent />
      <ChartComponent />
      
    </div>
  )
}

export default page
