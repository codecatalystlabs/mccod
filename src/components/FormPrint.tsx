import React from "react";
import {
    Button,
    Card,
    Checkbox,
    DatePicker,
    Typography,
    Form,
    Input,
    InputNumber,
    Popconfirm,
    Select,
    Tooltip,
    Modal,
    Alert,
} from "antd";
import moment from "moment";
import { observer } from "mobx-react";
import { useStore } from "../Context";
import { useTranslation } from "../utils/useTranslation";
import image from './img/moh_logo.png';

const { Title } = Typography;

const styles: { [name: string]: React.CSSProperties } = {
    tableCell: {
        // display: "flex",
        // alignItems: "center",
        height: "100%",
        padding: "8px",
    },
    answerLine: {
        borderBottom: "1px solid",
        height: "100%",
        flex: 1,
        marginBottom: "8px",
        paddingBottom: "4px",
        display: "flex",
        alignItems: "flex-end",
        fontWeight: 600,
    },
    tableAnswer: {
        width: "65%",
        fontSize: "20px",
        fontWeight: 700,
        color: "#3b3b3b",
        padding: "8px",
    },
};

const cellStyle = {
    border: '1px solid #000', // Border style
    padding: '8px' // Padding to create space between content and border
};


const PrintableFormData = observer((props: any) => {
    console.log("props", props);
    const form = props.form;
    const date = form.getFieldValue("eventDate");
    const eventDate = !!date ? moment(date).format("DD-MMM-YYYY") : "";
    const store = useStore();
    const facility = store.currentOrganisationTree;
    const tr = useTranslation();

    // const caseNumber = props.formVals["ZKBE8Xm9DJG"];
    const surname = props.formVals["Q7VM7swIWb6"];
    const fullname = props.formVals["ZYKmQ9GPOaF"];
    const givenName = !!fullname ? fullname : props.formVals["QmcOqkcNTip"];
    const otherName = props.formVals["tuGPnGHWqQn"];
    const nin = props.formVals["MOstDqSY0gO"];
    const sex = props.formVals["e96GB4CXyd3"];
    const district = props.formVals["u44XP9fZweA"];
    const subcounty = props.formVals["t5nTEmlScSt"];
    const village = props.formVals["dsiwvNQLe5n"];
    const dod = props.formVals["i8rrl8YWxLF"];
    const dateOfDeath = !!dod ? moment(dod).format("DD-MMM-YYYY") : "";

    const county = props.formVals["se3wRj1bYPo"];
    const certified = props.certified;
    const causeOfDeath = props.formVals["QTKk2Xt8KDu"];
    const placeOfDeath = props.formVals["xNCSFrgdUgi"];


    const getDEValue = (dataElementId) => {
        const value = props.formVals[dataElementId];
        if (!value) return "";
        if (typeof value === "string") return value;
        if (value instanceof moment) return moment(value).format("DD-MMM-YYYY");
        return value.toString();
    };

    return (
        <>
            <table className="my-2 w-full print-table" style={{ borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={cellStyle}>SURNAME</th>
                        <th style={cellStyle}>GIVEN NAME</th>
                        <th style={cellStyle}>OTHER NAME</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={cellStyle}> {surname}</td>
                        <td style={cellStyle}> {givenName}</td>
                        <td style={cellStyle}> {otherName}</td>
                    </tr>
                </tbody>
            </table>

            <table className="my-2 w-full print-table" style={{ borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={cellStyle}>NIN of deceased</th>
                        <th style={cellStyle}>SEX</th>
                        <th style={cellStyle}>DISTRICT</th>
                        <th style={cellStyle}>SUB-COUNTY</th>
                        <th style={cellStyle}>COUNTY</th>
                        <th style={cellStyle}>VILLAGE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={cellStyle}> {nin}</td>
                        <td style={cellStyle}>{sex}</td>
                        <td style={cellStyle}> {district}</td>
                        <td style={cellStyle}>{subcounty}</td>
                        <td style={cellStyle}> {county}</td>
                        <td style={cellStyle}>{village}</td>
                    </tr>
                </tbody>
            </table>

            <table className="my-2 w-full print-table" style={{ borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={cellStyle}>DATE OF DEATH OF DECEASED</th>
                        <th style={cellStyle}>PLACE OF DEATH</th>
                        <th style={cellStyle}>CAUSE OF DEATH</th>
                        <th style={cellStyle}>WHETHER CAUSE OF DEATH WAS MEDICALLY CERTIFIED</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={cellStyle}> {dateOfDeath}</td>
                        <td style={cellStyle}>{placeOfDeath}</td>
                        <td style={cellStyle}> {causeOfDeath}</td>
                        <td style={cellStyle}>{certified ? "YES" : "NO"}</td>
                    </tr>
                </tbody>
            </table>
            {/*<table className="my-2 w-full print-table">*/}
            {/*	<tbody>*/}
            {/*		{store.printColumns.map((dataElement) => (*/}
            {/*			<tr key={dataElement.id}>*/}
            {/*				<td style={styles.tableCell}>{dataElement.name}</td>*/}
            {/*				<td style={styles.tableAnswer}>*/}
            {/*					{getDEValue(dataElement.id)}*/}
            {/*				</td>*/}
            {/*			</tr>*/}
            {/*		))}*/}
            {/*	</tbody>*/}
            {/*</table>*/}

            <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                    style={{
                        marginTop: "30px",
                        height: "50px",
                        width: "50%",
                        display: "flex",
                        alignItems: "flex-end",
                    }}
                >
                    <b style={{ marginBottom: "10px" }}>{tr('Issued On')}:</b>
                    <div style={{ ...styles.answerLine, marginLeft: "8px" }}>
                        {eventDate}
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div
                        style={{
                            marginTop: "40px",
                            width: "40%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div style={styles.answerLine}></div>
                        <b>{tr('Notifier Of Births and Deaths')}</b>
                        <div
                            style={{ ...styles.answerLine, marginTop: "50px" }}
                        >
                            {facility}
                        </div>
                        <b>{tr('Registration Area')}</b>
                    </div>
                </div>
            </div>
        </>
    );
});

const CardTitle = observer((props: any) => {
    const tr = useTranslation();

    return (
        <>
            <div style={{ textAlign: "right" }}>
                {tr('REG NO:')} {props.caseNumber}
            </div>
            <div style={{ textAlign: "center" }}>
                <p>
                    <img src={image} alt="Logo" style={{ width: "20%", height: "20%" }} /></p>
            </div>
            <Title className="text-center" level={2}>
                {tr('DEATH NOTIFICATION RECORD')}
            </Title>
            <p style={{ fontStyle: "italic", textAlign: "center" }}>
                {tr('Registration of Persons Act 2015')}
            </p>
        </>
    );
});

export const FormPrint = React.forwardRef<any, any>((props, ref) => {
    const caseNumber = props.formVals["ZKBE8Xm9DJG"];
    return (
        <Card ref={ref} title={<CardTitle caseNumber={caseNumber} />}>
            <PrintableFormData {...props} />
        </Card>
    );
});
