import * as React from 'react'
import { useEffect, useState } from 'react'



type appProps = {
    orgData: any
    setNewFilterarr: any
}

const Pagination = ({ orgData, setNewFilterarr }: appProps) => {

    // const [rowSize, setRowSize] = useState<number | string | any>(null)
    const [rowSize, setRowSize] = useState<number | string | any>(null)
    const [startPos, setStartPos] = useState<number>(0)
    const [endPos, setEndPos] = useState<number>(6)
    // const [newFilterarr, setNewFilterarr] = useState<any[]>([])
    const [currPage, setCurrPage] = useState<any>(0)
    const [endOffset, setEndOffset] = useState<any>()
    // const [pageCount, setPageCount] = useState<number | any[] | any>()

    // pagination

    useEffect(() => {
        console.log("from pagination")
        const endOffset = startPos + rowSize;
        setEndOffset(startPos + rowSize);
        // console.log(`start pos ${startPos}, endOffset ${endOffset}`)
        setNewFilterarr(rowSize ? orgData?.slice(startPos, endOffset) : orgData);
        // setPageCount(rowSize && Array(Math.ceil(orgData?.length / rowSize)));
        // console.log("arr of pg count", pageCount)
    }, [startPos, rowSize, orgData]);

    console.log(endOffset)

    const handlePageCount = (e: any) => {
        e.persist()
        if (e.target.value === 'All') {
            setRowSize(null)
        } else {
            setStartPos(0)
            setCurrPage(0)
            setEndPos(parseInt(e.target.value))
            setRowSize(parseInt(e.target.value))
        }
    }

    const handlePrev = () => {
        if (currPage > 0) {
            // this.setState({ currPage: currPage - 1 });
            setCurrPage(currPage - 1);
            if (startPos !== 0) {
                setStartPos(startPos - rowSize)
                setEndPos(endPos - rowSize)
            }

            //disabled Previous button here
        }
    }
    const handleNext = (newFilterarr: any) => {
        const pageCount = Math.ceil(rowSize && newFilterarr?.length / rowSize);
        if (currPage < pageCount - 1) {
            // this.setState({ currPage: this.state.currPage + 1 });
            setCurrPage(currPage + 1)
            // if (orgData?.length > endPos) {
            //     setStartPos(startPos + rowSize)
            //     setEndPos(endPos + rowSize)
            // }
            orgData?.length > endPos && setStartPos(startPos + rowSize); setEndPos(endPos + rowSize)
        } else {
            // disabled next button here
        }
    }

    const handlePageNavigation = (cpn: any) => {
        setStartPos((rowSize * cpn) - rowSize)
        setEndPos(rowSize * cpn)
    }

    return (
        <>
       <div className="container-fluid">
            <div className="footer fixed-bottom">
                    <div
                        className="d-flex flex-column flex-md-row justify-content-between align-items-center"
                        style={{ height: '3rem' }}
                    >
                        <div>
                            <span className="ps-5 opacity-50">Show</span>
                            <select name="carlist" className="col ms-2 px-1" onChange={handlePageCount} value={rowSize}>
                                <option className="ps-2" value="All" selected>
                                    All
                                </option>
                                <option className="" value="3" >
                                    3
                                </option>
                                <option className="" value="6" >
                                    6
                                </option>
                                <option className="" value="9">
                                    9
                                </option>
                                <option className="" value="12">
                                    12
                                </option>
                            </select>
                            {rowSize === null ?
                                <span className="ps-2 opacity-50 cursor-pointer">entries | Showing {startPos + 1} to {orgData?.length} of {orgData?.length} entries</span> :
                                <span className="ps-2 opacity-50 cursor-pointer">entries | Showing {startPos + 1} to {endPos > orgData?.length ? orgData?.length : endPos} of {orgData?.length} entries</span>
                            }
                        </div>
                        <div>
                            <span className={`${startPos < 1 ? "opacity-50 cursor-pointer" : ""}${"me-1 pointer cursor-pointer"}`}
                                onClick={() => handlePrev()}
                            >Previous</span>

                            {orgData && rowSize ?
                                [...Array(Math.ceil(orgData?.length / rowSize))]?.map((itr: any, i: any) => (
                                    <span key={i} className={`${currPage === i ? "border border-dark cursor-pointer" : "opacity-50 cursor-pointer"} ${"mx-1 px-3 py-2 pointer"}`}
                                        onClick={() => { handlePageNavigation(i + 1), setCurrPage(i) }}
                                    >
                                        {i + 1}
                                    </span>
                                )) :
                                <span className="border border-dark mx-1 px-3 py-2 pointer"> 
                                    1
                                </span>
                            }
                            <span className={`${orgData?.length > endPos ? "cursor-pointer" : "opacity-50 cursor-pointer"} ${"me-5 pointer"}`}
                                onClick={() => handleNext(orgData)}
                            >Next</span> 
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Pagination