import React from "react";
import { useEffect } from "react";
import { Container, Row, Col, Table, Modal } from "react-bootstrap";

import { AppNavbar } from "../components/AppNavbar";
import { useAlert } from "react-alert";

import { APIinstance } from "../instances/axios";
import { ENDPOINTS } from "../utils/constants";

const VolunteeredTasks = () => {
  const [tasks, setTasks] = React.useState([]);
  const [certs, setCerts] = React.useState([]);
  const alert = useAlert();

  //   const [modtasks, setModTasks] = React.useState([]);

  async function sep(tasks) {
    let newtasks = [];
    let newcerts = [];
    for (let i = 0; i < tasks.length; i++) {
      let stask = tasks[i];
      if (stask.volunteers) {
        for (let j = 0; j < stask.volunteers.length; j++) {
          let newtask = {
            ...stask,
            volunteer: stask.volunteers[j],
          };
          newtasks.push(newtask);
        }
      }
    }
    for (let i = 0; i < newtasks.length; i++) {
      let resp = await APIinstance.post(ENDPOINTS.getCerts, {
        taskId: newtasks[i]._id,
      });
      newcerts.push(...resp.data.certificates);
    }
    setTasks(newtasks);
    setCerts(newcerts);
  }

  const getCert = (task, type) => {
    let cert = certs.find((cert) => {
      return (
        cert.taskid === task._id &&
        cert.userid === task.volunteer._id &&
        cert.certificateType === type
      );
    });
    if (cert) return cert;
    else return {};
  };

  const onClickIssueCompletion = async (task, volunteer) => {
    let resp = await APIinstance.post(ENDPOINTS.issueCompletion, {
      taskId: task._id,
      volunteerId: volunteer._id,
    });
    if (resp.status === 200) {
      alert.success("Completion Certificate Issued");
      setTasks((prevtasks) => {
        return prevtasks;
      });
      fetchMyTasks();
    }
  };

  async function fetchMyTasks() {
    let response = await APIinstance.get(ENDPOINTS.mypublishedtasks);
    sep(response.data.tasks);
  }

  useEffect(() => {
    fetchMyTasks();
  }, []);

  return (
    <>
      <AppNavbar />
      <Container>
        <Row style={{ marginTop: "20px", marginBottom: "20px" }}>
          <Col xs={12}>
            <h1>Volunteered Tasks</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12} style={{ overflowX: "scroll" }}>
            {tasks ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Task Name</th>
                    <th>Task Description</th>
                    <th>Volunteer</th>
                    <th>Participation Certificate ID</th>
                    <th>Participation Certificate</th>
                    <th>Status</th>
                    <th>Completion Certificate ID</th>
                    <th>Completion Certificate</th>
                    <th>Task Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr>
                      <td>{task._id}</td>
                      <td>{task.name}</td>
                      <td>{task.description}</td>
                      <td>
                        {task.volunteer.fullName} -{" "}
                        <a href={`mailto:${task.volunteer.email}`}>
                          {task.volunteer.email}
                        </a>
                      </td>
                      <td>
                        {getCert(task, "participation").certificateId
                          ? getCert(task, "participation").certificateId
                          : "Not Generated"}
                      </td>
                      <td>
                        {getCert(task, "participation").link ? (
                          <a
                            href={getCert(task, "participation").link}
                            target="_blank"
                          >
                            View Certificate
                          </a>
                        ) : (
                          "Not Generated"
                        )}
                      </td>
                      <td>{task.taskStatus}</td>
                      <td>
                        {getCert(task, "completion").certificateId ||
                          "Not Generated"}
                      </td>
                      <td>
                        {getCert(task, "completion").link ? (
                          <a
                            href={getCert(task, "completion").link}
                            target="_blank"
                          >
                            View Certificate
                          </a>
                        ) : (
                          "Not Generated"
                        )}
                      </td>
                      <td>
                        <button
                          style={{
                            fontSize: 12,
                            padding: "5px",
                            backgroundColor: getCert(task, "completion")
                              .certificateId
                              ? "#ADADAD"
                              : "#4CAF50",
                          }}
                          disabled={
                            getCert(task, "completion").certificateId
                              ? true
                              : false
                          }
                          onClick={() =>
                            onClickIssueCompletion(task, task.volunteer)
                          }
                        >
                          Issue Completion Certificate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              ""
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default VolunteeredTasks;
