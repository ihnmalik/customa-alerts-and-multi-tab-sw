import { useEffect } from "react"


interface IMultiTabTestProps {
    pageId: string
}

const MultiTabTest: React.FC<IMultiTabTestProps> = ({ pageId }) => {

    useEffect(() => {
        console.log("read data")
    }, [])

    const saveData = () => {
        console.log("posting message......")
        navigator.serviceWorker.controller?.postMessage({ type: 'SAVE_SHEET_WAL', sheetId: 'sheet2k', message: 'this is sheet wal' });
    }

    return (
        <div>
            <button
                onClick={saveData}
            >Save sheet wal</button>
        </div>
    )
}

export default MultiTabTest