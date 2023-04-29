import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { AppNavbar } from "../components/AppNavbar";
import { APIinstance } from "../instances/axios";
import { ENDPOINTS } from "../utils/constants";
import { WithContext as ReactTags } from "react-tag-input";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.enter];

const HomePage = () => {
  const navigate = useNavigate();
  const alert = useAlert();

  const [links, setLinks] = useState([]);

  const handleDelete = (i) => {
    setLinks(links.filter((link, index) => index !== i));
  };

  const handleAddition = (link) => {
    setLinks([...links, link]);
  };

  const onTaskSubmit = async (e) => {
    e.preventDefault();

    let taskname = e.target.formTaskName.value;
    let taskdescription = e.target.formTaskDescription.value;
    let categories = e.target.formCategory.value.split(",");
    let effortHours = e.target.formEffortHours.value;
    let startDate = e.target.formStartDate.value;
    let endDate = e.target.formEndDate.value;

    let files = links.map((link) => link.text);

    console.log(files);

    let task = {
      name: taskname,
      description: taskdescription,
      files,
      startDate,
      endDate,
      effortHours,
      categories,
    };

    let response = await APIinstance.post(ENDPOINTS.createTask, task).catch((err) => {
        console.log(err);
        alert.error("Error creating task");
    });
    if (response.data.status === "Ok") {
      alert.success("Task Added Successfully");
      let formTaskName = document.getElementById("formTaskName");
      let formEffortHours = document.getElementById("formEffortHours");
      let formTaskDescription = document.getElementById("formTaskDescription");
      let formCategory = document.getElementById("formCategory");
      let formStartDate = document.getElementById("formStartDate");
      let formEndDate = document.getElementById("formEndDate");
      formTaskName.value = "";
        formEffortHours.value = 0;
        formTaskDescription.value = "";
        formCategory.value = "";
        formStartDate.value = "";
        formEndDate.value = "";
        setLinks([]);
    }
  };

  useEffect(() => {
    // const fetchTasks = async () => {
    //   let response = await APIinstance.get(ENDPOINTS.getTasks);
    //   setTasks(response.data.tasks);
    // };
    // fetchTasks();
  }, []);
  return (
    <>
      <AppNavbar />
      <Container
        style={{
          marginTop: "3%",
          marginBottom: "3%",
          justifyContent: "center",
        }}
      >
        <Row style={{ justifyContent: "center" }}>
          <Col
            xs={12}
            style={{
              backgroundColor: "#eeeeee",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
              maxWidth: "600px",
            }}
          >
            <div style={{ fontSize: 30, textAlign: "center" }}>Create Task</div>
            <Form style={{ textAlign: "start" }} onSubmit={onTaskSubmit} id="frmtask">
              <Row>
                <Form.Group as={Col} className="mb-3" controlId="formTaskName">
                  <Form.Label>Task Name<span style={{ color: "#ff0000" }}>*</span></Form.Label>
                  <Form.Control type="text" placeholder="Enter Task Name" />
                </Form.Group>
                <Form.Group
                  as={Col}
                  className="mb-3"
                  controlId="formEffortHours"
                >
                  <Form.Label>Estimated time (in Hours)<span style={{ color: "#ff0000" }}>*</span></Form.Label>
                  <Form.Control type="number" placeholder="0" min="0" />
                </Form.Group>
              </Row>
              <Form.Group className="mb-3" controlId="formTaskDescription">
                <Form.Label>Task Description<span style={{ color: "#ff0000" }}>*</span></Form.Label>
                <Form.Control
                  as="textarea"
                  type="text"
                  placeholder="Enter Task Description"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formCategory">
                <Form.Label>Categories ( Comma Seperated Values )</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Technology,Science,Trending"
                />
              </Form.Group>

              <Row>
                <Form.Group as={Col} className="mb-3" controlId="formStartDate">
                  <Form.Label>Start Date<span style={{ color: "#ff0000" }}>*</span></Form.Label>
                  <Form.Control type="date" min={new Date().toISOString().split("T")[0]}/>
                </Form.Group>
                <Form.Group as={Col} className="mb-3" controlId="formEndDate">
                  <Form.Label>End Date<span style={{ color: "#ff0000" }}>*</span></Form.Label>
                  <Form.Control type="date" min={new Date().toISOString().split("T")[0]}/>
                </Form.Group>
              </Row>
              <div style={{ maxWidth: "100%" }}>
                <Form.Group className="mb-3" controlId="formLinks">
                  <Form.Label>Links</Form.Label>
                  <ReactTags
                    inline
                    tags={links}
                    delimiters={delimiters}
                    handleDelete={handleDelete}
                    handleAddition={handleAddition}
                    inputFieldPosition="bottom"
                    editable
                  />
                </Form.Group>
              </div>

              <button
                style={{
                  margin: "10%",
                  color: "#4CAF50",
                  backgroundColor: "transparent",
                  border: "#4CAF50 1px solid",
                  margin: "5px",
                }}
                type="submit"
              >
                Publish Task
              </button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomePage;
