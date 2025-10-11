export default function EmptyState({ message , icon }) {
  // messsage : pass through as props to be displayed as text
  // icon : pass through icon details and styles as a props 
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="relative max-w-sm w-full">
        <div className="relative h-full p-6 bg-blue-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg flex flex-col items-center justify-center text-center transition-colors duration-300">
          {icon && (
            <div className="flex items-center justify-center w-14 h-14 mb-3 bg-blue-300 dark:bg-gray-800 rounded-lg">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-semibold text-black dark:text-gray-100">
            {message}
          </h3>
        </div>
      </div>
    </div>
  );
}
