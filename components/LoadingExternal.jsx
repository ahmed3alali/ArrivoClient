
import { Loader2 } from 'lucide-react'


const LoaderExternal = () => {
  return (
    <div>
         <div className="flex items-center justify-center min-h-[300px] py-20">
    <div className="flex flex-col items-center text-center">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
      <p className="text-lg font-medium text-gray-700">جاري التحميل </p>
      <p className="text-sm text-gray-500 mt-1">
  نقدر انتظاركم 
      </p>
    </div>
  </div>
    </div>
  )
}

export default LoaderExternal;