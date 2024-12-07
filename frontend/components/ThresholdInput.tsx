'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/slider'

export default function ThresholdInput({ setThreshold }: { setThreshold: (thres: number) => void}) {
  
  const [thres, setThres] = useState(0.2);

  return (
    <div className="space-y-2">
      <label htmlFor="threshold" className="block text-sm font-medium text-gray-700">
        Set Crowd Density Threshold
      </label>
      <Slider
        id="threshold"
        min={0.1}
        max={2}
        step={0.2}
        value={[thres]}
        onValueChange={(value) => {
          setThreshold(value[0])
          setThres(value[0])
        }}
        className="w-full"
      />
      <p className="text-sm text-gray-500">
        Current threshold: {thres}
      </p>
    </div>
  )
}

