
const Tooltip: React.FC<{children?:any, message:any}> = ({children, message}) => {
    return (
        <div className="group relative">
            {children}
            <span className="absolute z-50 top-7 scale-0 transition-all rounded bg-purple p-2 text-xs text-black group-hover:scale-100 opacity-100 w-80">{message}</span>
        </div>
        )
  };
  
  export default Tooltip;
  