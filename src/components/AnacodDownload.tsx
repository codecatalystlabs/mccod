import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Menu, Modal, Select } from "antd";
import { CSVLink } from "react-csv";
import { useStore } from "../Context";
import { age_ranges } from "../Store";

const currentYear = new Date().getFullYear();
const endYear = 1990;
const years = Array.from(
  { length: currentYear - endYear + 1 },
  (_, index) => currentYear - index
);
const yearObjects = years.map((year) => ({
  value: year,
  label: year,
}));

const AnacodDownload = () => {
  const store = useStore();
  const anacodCsvBtn = useRef(null);
  const [anacodDownloading, setAnacodDownloading] = useState(false);
  const [anacodData, setAnacodData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(2022);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    handleAnacodDownload();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleAnacodDownload = async () => {
    if (anacodDownloading || !year) return;
    setAnacodDownloading(true);
    const headers = [
      "country_area",
      "iso3_code",
      "year4",
      "data_type",
      "icd_code",
      "sex_code",
      "total_num",
      ...age_ranges,
    ];

    const res: any = await store.fetchAnacodData(year);
    const data: any[] = Object.values(res).map((item: any) => {
      return [
        item.country_area,
        item.iso3_code,
        item.year,
        item.data_type,
        item.icd_code,
        item.sex_code,
        item.total_num,
        ...age_ranges.map((age) => item.age_ranges[age]),
      ];
    });
    setAnacodData([headers, ...data]);
  };

  useEffect(() => {
    console.log("anacodDownloading", anacodDownloading, anacodData);
    if (anacodDownloading && anacodData) {
      setTimeout(() => {
        const btn = anacodCsvBtn.current;
        if (!!btn) btn.link.click();
        setAnacodDownloading(false);
        setOpen(false);
      }, 1000);
    }
  }, [anacodDownloading, anacodData]);

  return (
    <>
      <Button onClick={showModal} type="link" size="small">
        Anacod Download
      </Button>
      <CSVLink
        ref={anacodCsvBtn}
        data={anacodData ?? []}
        filename={`anacod.csv`}
        style={{ display: "none" }}
      />
      <Modal
        visible={open}
        //   open={open}
        title="Anacod Download"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={anacodDownloading}
            disabled={!year}
            onClick={handleOk}
          >
            Download
          </Button>,
        ]}
      >
        <Form.Item label="Year">
          <Select
            value={year}
            onChange={setYear}
            options={yearObjects}
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Modal>
    </>
  );
};

export default AnacodDownload;
