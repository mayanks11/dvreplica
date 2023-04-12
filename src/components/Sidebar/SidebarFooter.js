import React from 'react'
export default function (props){
    return (
        <div style={{ margin: 7}}>
            <div style={{display:'flex', flexDirection:'row',justifyContent: 'space-between'}}>
            <a href='https://deltavrobo.com/resource/' target="_blank" style={{color: '#52dde0'}}>Get Started</a>
            <a href='https://deltavrobo.com/privacy-policy/' target="_blank" style={{color: '#52dde0'}}>Privacy Policy</a>
            </div>
            <div style={{color: '#52dde0', fontSize: '0.7rem'}}>DeltaV Robotics &copy; 2019. All rights Reserved.</div>
        </div>
    )
}