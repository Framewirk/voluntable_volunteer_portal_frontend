import React from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import { useAlert } from "react-alert";

import { ExcelRenderer } from "react-excel-renderer";

import moment from "moment";

import * as XLSX from "xlsx";

import { AppNavbar } from "../components/AppNavbar";

import { ENDPOINTS } from "../utils/constants";
import { APIinstance } from "../instances/axios";

const BulkUpload = () => {
  const [rows, setRows] = React.useState([]);
  const [cols, setCols] = React.useState([]);

  const [sheetdata, setSheetData] = React.useState([]);

  const [file, setFile] = React.useState(null);

  const alert = useAlert();

  const onUploadExcel = (e) => {
    let fileObj = e.target.files[0];
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        setCols(resp.cols);
        setRows(resp.rows);
        setSheetData(resp.rows);
        console.log(resp.rows)
        setFile(fileObj);
      }
    });
  };

  async function publishTasks() {
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary", cellDates: true, cellNF: false, cellText: false });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      let jsondata = XLSX.utils.sheet_to_json(ws, { header: 1 });
      /* Update state */
      let cleaneddata = jsondata.filter((row) => {
        return row.length > 0 && row[0] !== "Task Name";
      });

      let jsonobject = cleaneddata.map((row) => {
        let startDate = moment(row[3], "DD/MM/YYYY").format("MM/DD/YYYY");
        let endDate = moment(row[4], "DD/MM/YYYY").format("MM/DD/YYYY");
        return {
          name: row[0],
          description: row[1],
          files: row[2] !== undefined ? row[2].split(",") : "",
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          effortHours: parseInt(row[5]),
        //   taskStatus: row[6],
          categories: row[6] !== undefined ? row[6].split(",") : "",
        };
      });

      function getPreviousDay(date = new Date()) {
        const previous = new Date(date.getTime());
        previous.setDate(date.getDate() - 1);
      
        return previous;
      }
      
      for(let i=0;i<jsonobject.length;i++){
        if(jsonobject[i]["name"] === "" ||  jsonobject[i]["description"] === "" || jsonobject[i]["startDate"] === "" || jsonobject[i]["endDate"] === "" || jsonobject[i]["effortHours"] === ""){
            alert.error("Please fill all Mandatory fields");
            return;
        }
        if(Date.parse(jsonobject[i]["startDate"]) < getPreviousDay()){
            alert.error("Start Date cannot be less than today's date");
            return;
        }
        if(jsonobject[i]["startDate"] > jsonobject[i]["endDate"]){
            alert.error("Start Date cannot be greater than End Date");
            return;
        }
        if(parseFloat(jsonobject[i]["effortHours"]) <= 0 || parseFloat(jsonobject[i]["effortHours"]).toString() === "NaN"){
            alert.error("Effort Hours cannot be negative/zero");
            return;
        }
      }

      console.log(jsonobject);

      let response = await APIinstance.post(ENDPOINTS.createTasks, jsonobject);
      if (response.data.status === "Ok") {
        alert.success("Tasks Added Successfully");
      }
    };
    reader.readAsBinaryString(file);
  }

  const ExcelDateToJSDate = (date) => {
    if(typeof date === 'string') {
        return date;
    }
    let converted_date = new Date(Math.round((date - 25569) * 864e5));
    converted_date = String(converted_date).slice(4, 15)
    date = converted_date.split(" ")
    let day = date[1];
    let month = date[0];
    month = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3 + 1
    if (month.toString().length <= 1)
        month = '0' + month
    let year = date[2];
    return String(day + '-' + month + '-' + year.slice(2, 4))
}

  return (
    <>
      <AppNavbar />
      <Container>
        <Row style={{ marginTop: "20px", marginBottom: "20px" }}>
          <Col xs={12}>
            <h1>Bulk Upload</h1>
          </Col>
        </Row>
        <Row>
          <Col
            xs={12}
            md={6}
            style={{ textAlign: "start", justifyContent: "center" }}
          >
            <h3 style={{ textAlign: "start" }}>Upload a Excel file</h3>
            <input type="file" onChange={onUploadExcel} />
          </Col>
          <Col
            xs={6}
            md={3}
            style={{ textAlign: "center", justifyContent: "center" }}
          >
            <button
              style={{ margin: "5px", fontSize: "14px" }}
              onClick={() => window.open("/Sample.xlsx", "_blank")}
            >
              Download Sample
            </button>
          </Col>
          <Col
            xs={6}
            md={3}
            style={{ textAlign: "center", justifyContent: "center" }}
          >
            <button
              style={{ margin: "5px", fontSize: "14px" }}
              onClick={() => publishTasks()}
            >
              Publish Tasks
            </button>
          </Col>
        </Row>
        <Row style={{ marginTop: "10px" }}>
          <Col
            xs={12}
            style={{ textAlign: "center", justifyContent: "center" }}
          >
            {sheetdata.length>0 ? 
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {sheetdata[0].map((col) => {
                            return <th>{col}</th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {sheetdata.slice(1).map((row) => {
                        return <tr>
                            <td>{row[0]}</td>
                            <td>{row[1]}</td>
                            <td>{row[2]}</td>
                            <td>{ExcelDateToJSDate(row[3])}</td>
                            <td>{ExcelDateToJSDate(row[4])}</td>
                            <td>{row[5]}</td>
                            <td>{row[6]}</td>
                        </tr>
                    })}
                </tbody>
            </Table>
            :""}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BulkUpload;
