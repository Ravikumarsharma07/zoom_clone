import CallLists from '@/components/customComponents/CallLists'
import React from 'react'

const Page = () => {
  return (
    <div className='text-white'>
        <h2 className='text-3xl my-2'>Previous Meetings</h2>
        <CallLists type='ended'/>
    </div>
  )
}

export default Page
