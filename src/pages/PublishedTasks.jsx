import React from "react";
import { useAlert } from "react-alert";
import { useEffect } from "react";
import { Container, Row, Col, Table, Form } from "react-bootstrap";

import { AppNavbar } from "../components/AppNavbar";

import { APIinstance } from "../instances/axios";
import { ENDPOINTS } from "../utils/constants";

const PublishedTasks = () => {
  const [tasks, setTasks] = React.useState([]);
  const alert = useAlert();

  //   const [modtasks, setModTasks] = React.useState([]);

  useEffect(() => {
    async function fetchMyTasks() {
      let response = await APIinstance.get(ENDPOINTS.mypublishedtasks);
      setTasks(response.data.tasks);
    }
    fetchMyTasks();
  }, []);

  const updateStatus = async (task, e) => {
    let response = await APIinstance.patch(ENDPOINTS.updatestatus, {
      taskId: task._id,
      status: e.target.value,
    });
    console.log(response);
    if (response.status === 200) {
      alert.success("Status Updated Successfully");
    }
  };

  return (
    <>
      <AppNavbar />
      <Container>
        <Row style={{ marginTop: "20px", marginBottom: "20px" }}>
          <Col xs={12}>
            <h1>Published Tasks</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12} style={{ overflowX: "scroll" }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Task ID</th>
                  <th>Author</th>
                  <th>Task Name</th>
                  <th>Task Description</th>
                  <th>Volunteer Count</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr>
                    <td>{task._id}</td>
                    <td>
                      {task.author.fullName} -{" "}
                      <a href={`mailto:${task.author.email}`}>
                        {task.author.email}
                      </a>
                    </td>
                    <td>{task.name}</td>
                    <td>{task.description}</td>
                    <td>{task.volunteers.length}</td>
                    <td>
                      <Form.Select
                        defaultValue={task.taskStatus}
                        onChange={(e) => updateStatus(task, e)}
                      >
                        <option value="listed">Listed</option>
                        <option value="started">Started</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </Form.Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PublishedTasks;
