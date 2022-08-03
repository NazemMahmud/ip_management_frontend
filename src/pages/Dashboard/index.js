import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { Button, Card, Form, Row, Col } from "react-bootstrap";
import Datatable from "../../components/Datatable";
import { getAllIp } from "../../services/ip.service";
import PaginationComponent from "../../components/PaginationComponent";
import { setHttpParams } from "../../utility/utils";
import { useLocation, useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const initialParams = {
        orderBy: 'DESC',
        sortBy: 'id',
        pageOffset: 2,
        page: 1
    };

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

                changeUrl();
            })
            .catch(error => {
                // TODO: add a toaster
                console.log('error..', error);
            });
        // TODO: add a loader
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

    return (
        <DashboardLayout>
            <Row className="mb-5">
                <Col>
                    <Card >
                        <Card.Body>
                            <Form className="text-left">
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label> IP address </Form.Label>
                                    <Form.Control type="text" placeholder="Ex: 172.0.0.1" required />
                                    <Form.Text className="text-muted">
                                        Validation error message
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label> Label/Comment</Form.Label>
                                    <Form.Control type="text" placeholder="Ex: BC2 server" required />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="float-right">
                                    Submit
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Datatable data={dataList}/>
                </Col>
            </Row>
            {
                dataList.length && <PaginationComponent paginationInfo={paginationInfo}
                                                        paginationCallback={paginationCallback} />
            }

        </DashboardLayout>
    );
};

export default Dashboard;
