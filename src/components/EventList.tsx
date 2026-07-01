import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { useStore } from "../Context";
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Drawer,
  Dropdown,
  Input,
  List,
  Menu,
  notification,
  Popover,
  Space,
  Table,
  Tabs
} from "antd";
import { AudioOutlined, DeleteOutlined, DownOutlined, LoadingOutlined, SettingOutlined } from "@ant-design/icons";
import Highcharts from "highcharts";
import { CSVLink } from "react-csv";
import englishString from "./../assets/english.json";
import frenchString from "./../assets/french.json";
import AnacodDownload from "./AnacodDownload";
import { useConfig } from "@dhis2/app-runtime";
import { TopDiseasesChart } from "./TopDiseasesChart";
// @ts-ignore
import dataDictionary from '../assets/DATA_DICTIONARY_V1.csv'

require("highcharts/modules/exporting")(Highcharts);

const { TabPane } = Tabs;

// Within a functional component body

const { RangePicker } = DatePicker;

const allLanguages = [
  {
    langName: "English",
    lang: englishString,
  },
  {
    langName: "French",
    lang: frenchString,
  },
];

// const extraHeaders =
//   process.env.NODE_ENV === "development"
//     ? { Authorization: `${process.env.REACT_APP_DHIS2_AUTHORIZATION}` }
//     : {};

// console.log(extraHeaders)

const FilterMenu = observer(({ field }) => {
  const store = useStore();
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(store.filters[field]?.value ?? "");

  const onFinish = () => {
    store.filters[field].value = value;
    store.queryEvents();
    setVisible(false);
  };

  const onChange = (e) => {
    console.log(e.target.value);
    setValue(e.target.value);
  };

  return (
    <Popover
      placement="bottom"
      visible={visible}
      onVisibleChange={setVisible}
      content={
        <div style={{ padding: "8px 12px" }}>
          <div style={{ margin: "8px 0px" }}>
            <Input
              placeholder="Contains text"
              onChange={onChange}
              value={value}
            />
          </div>

          <Button type="primary" htmlType="button" onClick={onFinish}>
            Update
          </Button>
        </div>
      }
      trigger="click"
    >
      <Button>
        {store.filters[field]?.title}{" "}
        {!!store.filters[field]?.value && `: ${store.filters[field]?.value}`}{" "}
        <DownOutlined />
      </Button>
    </Popover>
  );
});

const DeleteRecordAction = observer(({ record }) => {
  const [loading, setLoading] = useState(false);
  const store = useStore();
  console.log("record", record)
  const handleDelete = async () => {
    setLoading(true);
    await store.deleteEvent(record.event);
    store.queryEvents();
    notification.success({
      message: "Record deleted successfully",
      duration: 3,
    });
    setLoading(false);
  };
  return (
    <Space size="middle">
      <Button
        danger
        loading={loading}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleDelete();
        }}
      >
        <DeleteOutlined />
        Delete
      </Button>
    </Space>
  );
});

export const EventList = observer(() => {
  const store = useStore();
  const [visible, setVisible] = useState(false);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [visibleStates, setVisibleStates] = useState({});
  const dropdowns = useRef([]);
  const [downloadData, setDownloadData] = useState([]);
  const [downloadng, setDownloadng] = useState(false);
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const csvBtn = useRef(null);
  const [selectedDateRange, setSelectedDateRange] = useState(null);

  // const myPicker = useRef<HTMLInputElement|null>(null);

  const [activeLanguage, setActiveLanguage] = useState(
    store.activeLanguage || allLanguages[0]
  );

  useEffect(() => {
    setActiveLanguage(store?.activeLanguage || allLanguages[0]);
  }, [store?.activeLanguage]);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const { baseUrl, apiVersion } = useConfig();

  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: "#1890ff",
      }}
    />
  );

  const onSearch = (value) => {
    store.search = value;
    console.log(value);
    setSearching(true);
    store.queryEvents().then(() => {
      setSearching(false);
    });
  };

  const handleDownload = (allorgs = false, startDate = null, endDate = null) => {
    const orgUnit = store.selectedOrgUnit
    // console.log("org unit is", orgUnit)
    // setDownloadng(true);
    let baseUrl = window.location.href.split("/api")[0];
    // let allorgUrl = `${baseUrl}/api/29/analytics/events/query/vf8dN49jprI.csv?dimension=pe:LAST_5_YEARS&dimension=ou:akV6429SUqu&dimension=aKclf7Yl1PE.ZKBE8Xm9DJG&dimension=aKclf7Yl1PE.MOstDqSY0gO&dimension=aKclf7Yl1PE.ZYKmQ9GPOaF&dimension=aKclf7Yl1PE.FGagV1Utrdh&dimension=aKclf7Yl1PE.zwKo51BEayZ&dimension=aKclf7Yl1PE.Z41di0TRjIu&dimension=aKclf7Yl1PE.dsiwvNQLe5n&dimension=aKclf7Yl1PE.RbrUuKFSqkZ&dimension=aKclf7Yl1PE.q7e7FOXKnOf&dimension=aKclf7Yl1PE.e96GB4CXyd3&dimension=aKclf7Yl1PE.i8rrl8YWxLF&dimension=aKclf7Yl1PE.sfpqAeqKeyQ&dimension=aKclf7Yl1PE.zD0E77W4rFs&dimension=aKclf7Yl1PE.cSDJ9kSJkFP&dimension=aKclf7Yl1PE.WkXxkKEJLsg&dimension=aKclf7Yl1PE.Ylht9kCLSRW&dimension=aKclf7Yl1PE.zb7uTuBCPrN&dimension=aKclf7Yl1PE.tuMMQsGtE69&dimension=aKclf7Yl1PE.uckvenVFnwf&dimension=aKclf7Yl1PE.fleGy9CvHYh&dimension=aKclf7Yl1PE.myydnkmLfhp&dimension=aKclf7Yl1PE.QGFYJK00ES7&dimension=aKclf7Yl1PE.C8n6hBilwsX&dimension=aKclf7Yl1PE.ZFdJRT3PaUd&dimension=aKclf7Yl1PE.hO8No9fHVd2&dimension=aKclf7Yl1PE.aC64sB86ThG&dimension=aKclf7Yl1PE.CnPGhOcERFF&dimension=aKclf7Yl1PE.IeS8V8Yf40N&dimension=aKclf7Yl1PE.Op5pSvgHo1M&dimension=aKclf7Yl1PE.eCVDO6lt4go&dimension=aKclf7Yl1PE.cmZrrHfTxW3&dimension=aKclf7Yl1PE.QTKk2Xt8KDu&dimension=aKclf7Yl1PE.dTd7txVzhgY&dimension=aKclf7Yl1PE.xeE5TQLvucB&dimension=aKclf7Yl1PE.ctbKSNV2cg7&dimension=aKclf7Yl1PE.mI0UjQioE7E&dimension=aKclf7Yl1PE.krhrEBwJeNC&dimension=aKclf7Yl1PE.u5ebhwtAmpU&dimension=aKclf7Yl1PE.ZKtS7L49Poo&dimension=aKclf7Yl1PE.OxJgcwH15L7&dimension=aKclf7Yl1PE.fJDDc9mlubU&dimension=aKclf7Yl1PE.Zrn8LD3LoKY&dimension=aKclf7Yl1PE.z89Wr84V2G6&dimension=aKclf7Yl1PE.Kk0hmrJPR90&dimension=aKclf7Yl1PE.j5TIQx3gHyF&dimension=aKclf7Yl1PE.JhHwdQ337nn&dimension=aKclf7Yl1PE.jY3K6Bv4o9Q&dimension=aKclf7Yl1PE.UfG52s4YcUt&dimension=aKclf7Yl1PE.FhHPxY16vet&dimension=aKclf7Yl1PE.KsGOxFyzIs1&dimension=aKclf7Yl1PE.b4yPk98om7e&dimension=aKclf7Yl1PE.gNM2Yhypydx&dimension=aKclf7Yl1PE.tYH7drlbNya&dimension=aKclf7Yl1PE.fQWuywOaoN2&dimension=aKclf7Yl1PE.wX3i3gkTG4m&dimension=aKclf7Yl1PE.xDMX2CJ4Xw3&dimension=aKclf7Yl1PE.o1hG9vr0peF&dimension=aKclf7Yl1PE.AZSlwlRAFig&dimension=aKclf7Yl1PE.U18Tnfz9EKd&dimension=aKclf7Yl1PE.DKlOhZJOCrX&dimension=aKclf7Yl1PE.kGIDD5xIeLC&dimension=aKclf7Yl1PE.V4rE1tsj5Rb&dimension=aKclf7Yl1PE.ivnHp4M4hFF&dimension=aKclf7Yl1PE.jf9TogeSZpk&dimension=aKclf7Yl1PE.xAWYJtQsg8M&dimension=aKclf7Yl1PE.lQ1Byr04JTx&dimension=aKclf7Yl1PE.DdfDMFW4EJ9&dimension=aKclf7Yl1PE.GFVhltTCG8b&dimension=aKclf7Yl1PE.KpfvNQSsWIw&dimension=aKclf7Yl1PE.AJAraEcfH63&dimension=aKclf7Yl1PE.ymyLrfEcYkD&dimension=aKclf7Yl1PE.K5BDPJQk1BP&dimension=aKclf7Yl1PE.uaxjt0inPNF&dimension=aKclf7Yl1PE.Kz29xNOBjsJ&dimension=aKclf7Yl1PE.ZXZZfzBpu8a&dimension=aKclf7Yl1PE.cp5xzqVU2Vw&dimension=aKclf7Yl1PE.lu9BiHPxNqH&dimension=aKclf7Yl1PE.PaoRZbokFWJ&stage=aKclf7Yl1PE&displayProperty=NAME&outputType=EVENT&desc=eventdate&paging=false`;

    let allorgUrl = `${baseUrl}/api/29/analytics/events/query/vf8dN49jprI.csv?startDate=${startDate}&endDate=${endDate}&ouMode=DESCENDANTS&dimension=ou:akV6429SUqu&dimension=aKclf7Yl1PE.ZKBE8Xm9DJG&dimension=aKclf7Yl1PE.MOstDqSY0gO&dimension=aKclf7Yl1PE.Q7VM7swIWb6&dimension=aKclf7Yl1PE.QmcOqkcNTip&dimension=aKclf7Yl1PE.tuGPnGHWqQn&dimension=aKclf7Yl1PE.ZYKmQ9GPOaF&dimension=aKclf7Yl1PE.zwKo51BEayZ&dimension=aKclf7Yl1PE.Z41di0TRjIu&dimension=aKclf7Yl1PE.dsiwvNQLe5n&dimension=aKclf7Yl1PE.RbrUuKFSqkZ&dimension=aKclf7Yl1PE.q7e7FOXKnOf&dimension=aKclf7Yl1PE.e96GB4CXyd3&dimension=aKclf7Yl1PE.i8rrl8YWxLF&dimension=aKclf7Yl1PE.sfpqAeqKeyQ&dimension=aKclf7Yl1PE.zD0E77W4rFs&dimension=aKclf7Yl1PE.cSDJ9kSJkFP&dimension=aKclf7Yl1PE.WkXxkKEJLsg&dimension=aKclf7Yl1PE.Ylht9kCLSRW&dimension=aKclf7Yl1PE.zb7uTuBCPrN&dimension=aKclf7Yl1PE.tuMMQsGtE69&dimension=aKclf7Yl1PE.uckvenVFnwf&dimension=aKclf7Yl1PE.fleGy9CvHYh&dimension=aKclf7Yl1PE.myydnkmLfhp&dimension=aKclf7Yl1PE.QGFYJK00ES7&dimension=aKclf7Yl1PE.C8n6hBilwsX&dimension=aKclf7Yl1PE.ZFdJRT3PaUd&dimension=aKclf7Yl1PE.hO8No9fHVd2&dimension=aKclf7Yl1PE.aC64sB86ThG&dimension=aKclf7Yl1PE.CnPGhOcERFF&dimension=aKclf7Yl1PE.IeS8V8Yf40N&dimension=aKclf7Yl1PE.Op5pSvgHo1M&dimension=aKclf7Yl1PE.eCVDO6lt4go&dimension=aKclf7Yl1PE.cmZrrHfTxW3&dimension=aKclf7Yl1PE.QTKk2Xt8KDu&dimension=aKclf7Yl1PE.dTd7txVzhgY&dimension=aKclf7Yl1PE.xeE5TQLvucB&dimension=aKclf7Yl1PE.ctbKSNV2cg7&dimension=aKclf7Yl1PE.mI0UjQioE7E&dimension=aKclf7Yl1PE.krhrEBwJeNC&dimension=aKclf7Yl1PE.u5ebhwtAmpU&dimension=aKclf7Yl1PE.ZKtS7L49Poo&dimension=aKclf7Yl1PE.OxJgcwH15L7&dimension=aKclf7Yl1PE.fJDDc9mlubU&dimension=aKclf7Yl1PE.Zrn8LD3LoKY&dimension=aKclf7Yl1PE.z89Wr84V2G6&dimension=aKclf7Yl1PE.Kk0hmrJPR90&dimension=aKclf7Yl1PE.j5TIQx3gHyF&dimension=aKclf7Yl1PE.JhHwdQ337nn&dimension=aKclf7Yl1PE.jY3K6Bv4o9Q&dimension=aKclf7Yl1PE.UfG52s4YcUt&dimension=aKclf7Yl1PE.FhHPxY16vet&dimension=aKclf7Yl1PE.KsGOxFyzIs1&dimension=aKclf7Yl1PE.b4yPk98om7e&dimension=aKclf7Yl1PE.gNM2Yhypydx&dimension=aKclf7Yl1PE.tYH7drlbNya&dimension=aKclf7Yl1PE.fQWuywOaoN2&dimension=aKclf7Yl1PE.wX3i3gkTG4m&dimension=aKclf7Yl1PE.xDMX2CJ4Xw3&dimension=aKclf7Yl1PE.o1hG9vr0peF&dimension=aKclf7Yl1PE.AZSlwlRAFig&dimension=aKclf7Yl1PE.U18Tnfz9EKd&dimension=aKclf7Yl1PE.DKlOhZJOCrX&dimension=aKclf7Yl1PE.kGIDD5xIeLC&dimension=aKclf7Yl1PE.V4rE1tsj5Rb&dimension=aKclf7Yl1PE.ivnHp4M4hFF&dimension=aKclf7Yl1PE.jf9TogeSZpk&dimension=aKclf7Yl1PE.xAWYJtQsg8M&dimension=aKclf7Yl1PE.lQ1Byr04JTx&dimension=aKclf7Yl1PE.DdfDMFW4EJ9&dimension=aKclf7Yl1PE.GFVhltTCG8b&dimension=aKclf7Yl1PE.KpfvNQSsWIw&dimension=aKclf7Yl1PE.AJAraEcfH63&dimension=aKclf7Yl1PE.ymyLrfEcYkD&dimension=aKclf7Yl1PE.K5BDPJQk1BP&dimension=aKclf7Yl1PE.uaxjt0inPNF&dimension=aKclf7Yl1PE.Kz29xNOBjsJ&dimension=aKclf7Yl1PE.ZXZZfzBpu8a&dimension=aKclf7Yl1PE.cp5xzqVU2Vw&dimension=aKclf7Yl1PE.lu9BiHPxNqH&dimension=aKclf7Yl1PE.PaoRZbokFWJ&dimension=aKclf7Yl1PE.twVlVWM3ffz&stage=aKclf7Yl1PE&displayProperty=NAME&outputType=EVENT&desc=eventdate&paging=false`;
    let url = `${baseUrl}/api/29/analytics/events/query/vf8dN49jprI.csv?
			startDate=${startDate}&endDate=${endDate}
			&ouMode=DESCENDANTS
			&dimension=ou:${orgUnit}
			&dimension=aKclf7Yl1PE.ZKBE8Xm9DJG
			&dimension=aKclf7Yl1PE.MOstDqSY0gO
			&dimension=aKclf7Yl1PE.ZYKmQ9GPOaF
			&dimension=aKclf7Yl1PE.zwKo51BEayZ
			&dimension=aKclf7Yl1PE.Z41di0TRjIu
			&dimension=aKclf7Yl1PE.dsiwvNQLe5n
			&dimension=aKclf7Yl1PE.RbrUuKFSqkZ
			&dimension=aKclf7Yl1PE.q7e7FOXKnOf
			&dimension=aKclf7Yl1PE.e96GB4CXyd3
			&dimension=aKclf7Yl1PE.i8rrl8YWxLF
			&dimension=aKclf7Yl1PE.sfpqAeqKeyQ
			&dimension=aKclf7Yl1PE.zD0E77W4rFs
			&dimension=aKclf7Yl1PE.cSDJ9kSJkFP
			&dimension=aKclf7Yl1PE.Q7VM7swIWb6
			&dimension=aKclf7Yl1PE.QmcOqkcNTip
			&dimension=aKclf7Yl1PE.tuGPnGHWqQn
			
			&dimension=aKclf7Yl1PE.WkXxkKEJLsg
			&dimension=aKclf7Yl1PE.aC64sB86ThG
			&dimension=aKclf7Yl1PE.zb7uTuBCPrN
			&dimension=aKclf7Yl1PE.tuMMQsGtE69
			&dimension=aKclf7Yl1PE.uckvenVFnwf
			&dimension=aKclf7Yl1PE.Ylht9kCLSRW
			&dimension=aKclf7Yl1PE.hO8No9fHVd2
			&dimension=aKclf7Yl1PE.QGFYJK00ES7
			&dimension=aKclf7Yl1PE.C8n6hBilwsX
			&dimension=aKclf7Yl1PE.ZFdJRT3PaUd
			&dimension=aKclf7Yl1PE.myydnkmLfhp
			&dimension=aKclf7Yl1PE.fleGy9CvHYh
			&dimension=aKclf7Yl1PE.CnPGhOcERFF
			&dimension=aKclf7Yl1PE.IeS8V8Yf40N
			&dimension=aKclf7Yl1PE.Op5pSvgHo1M
			&dimension=aKclf7Yl1PE.cmZrrHfTxW3
			&dimension=aKclf7Yl1PE.eCVDO6lt4go
			&dimension=aKclf7Yl1PE.QTKk2Xt8KDu
			&dimension=aKclf7Yl1PE.dTd7txVzhgY
			&dimension=aKclf7Yl1PE.Kk0hmrJPR90
			&dimension=aKclf7Yl1PE.j5TIQx3gHyF
			&dimension=aKclf7Yl1PE.JhHwdQ337nn
			&dimension=aKclf7Yl1PE.jY3K6Bv4o9Q
			&dimension=aKclf7Yl1PE.UfG52s4YcUt
			&dimension=aKclf7Yl1PE.FhHPxY16vet
			&dimension=aKclf7Yl1PE.KsGOxFyzIs1
			&dimension=aKclf7Yl1PE.b4yPk98om7e
			&dimension=aKclf7Yl1PE.gNM2Yhypydx
			&dimension=aKclf7Yl1PE.tYH7drlbNya
			&dimension=aKclf7Yl1PE.fQWuywOaoN2
			&dimension=aKclf7Yl1PE.wX3i3gkTG4m
			&dimension=aKclf7Yl1PE.xDMX2CJ4Xw3
			&dimension=aKclf7Yl1PE.o1hG9vr0peF
			&dimension=aKclf7Yl1PE.AZSlwlRAFig
			&dimension=aKclf7Yl1PE.U18Tnfz9EKd
			&dimension=aKclf7Yl1PE.DKlOhZJOCrX
			&dimension=aKclf7Yl1PE.kGIDD5xIeLC
			&dimension=aKclf7Yl1PE.V4rE1tsj5Rb
			&dimension=aKclf7Yl1PE.ivnHp4M4hFF
			&dimension=aKclf7Yl1PE.jf9TogeSZpk
			&dimension=aKclf7Yl1PE.xAWYJtQsg8M
			&dimension=aKclf7Yl1PE.lQ1Byr04JTx
			&dimension=aKclf7Yl1PE.DdfDMFW4EJ9
			&dimension=aKclf7Yl1PE.GFVhltTCG8b
			&dimension=aKclf7Yl1PE.KpfvNQSsWIw
			&dimension=aKclf7Yl1PE.AJAraEcfH63
			&dimension=aKclf7Yl1PE.ymyLrfEcYkD
			&dimension=aKclf7Yl1PE.K5BDPJQk1BP
			&dimension=aKclf7Yl1PE.uaxjt0inPNF
			&dimension=aKclf7Yl1PE.Kz29xNOBjsJ
			&dimension=aKclf7Yl1PE.ZXZZfzBpu8a
			&dimension=aKclf7Yl1PE.cp5xzqVU2Vw
			&dimension=aKclf7Yl1PE.lu9BiHPxNqH
			&dimension=aKclf7Yl1PE.PaoRZbokFWJ
			&stage=aKclf7Yl1PE
			&displayProperty=NAME
			&outputType=EVENT
			&desc=eventdate
			&paging=false`;

    window.open(allorgs ? allorgUrl : url, "_blank");
    // store
    // 	.downloadData(allorgs)
    // 	.then((dd) => {
    // 		setDownloadData(dd);
    // 		let btn = csvBtn.current;
    // 		if (!!btn) btn.link.click();
    // 		setDownloadng(false);
    // 	})
    // 	.catch((e) => {
    // 		setDownloadng(false);
    // 	});
  };

  const handleChangeDate = (ranges) => {
    if (!ranges) {
      store.clearSelectedDlDateRange();
    } else {
      const startDate = ranges[0].format("YYYY-MM-DD");
      const endDate = ranges[1].format("YYYY-MM-DD");

      store.changeSelectedDlDateRange(startDate, endDate);
      setSelectedDateRange([startDate, endDate]);
      // console.log("ranges are", selectedDateRange)

    }
  };

  const handleDataDicDl = () => {
    const link = document.createElement("a");
    link.href = "assets/DATA DICTIONARY.csv";
    link.download = "DATA DICTIONARY.csv";
    link.click();
  };


  const downloadFile = () => {
    console.log("Download function called");
    window.location.href = dataDictionary;
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <Button onClick={() => alert("deleted")}>Delete</Button>
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    store.clearEventList();
    store.queryEvents();
  }, [store, store.selectedNationality, store.selectedOrgUnit, store.selectedDlDateRange])

  useEffect(() => {
    if (filtersInitialized || !store?.data) return;
    console.log("Setting inital filters");
    store.setInitialFilters();

    setFiltersInitialized(true);
  }, [store?.data]);

  const columnsWithAction: any = store.columns.length ? [
    ...store.columns,
    {
      title: "Action",
      key: "action",
      // fixed: "right",
      dataIndex: null,
      render: (_, record) => <DeleteRecordAction record={record} />,
    },
  ] : [];

  console.log("columnsWithAction", columnsWithAction);
  // console.log(store.data ? JSON.parse(JSON.stringify(store.data)) : "");

  return (
    <div>
      <Tabs onChange={() => { }} type="card">
        {/* <TabPane tab="Mortality Report" key="1">
               <WeeklyReport />
            </TabPane> */}
        <TabPane tab="Top 20 Causes of Death" key="1">
          <TopDiseasesChart />
        </TabPane>
      </Tabs>

      {/* <AnacodDownload /> */}
      {store.data ? (
        <Card
          title="Cases"
          bodyStyle={{ maxWidth: "100vw", padding: 0, margin: 0 }}
          extra={
            <div style={{ display: "flex", gap: "10px" }}>
              <SettingOutlined
                style={{ fontSize: "24px" }}
                onClick={showDrawer}
              />
              <CSVLink
                ref={csvBtn}
                data={downloadData}
                filename={"cod-cases.csv"}
                style={{ display: "none" }}
              />

              <Dropdown.Button
                icon={<DownOutlined />}
                overlay={
                  <Menu>
                    <Menu.Item onClick={
                      () => {
                        if (selectedDateRange) {
                          handleDownload(true, selectedDateRange[0], selectedDateRange[1])
                        } else {
                          // Get the current date
                          const currentDate = new Date();

                          // Calculate the start date by subtracting 12 months from the current date
                          const startDate = new Date();
                          startDate.setMonth(currentDate.getMonth() - 12);

                          //format the date
                          const formatDateString = (date) => {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            return `${year}-${month}-${day}`;
                          };

                          handleDownload(true, formatDateString(startDate), formatDateString(currentDate))
                        }
                      }
                      // () => handleDownload(true)
                    }>
                      Download from all org units
                    </Menu.Item>
                    <Menu.Item>
                      <AnacodDownload />
                    </Menu.Item>
                    <Menu.Item onClick={() => downloadFile()}>
                      Data Dictionary
                    </Menu.Item>
                  </Menu>
                }
                onClick={() => {
                  if (selectedDateRange) {
                    handleDownload(false, selectedDateRange[0], selectedDateRange[1]);
                  } else {
                    handleDownload(true);
                    // Handle case where date range is not selected
                    console.log("Date range is not selected");
                  }
                }}
                style={{ fontSize: "24px" }}
              >
                {downloadng && <LoadingOutlined style={{ fontSize: "14px" }} />}
                Download
              </Dropdown.Button>
            </div>
          }
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                padding: "15px",
                display: "flex",
                gap: "10px",
              }}
            >
              {Object.keys(store.filters).map((field: any) => (
                <FilterMenu key={field} field={field} />
              ))}
            </div>

            <div>
              <RangePicker
                style={{ width: "100%" }}
                onChange={handleChangeDate}
                allowClear
                size="large"
              />
            </div>
          </div>

          <div style={{ width: "100%", overflowX: "auto" }}>
            <Table
              rowKey={(record: any) => record.event}
              dataSource={store.data}
              columns={columnsWithAction}
              rowClassName={() => "l"}
              bordered
              onRow={(record, rowIndex) => {
                // Fix for age that doesn't show if its zero
                // console.log("Record is ", record);
                if (record && record["34"] === "") {
                  record["34"] = "0";
                }
                return {
                  onClick: (event: any) => {
                    store.setCurrentEvent(record);
                    store.editEvent();
                  },
                };
              }}
              pagination={{
                showSizeChanger: true,
                total: store.total,
                pageSize: store.pageSize,
                pageSizeOptions: ["5", "10", "15", "20", "25", "50", "100"],
              }}
              onChange={store.handleChange}
            />
          </div>
        </Card>
      ) : null}
      <Drawer
        title="Columns"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        width={512}
      >
        <List
          itemLayout="horizontal"
          dataSource={store.availableDataElements}
          renderItem={(item: any) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Checkbox
                    checked={item.selected}
                    onChange={store.includeColumns(item.id)}
                  />
                }
                title={item.name}
              />
            </List.Item>
          )}
        />
      </Drawer>
    </div>
  );
});
