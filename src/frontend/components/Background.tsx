import React from 'react'

export const Background = (props: any): React.ReactElement => {
  return (
    <div className='min-h-screen' style={{backgroundColor: '#f3f1ed'}}>
        <div className="mx-auto max-w-screen-xl">
            {props.children}
        </div>
    </div>
  )
}
