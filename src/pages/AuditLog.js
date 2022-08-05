import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import DashboardLayout from "../layout/DashboardLayout";
import Datatable from "../components/Datatable";
import PaginationComponent from "../components/PaginationComponent";
import { setHttpParams } from "../utility/utils";
import { getAllIp, getSingleIp } from "../services/ip.service";
import AddUpdateForm from "../components/AddUpdateForm";
import { toast, ToastContainer } from "react-toastify";
import ToastComponent from "../components/ToastComponent";
import { SOMETHING_WENT_WRONG } from "../config/constants";
import 'react-toastify/dist/ReactToastify.css';
import LoaderComponent from "../components/LoaderComponent";

const AuditLog = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const initialParams = {
        orderBy: queryParams.get("orderBy") ?? 'DESC',
        sortBy: queryParams.get("sortBy") ?? 'id',
        pageOffset: queryParams.get("pageOffset") ?? 10,
        page: queryParams.get("page") ?? 1
    };

    const [isLoading, setIsLoading] = useState(true);
    const [isSetData, setIsSetData] = useState(false);
    const [params, setParams] = useState(initialParams);
    const [dataList, setDataList] = useState([]);

    // this info will come from API if it is paginated
    const [paginationInfo, setPaginationInfo] = useState({
        from: '',
        to: '',
        total: '',
        currentPage: '',
        perPage: '',
        lastPage: '',
        pageLimit: 3
    });

    /**
     * change url at the same time api call on params
     * so that individual URL can be used
     */
    const changeUrl = () => {
        const urlParams = setHttpParams(params);
        navigate(location.pathname + urlParams ? '?' + urlParams : '');
    };


    /** Get all/paginated ip address data for table **/
    useEffect( () => {
        getDataList();
    }, [params]);

    const getDataList = async () => {
        setIsLoading(true);
        await getAllIp(params)
            .then(res => {
                const response = res.data;
                setDataList(response.data);

                setPaginationInfo({
                    ...paginationInfo,
                    from: response.meta.from,
                    to: response.meta.to,
                    total: response.meta.total,
                    currentPage: response.meta.current_page,
                    perPage: response.meta.per_page,
                    lastPage: response.meta.last_page
                });
                setIsLoading(false);
                setIsSetData(true);
                changeUrl();
            })
            .catch(error => {
                setIsLoading(false);
                const errorMessage = error?.response?.data?.error ?? SOMETHING_WENT_WRONG;
                toast.error(<ToastComponent messages={errorMessage}/>);
            });
    };

    /**
     * change pagination / page id by clicking pagination component
     * it will trigger data list API call
     */
    const paginationCallback = page => {
        setParams({
            ...params,
            page: page,
        });
    };


    const loaderCallback = data => {
        setIsLoading(data);
    };


    return (
        <DashboardLayout logoutCallback={loaderCallback}>
            <ToastContainer position={"top-right"}
                            autoClose={3000}
                            hideProgressBar={false}
                            closeOnClick
                            pauseOnFocusLoss
                            draggable/>
            <LoaderComponent isLoading={isLoading} />

            <Row>
                <Col>
                    {/*{*/}
                    {/*    isSetData ? <Datatable data={dataList} handleEditCallback={handleEditCallback}/> : <></>*/}
                    {/*}*/}
                </Col>
            </Row>
            {/*{*/}
            {/*    dataList.length ?*/}
            {/*        <PaginationComponent paginationInfo={paginationInfo}*/}
            {/*                                            paginationCallback={paginationCallback}*/}
            {/*        /> : <></>*/}
            {/*}*/}

        </DashboardLayout>
    );
};

export default AuditLog;