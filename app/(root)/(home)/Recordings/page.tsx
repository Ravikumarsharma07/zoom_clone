import CallLists from '@/components/customComponents/CallLists'
import React from 'react'

const page = () => {
  return (
    <div className='text-white'>
        <h2 className='text-3xl my-2'> Recordings</h2>
        <CallLists type='recordings'/>
    </div>
  )
}

export default page
