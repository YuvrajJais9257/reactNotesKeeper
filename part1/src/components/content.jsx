import React from 'react'

const Content = () => {
      const part1 = 'Fundamentals of React'
      const part2 = 'Using props to pass data'
      const part3 = 'State of a component'
      const exercises1 = 10
      const exercises2 = 7
      const exercises3 = 14

  return (
    <div>
        <p>
            {part1} {exercises1}
        </p>
        <p>
            {part2} {exercises2}
        </p>
        <p>
            {part3} {exercises3}
        </p>
    </div>
  )
}

export default Content
